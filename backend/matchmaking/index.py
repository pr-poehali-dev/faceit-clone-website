import json
import os
import random
import psycopg2

MAPS = ['Mirage', 'Inferno', 'Nuke', 'Overpass', 'Ancient', 'Anubis', 'Vertigo']
SERVERS = ['Москва', 'Франкфурт', 'Стокгольм', 'Амстердам']


def auth(cur, token):
    cur.execute("SELECT id, nickname, avatar_url, elo FROM players WHERE auth_token = %s", (token,))
    return cur.fetchone()


def lobby_payload(cur, lobby_id):
    cur.execute("SELECT status, map, server FROM lobbies WHERE id = %s", (lobby_id,))
    lb = cur.fetchone()
    cur.execute(
        "SELECT p.nickname, p.avatar_url, p.elo, lp.team FROM lobby_players lp "
        "JOIN players p ON p.id = lp.player_id WHERE lp.lobby_id = %s ORDER BY lp.team, p.elo DESC",
        (lobby_id,))
    members = [
        {'nickname': r[0], 'avatar_url': r[1] or '', 'elo': r[2], 'team': r[3]}
        for r in cur.fetchall()
    ]
    return {
        'lobby_id': lobby_id,
        'status': lb[0],
        'map': lb[1],
        'server': lb[2],
        'players': members,
    }


def handler(event: dict, context) -> dict:
    '''
    Матчмейкинг: join (встать в очередь), leave (выйти), status (проверить).
    При наборе 10 игроков создаётся лобби с пиком карт и серверов (veto).
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

    body = json.loads(event.get('body') or '{}')
    params = event.get('queryStringParameters') or {}
    action = body.get('action') or params.get('action', 'status')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    me = auth(cur, token)
    if not me:
        cur.close()
        conn.close()
        return {'statusCode': 401, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid token'})}
    my_id = me[0]

    def respond(payload, code=200):
        cur.close()
        conn.close()
        return {'statusCode': code, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps(payload)}

    cur.execute("SELECT lobby_id FROM lobby_players WHERE player_id = %s", (my_id,))
    in_lobby = cur.fetchone()
    if in_lobby:
        return respond({'state': 'lobby', **lobby_payload(cur, in_lobby[0])})

    if action == 'leave':
        cur.execute("DELETE FROM queue WHERE player_id = %s", (my_id,))
        conn.commit()
        return respond({'state': 'idle'})

    if action == 'join':
        cur.execute("INSERT INTO queue (player_id) VALUES (%s) ON CONFLICT (player_id) DO NOTHING",
                    (my_id,))
        conn.commit()

    cur.execute("SELECT player_id FROM queue ORDER BY joined_at ASC LIMIT 10")
    queued = [r[0] for r in cur.fetchall()]

    if len(queued) >= 10:
        chosen_map = random.choice(MAPS)
        chosen_server = random.choice(SERVERS)
        cur.execute(
            "INSERT INTO lobbies (status, map, server) VALUES ('veto', %s, %s) RETURNING id",
            (chosen_map, chosen_server))
        lobby_id = cur.fetchone()[0]
        ten = queued[:10]
        cur.execute(
            "SELECT id FROM players WHERE id = ANY(%s) ORDER BY elo DESC", (ten,))
        ordered = [r[0] for r in cur.fetchall()]
        for idx, pid in enumerate(ordered):
            team = 1 if idx % 2 == 0 else 2
            cur.execute(
                "INSERT INTO lobby_players (lobby_id, player_id, team) VALUES (%s, %s, %s)",
                (lobby_id, pid, team))
        cur.execute("DELETE FROM queue WHERE player_id = ANY(%s)", (ten,))
        conn.commit()
        cur.execute("SELECT lobby_id FROM lobby_players WHERE player_id = %s", (my_id,))
        ml = cur.fetchone()
        if ml:
            return respond({'state': 'lobby', **lobby_payload(cur, ml[0])})

    cur.execute("SELECT COUNT(*) FROM queue")
    count = cur.fetchone()[0]
    cur.execute("SELECT 1 FROM queue WHERE player_id = %s", (my_id,))
    is_searching = cur.fetchone() is not None
    return respond({
        'state': 'searching' if is_searching else 'idle',
        'in_queue': count,
        'needed': 10,
    })
