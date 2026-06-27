import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import Matchmaking from '@/components/Matchmaking';
import Lobby from '@/components/Lobby';
import ProfileModal from '@/components/ProfileModal';
import {
  steamLogin, handleSteamCallback, getProfile, getToken,
  matchmaking, Profile, MatchState,
} from '@/lib/api';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/541f49fe-923b-43d8-a255-9f0a291b2052/files/fdf30da7-7f8a-48a0-bb96-c99b6eb02653.jpg';

const stats = [
  { label: 'Игроков онлайн', value: '142 580', icon: 'Users' },
  { label: 'Матчей сегодня', value: '8 941', icon: 'Swords' },
  { label: 'Призовой фонд', value: '$2.4M', icon: 'Trophy' },
  { label: 'Турниров', value: '316', icon: 'Flame' },
];

type View = 'home' | 'matchmaking' | 'lobby';

const Index = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<View>('home');
  const [lobby, setLobby] = useState<MatchState | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await handleSteamCallback();
      if (getToken()) {
        const p = await getProfile();
        setProfile(p);
        if (p) {
          const s = await matchmaking('status');
          if (s.state === 'lobby') { setLobby(s); setView('lobby'); }
        }
      }
      setLoading(false);
    })();
  }, []);

  const onPlay = () => {
    if (!profile) { steamLogin(); return; }
    setView('matchmaking');
  };

  const onLobbyFound = (s: MatchState) => { setLobby(s); setView('lobby'); };
  const leaveLobby = async () => { await matchmaking('leave'); setLobby(null); setView('home'); };
  const logout = () => { setProfile(null); setShowProfile(false); };

  if (view === 'matchmaking') {
    return <Matchmaking onLobby={onLobbyFound} onClose={() => setView('home')} />;
  }
  if (view === 'lobby' && lobby) {
    return <Lobby lobby={lobby} onLeave={leaveLobby} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 grid place-items-center bg-primary text-primary-foreground clip-corner animate-pulse-neon">
                <Icon name="Crosshair" size={20} />
              </div>
              <span className="font-display font-bold text-2xl tracking-wider">
                FRAG<span className="text-primary text-glow">ZONE</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 font-display text-sm tracking-wide uppercase text-muted-foreground">
              <a className="text-primary" href="#leaders">Лидеры</a>
              <a className="hover:text-foreground transition-colors" href="#rating">Рейтинг</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {profile ? (
              <button onClick={() => setShowProfile(true)}
                className="flex items-center gap-3 px-3 py-1.5 border border-border hover:border-primary/60 transition-colors clip-corner">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded bg-secondary grid place-items-center text-xs font-display">{profile.nickname[0]}</div>
                )}
                <span className="font-display uppercase text-sm tracking-wide hidden sm:inline">{profile.nickname}</span>
                <span className="font-display font-bold text-primary text-sm">{profile.elo}</span>
              </button>
            ) : (
              <Button onClick={steamLogin}
                className="font-display uppercase tracking-wide text-sm clip-corner bg-primary text-primary-foreground hover:bg-primary/90">
                <Icon name="Gamepad2" size={16} className="mr-2" /> Войти через Steam
              </Button>
            )}
            <Button onClick={onPlay}
              className="font-display uppercase tracking-wide text-sm clip-corner bg-accent text-accent-foreground hover:bg-accent/90">
              Играть
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          <div className="absolute inset-0 cyber-grid opacity-20" />
        </div>
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/40 text-primary text-xs font-display uppercase tracking-widest bg-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-neon" />
              Сезон 12 · открыт
            </div>
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[0.95] uppercase tracking-tight">
              Доминируй <br />
              на <span className="text-primary text-glow">арене</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Соревновательный матчмейкинг 5х5, честный Elo-рейтинг и прогноз твоего ранга.
              Заходи через Steam и забирай первую победу.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={onPlay}
                className="font-display uppercase tracking-wide clip-corner bg-primary text-primary-foreground hover:bg-primary/90 neon-border">
                <Icon name="Swords" size={18} className="mr-2" /> Найти матч
              </Button>
              {!profile && (
                <Button size="lg" variant="outline" onClick={steamLogin}
                  className="font-display uppercase tracking-wide border-border hover:border-primary hover:text-primary">
                  <Icon name="Gamepad2" size={18} className="mr-2" /> Войти через Steam
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {stats.map((s) => (
            <div key={s.label} className="bg-background p-6 group hover:bg-card transition-colors">
              <Icon name={s.icon} size={22} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-display font-bold text-3xl tracking-tight">{s.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide font-display">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LEADERBOARD + RATING */}
      <section className="container py-16 grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Leaderboard */}
        <div id="leaders">
          <div className="font-display text-accent uppercase tracking-widest text-sm mb-1">Рейтинг</div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Таблица лидеров</h2>

          <div className="border border-border bg-card">
            <div className="grid grid-cols-[50px_1fr_100px] gap-2 px-4 py-3 border-b border-border text-xs font-display uppercase tracking-wider text-muted-foreground">
              <span>#</span><span>Игрок</span><span className="text-right">Elo</span>
            </div>
            <div className="px-4 py-16 text-center">
              <Icon name="Trophy" size={40} className="text-muted-foreground/40 mx-auto mb-4" />
              <div className="font-display uppercase tracking-wide text-muted-foreground">Пока нет игроков</div>
              <div className="text-sm text-muted-foreground/70 mt-1">Сыграй первый матч и займи топ-1</div>
            </div>
          </div>
        </div>

        {/* Rating card */}
        <div id="rating">
          <div className="font-display text-primary uppercase tracking-widest text-sm mb-1">Прогноз</div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Твой рейтинг</h2>

          <div className="border border-border bg-card p-6 clip-corner neon-border">
            {profile ? (
              <>
                <div className="flex items-end justify-between mb-1">
                  <span className="font-display uppercase tracking-wide text-muted-foreground text-sm">Текущий Elo</span>
                  <span className="text-xs px-2 py-0.5 border border-accent/40 text-accent uppercase tracking-wider">
                    {profile.elo >= 2000 ? 'Immortal' : profile.elo >= 1000 ? 'Gold' : 'Rookie'}
                  </span>
                </div>
                <div className="font-display font-bold text-5xl tracking-tight text-primary text-glow mb-1">{profile.elo}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mb-6">
                  <Icon name="Swords" size={14} /> {profile.matches} матчей сыграно
                </div>
                <div className="border-t border-border pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display uppercase tracking-wide text-sm text-muted-foreground">До след. ранга</span>
                    <span className="font-display font-bold text-accent">{Math.max(0, 1000 - profile.elo)} Elo</span>
                  </div>
                  <div className="h-2 bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent"
                         style={{ width: `${Math.min(100, (profile.elo / 1000) * 100)}%` }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Icon name="Gamepad2" size={40} className="text-muted-foreground/40 mx-auto mb-4" />
                <div className="font-display uppercase tracking-wide text-muted-foreground mb-4">Войди, чтобы увидеть рейтинг</div>
                <Button onClick={steamLogin}
                  className="font-display uppercase tracking-wide clip-corner bg-primary text-primary-foreground hover:bg-primary/90">
                  Войти через Steam
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 grid place-items-center bg-primary text-primary-foreground clip-corner">
              <Icon name="Crosshair" size={16} />
            </div>
            <span className="font-display font-bold text-lg tracking-wider">
              FRAG<span className="text-primary">ZONE</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 FRAGZONE. Киберспортивная платформа нового поколения.</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Icon name="Twitch" size={20} className="hover:text-primary transition-colors cursor-pointer" />
            <Icon name="Youtube" size={20} className="hover:text-primary transition-colors cursor-pointer" />
            <Icon name="Send" size={20} className="hover:text-primary transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>

      {showProfile && profile && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowProfile(false)}
          onUpdate={setProfile}
          onLogout={logout}
        />
      )}

      {loading && (
        <div className="fixed bottom-4 right-4 text-xs text-muted-foreground font-mono opacity-50">
          подключение...
        </div>
      )}
    </div>
  );
};

export default Index;
