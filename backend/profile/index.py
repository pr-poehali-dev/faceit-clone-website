import json
import os
import base64
import uuid
import psycopg2
import boto3


def get_player(cur, token):
    cur.execute(
        "SELECT id, steam_id, nickname, avatar_url, elo, matches_played, wins, "
        "kills, deaths, rounds, headshots, damage FROM players WHERE auth_token = %s",
        (token,))
    return cur.fetchone()


def build_stats(row):
    (pid, steam_id, nickname, avatar, elo, matches, wins,
     kills, deaths, rounds, headshots, damage) = row
    winrate = round(wins / matches * 100, 1) if matches else 0.0
    avg = round(kills / matches, 1) if matches else 0.0
    kd = round(kills / deaths, 2) if deaths else float(kills)
    kr = round(kills / rounds, 2) if rounds else 0.0
    hs = round(headshots / kills * 100, 1) if kills else 0.0
    adr = round(damage / rounds, 1) if rounds else 0.0
    return {
        'id': pid,
        'steam_id': steam_id,
        'nickname': nickname,
        'avatar_url': avatar or '',
        'elo': elo,
        'matches': matches,
        'stats': {
            'WinRate': winrate,
            'AVG': avg,
            'KD': kd,
            'KR': kr,
            'HS': hs,
            'ADR': adr,
        }
    }


def handler(event: dict, context) -> dict:
    '''
    Профиль игрока: получение статистики (WinRate, AVG, KD, K/R, HS%, ADR)
    и загрузка фото профиля в S3.
    '''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    if not token:
        return {'statusCode': 401, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'No token'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    row = get_player(cur, token)
    if not row:
        cur.close()
        conn.close()
        return {'statusCode': 401, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid token'})}

    if method == 'GET':
        result = build_stats(row)
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps(result)}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        image_b64 = body.get('image', '')
        if not image_b64:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'No image'})}
        if ',' in image_b64:
            image_b64 = image_b64.split(',', 1)[1]
        data = base64.b64decode(image_b64)
        key = f"avatars/{uuid.uuid4().hex}.png"
        s3 = boto3.client(
            's3', endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'])
        s3.put_object(Bucket='files', Key=key, Body=data, ContentType='image/png')
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        cur.execute("UPDATE players SET avatar_url = %s WHERE auth_token = %s", (cdn_url, token))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'avatar_url': cdn_url})}

    cur.close()
    conn.close()
    return {'statusCode': 400, 'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Bad method'})}
