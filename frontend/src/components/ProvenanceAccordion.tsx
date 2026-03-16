import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Database, Link2, FileText, History } from "lucide-react";
import { useState } from "react";

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = ({ title, icon, children, isOpen, onToggle }: AccordionItemProps) => (
  <div className="gold-border rounded-lg overflow-hidden mb-3">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between bg-card px-4 py-3 text-left transition-colors hover:bg-secondary"
    >
      <div className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <span className="font-body text-sm font-medium text-foreground">{title}</span>
      </div>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="bg-card/50 px-4 py-4 border-t border-border">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ProvenanceAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <motion.div
      className="mx-auto max-w-md mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
        Provenance & Spécifications Techniques
      </p>

      <AccordionItem
        title="Historique de Propriété"
        icon={<History className="h-4 w-4" />}
        isOpen={openIndex === 0}
        onToggle={() => toggle(0)}
      >
        <div className="space-y-3">
          <HistoryEntry date="16 Mars 2026" event="Enregistrement initial" owner="Alexandre D." />
          <HistoryEntry date="16 Mars 2026" event="Certification de la Maison" owner="Aurunein HH" />
          <HistoryEntry date="15 Mars 2026" event="Fabrication — Atelier Genève" owner="Maison Aurunein" />
        </div>
      </AccordionItem>

      <AccordionItem
        title="Certificat de Stockage Permanent"
        icon={<Database className="h-4 w-4" />}
        isOpen={openIndex === 1}
        onToggle={() => toggle(1)}
      >
        <div className="space-y-2">
          <TechRow label="Métadonnées (IPFS)" value="QmX7b2...9kF3" />
          <TechRow label="Jumeau 3D (Arweave)" value="ar://Tx8n...mP2q" />
          <TechRow label="Format 3D" value=".glb / .usdz" />
          <p className="font-body text-[10px] text-muted-foreground mt-2">
            Stockage décentralisé garantissant la survie générationnelle du certificat.
          </p>
        </div>
      </AccordionItem>

      <AccordionItem
        title="Identifiant On-Chain"
        icon={<Link2 className="h-4 w-4" />}
        isOpen={openIndex === 2}
        onToggle={() => toggle(2)}
      >
        <div className="space-y-2">
          <TechRow label="Identifiant" value="#437" />
          <TechRow label="Contrat" value="0x7a3B...eF91" />
          <TechRow label="Réseau" value="Base Sepolia" />
          <TechRow label="Standard" value="Certificat Unique (ERC-721)" />
        </div>
      </AccordionItem>

      <AccordionItem
        title="Entretien & Révisions"
        icon={<FileText className="h-4 w-4" />}
        isOpen={openIndex === 3}
        onToggle={() => toggle(3)}
      >
        <div className="space-y-3">
          <HistoryEntry date="—" event="Aucune révision enregistrée" owner="Pièce neuve" />
          <p className="font-body text-[10px] text-muted-foreground">
            L'historique d'entretien est lié de manière incessible au propriétaire actuel (ERC-5192).
          </p>
        </div>
      </AccordionItem>
    </motion.div>
  );
};

const TechRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="font-body text-xs text-muted-foreground">{label}</span>
    <span className="font-body text-xs font-mono text-foreground">{value}</span>
  </div>
);

const HistoryEntry = ({ date, event, owner }: { date: string; event: string; owner: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
    <div>
      <p className="font-body text-xs text-foreground">{event}</p>
      <p className="font-body text-[10px] text-muted-foreground">{owner} — {date}</p>
    </div>
  </div>
);

export default ProvenanceAccordion;
