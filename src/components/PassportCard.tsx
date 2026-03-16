import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";

interface PassportCardProps {
  onVerify: () => void;
  onTransfer: () => void;
}

const PassportCard = ({ onVerify, onTransfer }: PassportCardProps) => {
  return (
    <motion.div
      className="mx-auto max-w-md gold-border rounded-lg bg-card p-6 sm:p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-body text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Passeport Numérique
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-gold-muted" />
          <span className="font-body text-xs text-gold-muted">Vérifié</span>
        </div>
      </div>

      {/* Certificate ID */}
      <div className="mb-6">
        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Certificat d'Authenticité
        </p>
        <p className="font-display text-2xl font-semibold text-foreground">
          #LUX-2026-0437
        </p>
      </div>

      {/* Watch Details */}
      <div className="mb-6 space-y-3">
        <DetailRow label="Maison" value="Aurunein Haute Horlogerie" />
        <DetailRow label="Modèle" value="Chronographe Héritage" />
        <DetailRow label="Référence" value="AH-CH-RG-001" />
        <DetailRow label="Calibre" value="AH.01 — Remontage manuel" />
        <DetailRow label="Boîtier" value="Or rose 18 carats, 41mm" />
        <DetailRow label="Cadran" value="Noir laqué, index or" />
        <DetailRow label="Réserve de marche" value="72 heures" />
        <DetailRow label="Étanchéité" value="50 mètres" />
        <DetailRow label="Date d'émission" value="16 Mars 2026" />
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-border" />

      {/* Ownership */}
      <div className="mb-6">
        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
          Propriétaire actuel
        </p>
        <p className="font-body text-sm text-foreground">
          Alexandre D. — Enregistré le 16 Mars 2026
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onVerify}
          className="w-full rounded-md bg-primary py-3 font-body text-sm font-medium text-primary-foreground transition-all duration-300 hover:brightness-110"
        >
          Vérifier l'Authenticité
        </button>
        <button
          onClick={onTransfer}
          className="w-full rounded-md gold-border bg-transparent py-3 font-body text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/10"
        >
          Transférer l'Héritage
        </button>
      </div>
    </motion.div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-baseline">
    <span className="font-body text-xs text-muted-foreground">{label}</span>
    <span className="font-body text-sm text-foreground text-right max-w-[60%]">{value}</span>
  </div>
);

export default PassportCard;
