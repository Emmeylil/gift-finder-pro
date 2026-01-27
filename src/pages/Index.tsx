import { GiftFinder } from "@/components/GiftFinder";
import { HeroSection } from "@/components/HeroSection";
import { Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Navigation */}
      <nav className="w-full py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-accent" fill="currentColor" />
            <span className="text-xl font-bold text-foreground">GiftFinder</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Valentine's Edition 💕
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Gift Finder Section */}
      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <GiftFinder />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            Made with <Heart className="w-4 h-4 inline text-accent" fill="currentColor" /> for Valentine's Day
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
