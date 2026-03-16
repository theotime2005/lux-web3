import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NfcScanScreen from "@/components/NfcScanScreen";
import WatchHero from "@/components/WatchHero";
import PassportCard from "@/components/PassportCard";
import ProvenanceAccordion from "@/components/ProvenanceAccordion";
import BiometricModal from "@/components/BiometricModal";
import CrisisCards from "@/components/CrisisCards";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import PitchView from "@/components/PitchView";
import { Presentation } from "lucide-react";

type View = "scan" | "passport" | "pitch";

const Index = () => {
  const [view, setView] = useState<View>("scan");
  const [modalMode, setModalMode] = useState<"verify" | "transfer" | null>(null);

  if (view === "pitch") {
    return <PitchView onBack={() => setView("passport")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === "scan" && (
          <motion.div key="scan" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <NfcScanScreen onScan={() => setView("passport")} />
          </motion.div>
        )}

        {view === "passport" && (
          <motion.div
            key="passport"
            className="pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="font-display text-lg font-bold gold-text-gradient">Aurunein</h1>
                <p className="font-body text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                  Haute Horlogerie
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView("pitch")}
                  className="flex items-center gap-1.5 rounded-md gold-border px-3 py-1.5 font-body text-[10px] text-primary hover:bg-primary/10 transition-colors"
                >
                  <Presentation className="h-3 w-3" />
                  Pitch
                </button>
                <button
                  onClick={() => setView("scan")}
                  className="font-body text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Nouveau Scan
                </button>
              </div>
            </div>

            {/* Shimmer reveal bar */}
            <div className="h-px shimmer-effect mb-4" />

            {/* Watch Hero */}
            <WatchHero />

            {/* Model name */}
            <motion.div
              className="text-center mb-8 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Chronographe Héritage
              </h2>
              <p className="font-body text-xs text-muted-foreground mt-1">
                Or rose 18 carats — Calibre AH.01
              </p>
            </motion.div>

            {/* Passport Card */}
            <div className="px-4">
              <PassportCard
                onVerify={() => setModalMode("verify")}
                onTransfer={() => setModalMode("transfer")}
              />
            </div>

            {/* Provenance */}
            <div className="px-4">
              <ProvenanceAccordion />
            </div>

            {/* Architecture */}
            <div className="px-4">
              <ArchitectureDiagram />
            </div>

            {/* Crisis Cards */}
            <div className="px-4">
              <CrisisCards />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Biometric Modal */}
      <BiometricModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        mode={modalMode ?? "verify"}
      />
    </div>
  );
};

export default Index;
