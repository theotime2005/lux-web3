import { motion } from "framer-motion";
import { ShieldCheck, User, Hash, Watch, CheckCircle } from "lucide-react";

interface WatchData {
  model: string;
  serial: string;
  owner: string;
  status: string;
}

const InfoRow = ({ icon: Icon, label, value, gold }: { icon: any; label: string; value: string; gold?: boolean }) => (
  <div className="flex items-center gap-4">
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary ${gold ? "text-primary" : "text-muted-foreground"}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={`text-sm tabular-nums ${gold ? "font-medium text-primary" : "font-mono text-foreground"}`}>{value}</p>
    </div>
  </div>
);

export const PassportCard = ({ data }: { data: WatchData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
      className="surface-card relative w-full max-w-md mx-auto overflow-hidden p-8"
    >
      <div className="absolute top-0 right-0 p-4">
        <div className="gold-badge">
          <ShieldCheck size={12} />
          Certifiée
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Modèle</p>
        <h3 className="font-display text-3xl text-foreground">{data.model}</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InfoRow icon={Hash} label="Numéro de Série" value={data.serial} />
        <InfoRow icon={Watch} label="Authenticité" value={data.status} />
        <InfoRow icon={User} label="Propriétaire Actuel" value={data.owner} />
        <InfoRow icon={CheckCircle} label="Statut" value="Confirmé" gold />
      </div>

      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-[10px] text-muted-foreground italic">
          Ce certificat numérique est lié de manière permanente à votre montre.
        </p>
      </div>
    </motion.div>
  );
};
