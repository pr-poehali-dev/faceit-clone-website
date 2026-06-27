import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Profile, uploadAvatar, clearToken } from '@/lib/api';

interface Props {
  profile: Profile;
  onClose: () => void;
  onUpdate: (p: Profile) => void;
  onLogout: () => void;
}

const STAT_META: { key: keyof Profile['stats']; label: string; suffix?: string }[] = [
  { key: 'WinRate', label: 'WinRate', suffix: '%' },
  { key: 'AVG', label: 'AVG' },
  { key: 'KD', label: 'K/D' },
  { key: 'KR', label: 'K/R' },
  { key: 'HS', label: 'HS%', suffix: '%' },
  { key: 'ADR', label: 'ADR' },
];

const ProfileModal = ({ profile, onClose, onUpdate, onLogout }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(profile.avatar_url);

  const pickFile = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const url = await uploadAvatar(reader.result as string);
      if (url) {
        setAvatar(url);
        onUpdate({ ...profile, avatar_url: url });
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const logout = () => {
    clearToken();
    onLogout();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-card border border-border clip-corner animate-fade-in my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10">
          <Icon name="X" size={22} />
        </button>

        {/* Header */}
        <div className="relative p-6 border-b border-border bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {avatar ? (
                <img src={avatar} alt="" className="w-24 h-24 rounded object-cover border-2 border-primary/40" />
              ) : (
                <div className="w-24 h-24 rounded bg-secondary grid place-items-center font-display font-bold text-3xl">
                  {profile.nickname[0]}
                </div>
              )}
              <button onClick={pickFile}
                className="absolute inset-0 grid place-items-center bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <Icon name={uploading ? 'Loader' : 'Camera'} size={24} className={uploading ? 'animate-spin text-primary' : 'text-primary'} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-2xl uppercase tracking-tight truncate">{profile.nickname}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-display font-bold text-primary text-glow text-xl">{profile.elo}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">ELO</span>
              </div>
              <button onClick={pickFile} className="mt-2 text-xs uppercase tracking-wide text-accent hover:underline flex items-center gap-1">
                <Icon name="Upload" size={12} /> Загрузить фото
              </button>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="p-6">
          <div className="font-display uppercase tracking-widest text-sm text-muted-foreground mb-4">
            Статистика · {profile.matches} матчей
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
            {STAT_META.map((s) => (
              <div key={s.key} className="bg-card p-4 hover:bg-secondary/40 transition-colors">
                <div className="font-display font-bold text-2xl tracking-tight text-primary">
                  {profile.stats[s.key]}{s.suffix || ''}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <Button onClick={logout} variant="outline"
            className="w-full mt-6 font-display uppercase tracking-wide border-border hover:border-destructive hover:text-destructive">
            <Icon name="LogOut" size={16} className="mr-2" /> Выйти из аккаунта
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
