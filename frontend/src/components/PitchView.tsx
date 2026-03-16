import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Shield, Eye, RefreshCw } from "lucide-react";
import { useState } from "react";

interface Slide {
  title: string;
  subtitle: string;
  points: string[];
  icon: React.ReactNode;
}

const slides: Slide[] = [
  {
    title: "Le Problème",
    subtitle: "Trois menaces pour la Haute Horlogerie",
    icon: <Shield className="h-8 w-8" />,
    points: [
      "Les contrefaçons parfaites trompent même les experts en boutique.",
      "La spéculation sauvage prive les Maisons du contrôle de leur distribution.",
      "Les acheteurs de seconde main restent invisibles et inatteignables.",
    ],
  },
  {
    title: "Notre Solution",
    subtitle: "Un passeport numérique indissociable de l'objet",
    icon: <Eye className="h-8 w-8" />,
    points: [
      "Chaque montre est liée à un certificat unique, infalsifiable et vérifiable instantanément.",
      "Le propriétaire s'authentifie par biométrie — aucune complexité technique visible.",
      "L'historique complet de la pièce est préservé pour les générations futures.",
    ],
  },
  {
    title: "L'Expérience Client",
    subtitle: "La technologie disparaît derrière l'élégance",
    icon: <RefreshCw className="h-8 w-8" />,
    points: [
      "Un simple scan avec le téléphone suffit à tout vérifier.",
      "Le transfert de propriété se fait en un geste, comme remettre les clés d'un coffre.",
      "La Maison garde le contrôle de son écosystème tout en offrant une liberté totale au client.",
    ],
  },
];

const PitchView = ({ onBack }: { onBack: () => void }) => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-body text-xs">Retour</span>
        </button>
        <span className="font-body text-[10px] uppercase tracking-[0.2em] text-primary">
          Pitch — Board of Directors
        </span>
      </div>

      {/* Slide */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          key={current}
          className="max-w-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex justify-center text-primary">{slide.icon}</div>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
            {current + 1} / {slides.length}
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2 sm:text-4xl">
            {slide.title}
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-8">{slide.subtitle}</p>

          <div className="space-y-4 text-left max-w-md mx-auto">
            {slide.points.map((point, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <p className="font-body text-sm text-foreground/80 leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-6">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Précédent
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))}
          disabled={current === slides.length - 1}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
        >
          Suivant
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default PitchView;
