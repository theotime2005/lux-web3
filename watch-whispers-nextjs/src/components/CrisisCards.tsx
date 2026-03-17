import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Lock, Users, ChevronRight, X, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface CrisisScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  solution: string;
  solutionDetail: string;
  status: string;
}

const scenarios: CrisisScenario[] = [
  {
    id: "clone",
    title: "Puces Clonées",
    subtitle: "Faille de Sécurité",
    icon: <ShieldAlert className="h-5 w-5" />,
    description: "Des puces NFC contrefaites ont été détectées sur le marché, tentant de reproduire les certificats d'authenticité.",
    solution: "Double Signature Activée",
    solutionDetail: "Chaque vérification nécessite désormais la signature simultanée de la puce physique et du propriétaire enregistré. Le clonage standard devient obsolète.",
    status: "Contre-mesure déployée",
  },
  {
    id: "grey",
    title: "Marché Gris",
    subtitle: "Spéculation Détectée",
    icon: <Lock className="h-5 w-5" />,
    description: "Une activité de revente spéculative a été identifiée, menaçant l'exclusivité et le contrôle de la distribution de la Maison.",
    solution: "Verrouillage Temporel",
    solutionDetail: "Le transfert de propriété est bloqué pendant 12 mois après l'acquisition initiale. Cette restriction protège l'écosystème de la Maison contre la spéculation.",
    status: "Restriction active — 12 mois",
  },
  {
    id: "recovery",
    title: "Récupération VIP",
    subtitle: "Accès Compromis",
    icon: <Users className="h-5 w-5" />,
    description: "Un client VIP a perdu l'accès à son appareil d'authentification. Le certificat doit rester accessible sans compromettre la sécurité.",
    solution: "Récupération Sociale",
    solutionDetail: "3 gardiens de confiance (la Maison, le joaillier agréé, et un contact personnel) peuvent ensemble restaurer l'accès au certificat par vote majoritaire.",
    status: "2/3 gardiens requis",
  },
];

const CrisisCards = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = scenarios.find((s) => s.id === selectedId);

  return (
    <div className="mx-auto max-w-md mt-8 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Scénarios de Crise — Adaptation en Temps Réel
          </p>
        </div>

        <div className="space-y-3">
          {scenarios.map((scenario, i) => (
            <motion.button
              key={scenario.id}
              onClick={() => setSelectedId(scenario.id)}
              className="w-full gold-border rounded-lg bg-card p-4 text-left transition-colors hover:bg-secondary flex items-center justify-between group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.15 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-primary">{scenario.icon}</span>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{scenario.title}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{scenario.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Crisis Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
            <motion.div
              className="relative z-10 w-full max-w-md mx-4 rounded-t-2xl sm:rounded-2xl gold-border bg-card p-6 sm:p-8"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <button onClick={() => setSelectedId(null)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-primary">{selected.icon}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">{selected.title}</h3>
                  <p className="font-body text-xs text-primary">{selected.subtitle}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Situation</p>
                <p className="font-body text-sm text-foreground/80 leading-relaxed">{selected.description}</p>
              </div>

              <div className="rounded-lg bg-primary/5 gold-border p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <p className="font-body text-sm font-medium text-primary">{selected.solution}</p>
                </div>
                <p className="font-body text-xs text-foreground/70 leading-relaxed">{selected.solutionDetail}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-body text-[10px] uppercase tracking-[0.15em] text-gold-muted">{selected.status}</span>
                <button
                  onClick={() => setSelectedId(null)}
                  className="rounded-md bg-primary px-6 py-2 font-body text-sm font-medium text-primary-foreground hover:brightness-110 transition-all"
                >
                  Compris
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrisisCards;
