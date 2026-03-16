import { motion } from "framer-motion";
import { Smartphone, Server, Database, Globe, ArrowRight } from "lucide-react";

const ArchitectureDiagram = () => {
  const nodes = [
    { icon: <Smartphone className="h-5 w-5" />, label: "Client", sub: "Scan NFC / Biométrie" },
    { icon: <Server className="h-5 w-5" />, label: "Compte Intelligent", sub: "Abstraction complète" },
    { icon: <Database className="h-5 w-5" />, label: "Stockage", sub: "IPFS + Arweave" },
    { icon: <Globe className="h-5 w-5" />, label: "Registre", sub: "Certificat On-Chain" },
  ];

  return (
    <motion.div
      className="mx-auto max-w-md mt-6 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
        Architecture du Passeport Numérique
      </p>
      <div className="gold-border rounded-lg bg-card p-4">
        <div className="flex items-center justify-between gap-1">
          {nodes.map((node, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1.5">
                  {node.icon}
                </div>
                <p className="font-body text-[9px] font-medium text-foreground">{node.label}</p>
                <p className="font-body text-[8px] text-muted-foreground max-w-[70px]">{node.sub}</p>
              </div>
              {i < nodes.length - 1 && (
                <ArrowRight className="h-3 w-3 text-primary/40 flex-shrink-0 mx-0.5" />
              )}
            </div>
          ))}
        </div>

        {/* Paymaster note */}
        <div className="mt-4 pt-3 border-t border-border">
          <p className="font-body text-[9px] text-center text-muted-foreground">
            <span className="text-primary">●</span> La Maison prend en charge l'infrastructure — Aucun coût pour le client
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArchitectureDiagram;
