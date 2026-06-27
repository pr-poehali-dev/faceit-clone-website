import json
import os
import re
import secrets
import urllib.parse
import urllib.request
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Авторизация игроков через Steam OpenID.
    action=login — возвращает URL для редиректа на Steam.
    action=callback — проверяет ответ Steam, создаёт игрока (500 elo) и токен.
    '''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'login')

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            body = {}

    return_url = body.get('return_url') or params.get('return_url', '')

    if action == 'login':
        steam_params = {
            'openid.ns': 'http://specs.openid.net/auth/2.0',
            'openid.mode': 'checkid_setup',
            'openid.return_to': return_url,
            'openid.realm': return_url,
            'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
        }
        url = 'https://steamcommunity.com/openid/login?' + urllib.parse.urlencode(steam_params)
        return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'url': url})}

    if action == 'callback':
        validate = dict(params)
        validate['openid.mode'] = 'check_authentication'
        data = urllib.parse.urlencode(validate).encode()
        req = urllib.request.Request('https://steamcommunity.com/openid/login', data=data)
        with urllib.request.urlopen(req, timeout=10) as resp:
            text = resp.read().decode()
        if 'is_valid:true' not in text:
            return {'statusCode': 401, 'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Steam verification failed'})}

        claimed = params.get('openid.claimed_id', '')
        m = re.search(r'(\d{17})', claimed)
        if not m:
            return {'statusCode': 400, 'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'No steam id'})}
        steam_id = m.group(1)

        nickname = 'Player'
        avatar = ''
        api_key = os.environ.get('STEAM_API_KEY', '')
        if api_key:
            info_url = ('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/'
                        f'?key={api_key}&steamids={steam_id}')
            with urllib.request.urlopen(info_url, timeout=10) as r:
                pdata = json.loads(r.read().decode())
            players = pdata.get('response', {}).get('players', [])
            if players:
                nickname = players[0].get('personaname', 'Player')
                avatar = players[0].get('avatarfull', '')

        token = secrets.token_hex(32)
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute("SELECT id, avatar_url FROM players WHERE steam_id = %s", (steam_id,))
        row = cur.fetchone()
        if row:
            existing_avatar = row[1]
            new_avatar = existing_avatar or avatar
            cur.execute(
                "UPDATE players SET nickname = %s, avatar_url = %s, auth_token = %s WHERE steam_id = %s",
                (nickname, new_avatar, token, steam_id))
        else:
            cur.execute(
                "INSERT INTO players (steam_id, nickname, avatar_url, elo, auth_token) "
                "VALUES (%s, %s, %s, 500, %s)",
                (steam_id, nickname, avatar, token))
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'token': token, 'steam_id': steam_id})}

    return {'statusCode': 400, 'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Unknown action'})}
