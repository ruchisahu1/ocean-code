import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Bubbles from "@/components/Bubbles";
import oceanHero from "@/assets/ocean-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      {/* Full-screen hero background image */}
      <img
        src={oceanHero}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay so text remains readable */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

      <Bubbles count={25} />

      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-primary/5 to-transparent rotate-6 blur-2xl" />
        <div className="absolute top-0 right-1/3 w-24 h-full bg-gradient-to-b from-primary/3 to-transparent -rotate-3 blur-3xl" />
      </div>

      {/* Main content — vertically centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl w-full"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Learn Python Through Ocean Exploration
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 glow-cyan tracking-wider">
            OCEAN
            <span className="block text-accent glow-green">GAME CODER</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
            Program your submarine to navigate coral reefs, explore sunken ships, and discover the mysteries of the deep. Learn Python while saving the ocean!
          </p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => navigate("/worlds")}
              className="px-8 py-3.5 rounded-lg font-display text-sm tracking-widest font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all box-glow-cyan hover:scale-105"
            >
              START EXPLORING
            </button>
            <button
              onClick={() => navigate("/worlds")}
              className="px-8 py-3.5 rounded-lg font-display text-sm tracking-widest font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-all"
            >
              VIEW MISSIONS
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats — pinned to the bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 flex gap-8 md:gap-16 justify-center pb-8 pt-2 text-center"
      >
        {[
          { value: "5", label: "Ocean Worlds" },
          { value: "25+", label: "Missions" },
          { value: "∞", label: "Adventures" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="font-display text-2xl font-bold text-primary glow-cyan">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;
