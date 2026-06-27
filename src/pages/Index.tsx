import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/541f49fe-923b-43d8-a255-9f0a291b2052/files/fdf30da7-7f8a-48a0-bb96-c99b6eb02653.jpg';

const matches = [
  {
    id: 1,
    status: 'LIVE',
    game: 'CS2',
    map: 'Mirage',
    t1: 'NAVI', t1score: 12, t1logo: '🐺',
    t2: 'FaZe', t2score: 9, t2logo: '🔥',
    viewers: '48.2K',
  },
  {
    id: 2,
    status: 'LIVE',
    game: 'Dota 2',
    map: 'Group Stage',
    t1: 'Team Spirit', t1score: 1, t1logo: '👻',
    t2: 'Gaimin', t2score: 1, t2logo: '⚡',
    viewers: '31.7K',
  },
  {
    id: 3,
    status: 'FINISHED',
    game: 'Valorant',
    map: 'Ascent',
    t1: 'Sentinels', t1score: 13, t1logo: '🛡️',
    t2: 'LOUD', t2score: 7, t2logo: '🔊',
    viewers: '—',
  },
  {
    id: 4,
    status: 'UPCOMING',
    game: 'CS2',
    map: 'BO3 · 21:00',
    t1: 'G2', t1score: 0, t1logo: '🎯',
    t2: 'Vitality', t2score: 0, t2logo: '🐝',
    viewers: '—',
  },
];

const leaders = [
  { rank: 1, name: 'sh1ro', tag: 'Radiant', elo: 3284, change: +42, kd: 1.42, win: 78, avatar: '👑' },
  { rank: 2, name: 'm0NESY', tag: 'Radiant', elo: 3197, change: +18, kd: 1.38, win: 74, avatar: '🎮' },
  { rank: 3, name: 'ZywOo', tag: 'Radiant', elo: 3150, change: -12, kd: 1.35, win: 71, avatar: '🦊' },
  { rank: 4, name: 'donk', tag: 'Immortal', elo: 3088, change: +56, kd: 1.31, win: 69, avatar: '🚀' },
  { rank: 5, name: 'NiKo', tag: 'Immortal', elo: 3012, change: +7, kd: 1.28, win: 66, avatar: '⭐' },
  { rank: 6, name: 'Twistzz', tag: 'Immortal', elo: 2945, change: -23, kd: 1.24, win: 63, avatar: '🌀' },
];

const stats = [
  { label: 'Игроков онлайн', value: '142 580', icon: 'Users' },
  { label: 'Матчей сегодня', value: '8 941', icon: 'Swords' },
  { label: 'Призовой фонд', value: '$2.4M', icon: 'Trophy' },
  { label: 'Турниров', value: '316', icon: 'Flame' },
];

const ratingHistory = [2710, 2680, 2755, 2820, 2790, 2880, 2940, 2910, 3010, 3088];

const statusStyle: Record<string, string> = {
  LIVE: 'bg-destructive/20 text-destructive border-destructive/40',
  FINISHED: 'bg-muted text-muted-foreground border-border',
  UPCOMING: 'bg-accent/20 text-accent border-accent/40',
};

