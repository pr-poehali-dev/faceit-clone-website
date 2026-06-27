CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    steam_id VARCHAR(32) UNIQUE NOT NULL,
    nickname VARCHAR(64) NOT NULL,
    avatar_url TEXT,
    elo INTEGER NOT NULL DEFAULT 500,
    matches_played INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    kills INTEGER NOT NULL DEFAULT 0,
    deaths INTEGER NOT NULL DEFAULT 0,
    rounds INTEGER NOT NULL DEFAULT 0,
    headshots INTEGER NOT NULL DEFAULT 0,
    damage INTEGER NOT NULL DEFAULT 0,
    auth_token VARCHAR(64),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_players_steam ON players(steam_id);
CREATE INDEX idx_players_token ON players(auth_token);
CREATE INDEX idx_players_elo ON players(elo DESC);

CREATE TABLE queue (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(id),
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(player_id)
);

CREATE TABLE lobbies (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'veto',
    map VARCHAR(40),
    server VARCHAR(40),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE lobby_players (
    id SERIAL PRIMARY KEY,
    lobby_id INTEGER NOT NULL REFERENCES lobbies(id),
    player_id INTEGER NOT NULL REFERENCES players(id),
    team INTEGER NOT NULL DEFAULT 1,
    UNIQUE(lobby_id, player_id)
);
