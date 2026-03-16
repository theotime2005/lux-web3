import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

interface NfcScanScreenProps {
  onScan: () => void;
}

const NfcScanScreen = ({ onScan }: NfcScanScreenProps) => {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Logo */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h1 className="font-display text-3xl font-bold gold-text-gradient sm:text-4xl">
          Aurunein
        </h1>
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">
          Haute Horlogerie — Genève
        </p>
      </motion.div>

      {/* NFC Circle */}
      <motion.button
        onClick={onScan}
        className="group relative mb-10 flex h-40 w-40 items-center justify-center rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Rings */}
        <div className="absolute inset-0 rounded-full nfc-ring" />
        <div className="absolute inset-[-12px] rounded-full nfc-ring" style={{ animationDelay: "0.5s" }} />
        <div className="absolute inset-[-24px] rounded-full nfc-ring" style={{ animationDelay: "1s" }} />

        <div className="relative flex flex-col items-center gap-2">
          <Smartphone className="h-10 w-10 text-primary transition-transform duration-500 group-hover:scale-110" />
        </div>
      </motion.button>

      {/* Instruction */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <p className="font-body text-sm text-foreground mb-1">
          Approchez votre appareil
        </p>
        <p className="font-body text-xs text-muted-foreground">
          Scannez la puce sécurisée de votre garde-temps
        </p>
      </motion.div>

      {/* Bottom shimmer bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px shimmer-effect"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      />
    </motion.div>
  );
};

export default NfcScanScreen;