const Index = () => {
  const max = Math.max(...ratingHistory);
  const min = Math.min(...ratingHistory);

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
              <a className="text-primary" href="#matches">Матчи</a>
              <a className="hover:text-foreground transition-colors" href="#leaders">Лидеры</a>
              <a className="hover:text-foreground transition-colors" href="#rating">Рейтинг</a>
              <a className="hover:text-foreground transition-colors" href="#">Турниры</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:inline-flex font-display uppercase tracking-wide text-sm">
              Войти
            </Button>
            <Button className="font-display uppercase tracking-wide text-sm clip-corner bg-primary text-primary-foreground hover:bg-primary/90">
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
              Соревновательный матчмейкинг, честный Elo-рейтинг и прогноз твоего ранга.
              Поднимайся в таблице лидеров и забирай призы.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="font-display uppercase tracking-wide clip-corner bg-primary text-primary-foreground hover:bg-primary/90 neon-border">
                <Icon name="Swords" size={18} className="mr-2" /> Найти матч
              </Button>
              <Button size="lg" variant="outline" className="font-display uppercase tracking-wide border-border hover:border-primary hover:text-primary">
                Смотреть трансляции
              </Button>
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

      {/* MATCHES */}
      <section id="matches" className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="font-display text-primary uppercase tracking-widest text-sm mb-1">Лента матчей</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight">Сейчас в игре</h2>
          </div>
          <a href="#" className="font-display uppercase text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors hidden sm:flex items-center gap-1">
            Все матчи <Icon name="ChevronRight" size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {matches.map((m) => (
            <div
              key={m.id}
              className="group relative bg-card border border-border p-5 hover:border-primary/60 transition-colors clip-corner"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-xs font-display uppercase tracking-wider border ${statusStyle[m.status]} ${m.status === 'LIVE' ? 'animate-pulse-neon' : ''}`}>
                    {m.status === 'LIVE' ? '● LIVE' : m.status}
                  </span>
                  <span className="font-display uppercase text-sm tracking-wide text-muted-foreground">{m.game}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Icon name="Eye" size={14} /> {m.viewers}
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.t1logo}</span>
                  <span className="font-display font-semibold text-lg uppercase tracking-wide truncate">{m.t1}</span>
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-3xl tracking-tight">
                    <span className={m.t1score >= m.t2score ? 'text-primary' : 'text-muted-foreground'}>{m.t1score}</span>
                    <span className="text-muted-foreground mx-1">:</span>
                    <span className={m.t2score > m.t1score ? 'text-primary' : 'text-muted-foreground'}>{m.t2score}</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">{m.map}</div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <span className="font-display font-semibold text-lg uppercase tracking-wide truncate">{m.t2}</span>
                  <span className="text-2xl">{m.t2logo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEADERBOARD + RATING */}
      <section className="container pb-20 grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Leaderboard */}
        <div id="leaders">
          <div className="font-display text-accent uppercase tracking-widest text-sm mb-1">Рейтинг</div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Таблица лидеров</h2>

          <div className="border border-border bg-card">
            <div className="grid grid-cols-[40px_1fr_80px_70px_60px] md:grid-cols-[50px_1fr_100px_80px_80px] gap-2 px-4 py-3 border-b border-border text-xs font-display uppercase tracking-wider text-muted-foreground">
              <span>#</span><span>Игрок</span><span className="text-right">Elo</span>
              <span className="text-right hidden md:block">K/D</span><span className="text-right">Win%</span>
            </div>
            {leaders.map((p) => (
              <div
                key={p.rank}
                className="grid grid-cols-[40px_1fr_80px_70px_60px] md:grid-cols-[50px_1fr_100px_80px_80px] gap-2 px-4 py-3 items-center border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <span className={`font-display font-bold text-lg ${p.rank <= 3 ? 'text-primary text-glow' : 'text-muted-foreground'}`}>
                  {p.rank}
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl">{p.avatar}</span>
                  <div className="min-w-0">
                    <div className="font-display font-semibold uppercase tracking-wide truncate">{p.name}</div>
                    <div className="text-[11px] uppercase tracking-wider text-accent">{p.tag}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold">{p.elo}</div>
                  <div className={`text-[11px] flex items-center justify-end gap-0.5 ${p.change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    <Icon name={p.change >= 0 ? 'TrendingUp' : 'TrendingDown'} size={11} />
                    {p.change >= 0 ? '+' : ''}{p.change}
                  </div>
                </div>
                <span className="text-right font-mono text-sm hidden md:block">{p.kd}</span>
                <span className="text-right font-display font-semibold text-accent">{p.win}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating prediction card */}
        <div id="rating">
          <div className="font-display text-primary uppercase tracking-widest text-sm mb-1">Прогноз</div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Твой рейтинг</h2>

          <div className="border border-border bg-card p-6 clip-corner neon-border">
            <div className="flex items-end justify-between mb-1">
              <span className="font-display uppercase tracking-wide text-muted-foreground text-sm">Текущий Elo</span>
              <span className="text-xs px-2 py-0.5 border border-accent/40 text-accent uppercase tracking-wider">Immortal</span>
            </div>
            <div className="font-display font-bold text-5xl tracking-tight text-primary text-glow mb-1">3 088</div>
            <div className="text-sm text-primary flex items-center gap-1 mb-6">
              <Icon name="TrendingUp" size={14} /> +56 за последние 10 матчей
            </div>

            {/* Mini chart */}
            <div className="relative h-28 flex items-end gap-1 mb-2">
              {ratingHistory.map((v, i) => {
                const h = ((v - min) / (max - min)) * 100;
                const last = i === ratingHistory.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end group">
                    <div
                      className={`w-full transition-all ${last ? 'bg-primary animate-pulse-neon' : 'bg-primary/30 group-hover:bg-primary/60'}`}
                      style={{ height: `${Math.max(h, 6)}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-muted-foreground mb-6">
              <span>10 матчей назад</span><span>сейчас</span>
            </div>

            {/* Next rank prediction */}
            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display uppercase tracking-wide text-sm text-muted-foreground">До ранга Radiant</span>
                <span className="font-display font-bold text-accent">62 Elo</span>
              </div>
              <div className="h-2 bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '84%' }} />
              </div>
              <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="Sparkles" size={14} className="text-accent" />
                Прогноз: <span className="text-foreground">~4 победы</span> до повышения
              </div>
            </div>
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
    </div>
  );
};

export default Index;