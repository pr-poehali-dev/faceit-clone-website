import { useEffect, useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { matchmaking, MatchState } from '@/lib/api';

interface Props {
  onLobby: (state: MatchState) => void;
  onClose: () => void;
}

const Matchmaking = ({ onLobby, onClose }: Props) => {
  const [state, setState] = useState<MatchState>({ state: 'searching', in_queue: 1, needed: 10 });
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<number>();

  useEffect(() => {
    matchmaking('join').then((s) => {
      if (s.state === 'lobby') onLobby(s);
      else setState(s);
    });

    const poll = window.setInterval(async () => {
      const s = await matchmaking('status');
      if (s.state === 'lobby') {
        window.clearInterval(poll);
        onLobby(s);
      } else {
        setState(s);
      }
    }, 2500);

    timer.current = window.setInterval(() => setSeconds((x) => x + 1), 1000);

    return () => {
      window.clearInterval(poll);
      if (timer.current) window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancel = async () => {
    await matchmaking('leave');
    onClose();
  };

  const inQueue = state.in_queue ?? 1;
  const needed = state.needed ?? 10;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex items-center justify-center p-6">
      <div className="absolute inset-0 cyber-grid opacity-10 animate-grid-flow" />
      <div className="relative text-center max-w-md w-full animate-fade-in">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" style={{ animationDuration: '1.2s' }} />
          <div className="absolute inset-0 grid place-items-center">
            <Icon name="Crosshair" size={48} className="text-primary animate-pulse-neon" />
          </div>
        </div>

        <div className="font-display uppercase tracking-widest text-primary text-sm mb-2">Поиск матча</div>
        <div className="font-display font-bold text-5xl tracking-tight text-glow text-primary mb-1">
          {inQueue}/{needed}
        </div>
        <div className="text-muted-foreground uppercase tracking-wide text-sm mb-6">игроков в очереди</div>

        <div className="h-2 bg-secondary overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
               style={{ width: `${(inQueue / needed) * 100}%` }} />
        </div>
        <div className="font-mono text-sm text-muted-foreground mb-8">{mins}:{secs}</div>

        <Button onClick={cancel} variant="outline"
                className="font-display uppercase tracking-wide border-border hover:border-destructive hover:text-destructive">
          Отменить поиск
        </Button>
      </div>
    </div>
  );
};

export default Matchmaking;
