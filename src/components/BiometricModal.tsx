import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, X, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "verify" | "transfer";
}

const BiometricModal = ({ isOpen, onClose, mode }: BiometricModalProps) => {
  const [step, setStep] = useState<"idle" | "scanning" | "success">("idle");

  const handleScan = () => {
    setStep("scanning");
    setTimeout(() => setStep("success"), 2000);
  };

  const handleClose = () => {
    setStep("idle");
    onClose();
  };

  const titles = {
    verify: "Vérifier l'Authenticité",
    transfer: "Transférer l'Héritage",
  };

  const successMessages = {
    verify: "Authenticité confirmée. Ce certificat est valide et lié à son propriétaire légitime.",
    transfer: "Transfert initié avec succès. Le nouveau propriétaire recevra une notification sécurisée.",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-4 rounded-t-2xl sm:rounded-2xl gold-border bg-card p-6 sm:p-8"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <button onClick={handleClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {titles[mode]}
            </h3>
            <p className="font-body text-xs text-muted-foreground mb-8">
              Accès sécurisé par authentification biométrique
            </p>

            {step === "idle" && (
              <motion.div className="flex flex-col items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button
                  onClick={handleScan}
                  className="group relative flex h-28 w-28 items-center justify-center rounded-full gold-border-strong transition-all duration-500 hover:bg-primary/10"
                >
                  <Fingerprint className="h-12 w-12 text-primary transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 rounded-full nfc-ring" />
                </button>
                <p className="font-body text-sm text-muted-foreground">
                  Appuyez pour vous identifier
                </p>
              </motion.div>
            )}

            {step === "scanning" && (
              <motion.div className="flex flex-col items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex h-28 w-28 items-center justify-center rounded-full gold-border-strong">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <p className="font-body text-sm text-muted-foreground">
                  Vérification sécurisée en cours...
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-display text-lg font-semibold text-primary mb-2">
                    {mode === "verify" ? "Authentique" : "Transfert Réussi"}
                  </p>
                  <p className="font-body text-xs text-muted-foreground max-w-xs">
                    {successMessages[mode]}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full rounded-md bg-primary py-3 font-body text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
                >
                  Fermer
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BiometricModal;
