import { Heart, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%]"
        >
          <Heart className="w-8 h-8 text-accent/20" fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[15%]"
        >
          <Heart className="w-12 h-12 text-primary/20" fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [-15, 25, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[20%]"
        >
          <Sparkles className="w-10 h-10 text-accent/15" />
        </motion.div>
        <motion.div
          animate={{ y: [25, -15, 25] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-[25%]"
        >
          <Gift className="w-14 h-14 text-primary/15" />
        </motion.div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Heart className="w-4 h-4 text-accent" fill="currentColor" />
            <span className="text-sm font-medium text-accent">Valentine's Special 2024</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight"
        >
          Find the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Perfect Gift
          </span>
          <br />
          for Your Loved Ones
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Whether it's for your techie friend, your special someone, or yourself — 
          discover curated gift ideas that speak from the heart.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-accent" fill="currentColor" />
            14 Unique Archetypes
          </span>
          <span className="flex items-center gap-1">
            <Gift className="w-4 h-4 text-primary" />
            100+ Categories
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-accent" />
            All Budgets Welcome
          </span>
        </motion.div>
      </div>
    </div>
  );
};
