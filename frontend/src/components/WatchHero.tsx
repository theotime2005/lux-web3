import { motion } from "framer-motion";
import watchImage from "@/assets/watch-hero.png";

const WatchHero = () => {
  return (
    <motion.div
      className="relative flex items-center justify-center py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <img
        src={watchImage}
        alt="Montre Haute Horlogerie - Maison Aurunein"
        className="relative z-10 h-72 w-auto object-contain drop-shadow-2xl sm:h-96"
      />
    </motion.div>
  );
};

export default WatchHero;
