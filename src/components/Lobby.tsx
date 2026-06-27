import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { MatchState } from '@/lib/api';

interface Props {
  lobby: MatchState;
  onLeave: () => void;
}

const ALL_MAPS = ['Mirage', 'Inferno', 'Nuke', 'Overpass', 'Ancient', 'Anubis', 'Vertigo'];
const ALL_SERVERS = ['Москва', 'Франкфурт', 'Стокгольм', 'Амстердам'];

const Lobby = ({ lobby, onLeave }: Props) => {
  const [pickedMap, setPickedMap] = useState<string>(lobby.map || '');
  const [pickedServer, setPickedServer] = useState<string>(lobby.server || '');
  const [ready, setReady] = useState(false);

  const team1 = (lobby.players || []).filter((p) => p.team === 1);
  const team2 = (lobby.players || []).filter((p) => p.team === 2);

  const TeamCol = ({ title, players, accent }: { title: string; players: typeof team1; accent: string }) => (
    <div className="flex-1 border border-border bg-card">
      <div className={`px-4 py-3 border-b border-border font-display uppercase tracking-widest text-sm ${accent}`}>
        {title} · {players.length}/5
      </div>
      <div className="divide-y divide-border">
        {players.map((p, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            {p.avatar_url ? (
              <img src={p.avatar_url} alt="" className="w-8 h-8 rounded object-cover" />
            ) : (
              <div className="w-8 h-8 rounded bg-secondary grid place-items-center text-xs">{p.nickname[0]}</div>
            )}
            <span className="font-display uppercase tracking-wide text-sm truncate flex-1">{p.nickname}</span>
            <span className="font-mono text-xs text-muted-foreground">{p.elo}</span>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 5 - players.length) }).map((_, i) => (
          <div key={`e${i}`} className="flex items-center gap-3 px-4 py-3 opacity-30">
            <div className="w-8 h-8 rounded bg-secondary" />
            <span className="text-sm text-muted-foreground">Ожидание...</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-background overflow-y-auto">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="relative container py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <div className="font-display uppercase tracking-widest text-primary text-sm mb-1">Матч найден · комната #{lobby.lobby_id}</div>
            <h2 className="font-display font-bold text-3xl uppercase tracking-tight">Выбор карты и сервера</h2>
          </div>
          <Button onClick={onLeave} variant="outline"
                  className="font-display uppercase tracking-wide border-border hover:border-destructive hover:text-destructive">
            Покинуть
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
          <TeamCol title="Команда A" players={team1} accent="text-primary" />
          <div className="grid place-items-center px-4">
            <span className="font-display font-bold text-2xl text-muted-foreground">VS</span>
          </div>
          <TeamCol title="Команда B" players={team2} accent="text-accent" />
        </div>

        {/* Map pick */}
        <div className="mb-8">
          <div className="font-display uppercase tracking-widest text-sm text-muted-foreground mb-3">Пик карты</div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {ALL_MAPS.map((m) => (
              <button key={m} onClick={() => setPickedMap(m)}
                className={`p-3 border font-display uppercase tracking-wide text-sm transition-all clip-corner ${
                  pickedMap === m
                    ? 'border-primary bg-primary/10 text-primary neon-border'
                    : 'border-border bg-card hover:border-primary/50'
                }`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Server pick */}
        <div className="mb-8">
          <div className="font-display uppercase tracking-widest text-sm text-muted-foreground mb-3">Выбор сервера</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ALL_SERVERS.map((s) => (
              <button key={s} onClick={() => setPickedServer(s)}
                className={`p-3 border font-display uppercase tracking-wide text-sm transition-all flex items-center justify-center gap-2 ${
                  pickedServer === s
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-card hover:border-accent/50'
                }`}>
                <Icon name="Server" size={14} /> {s}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Карта: <span className="text-primary font-display uppercase">{pickedMap || '—'}</span> · Сервер: <span className="text-accent font-display uppercase">{pickedServer || '—'}</span>
          </div>
          <Button onClick={() => setReady(true)} disabled={!pickedMap || !pickedServer || ready}
            className="font-display uppercase tracking-wide clip-corner bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {ready ? <><Icon name="Check" size={16} className="mr-2" /> Готов</> : 'Подтвердить готовность'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
