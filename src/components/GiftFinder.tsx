import { useState, useMemo } from "react";
import { Heart, Gift, Search, Sparkles } from "lucide-react";
import { archetypeData, budgetRanges, getArchetypeEmoji } from "@/data/giftData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface GiftResult {
  archetype: string;
  category: string;
  budget: string;
  tagline: string;
}

export const GiftFinder = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [searchResult, setSearchResult] = useState<GiftResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const availableCategories = useMemo(() => {
    if (!selectedArchetype) return [];
    const archetype = archetypeData.find((a) => a.archetype === selectedArchetype);
    return archetype?.categories || [];
  }, [selectedArchetype]);

  const selectedArchetypeData = useMemo(() => {
    return archetypeData.find((a) => a.archetype === selectedArchetype);
  }, [selectedArchetype]);

  const handleArchetypeChange = (value: string) => {
    setSelectedArchetype(value);
    setSelectedCategory("");
    setSearchResult(null);
  };

  const handleFindGift = () => {
    if (!selectedArchetype || !selectedCategory || !selectedBudget) return;
    
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const archetype = archetypeData.find((a) => a.archetype === selectedArchetype);
      setSearchResult({
        archetype: selectedArchetype,
        category: selectedCategory,
        budget: selectedBudget,
        tagline: archetype?.tagline || "",
      });
      setIsSearching(false);
    }, 800);
  };

  const isFormComplete = selectedArchetype && selectedCategory && selectedBudget;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-accent animate-heart-beat" fill="currentColor" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            FIND YOUR GIFT
          </h2>
          <Heart className="w-6 h-6 text-accent animate-heart-beat" fill="currentColor" />
        </div>
        {selectedArchetypeData && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground italic"
          >
            "{selectedArchetypeData.tagline}"
          </motion.p>
        )}
      </div>

      {/* Filter Bar */}
      <div className="gift-finder-gradient rounded-2xl p-6 md:p-8 shadow-button">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Archetype Select */}
          <Select value={selectedArchetype} onValueChange={handleArchetypeChange}>
            <SelectTrigger className="bg-card border-0 h-14 rounded-xl text-foreground font-medium shadow-card hover:shadow-soft transition-shadow">
              <SelectValue placeholder="Looking for a gift for..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              {archetypeData.map((archetype) => (
                <SelectItem
                  key={archetype.archetype}
                  value={archetype.archetype}
                  className="py-3 cursor-pointer hover:bg-secondary rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <span>{getArchetypeEmoji(archetype.archetype)}</span>
                    <span>{archetype.archetype}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Select */}
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            disabled={!selectedArchetype}
          >
            <SelectTrigger className="bg-card border-0 h-14 rounded-xl text-foreground font-medium shadow-card hover:shadow-soft transition-shadow disabled:opacity-60">
              <SelectValue placeholder="In the category..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl max-h-[300px]">
              {availableCategories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="py-3 cursor-pointer hover:bg-secondary rounded-lg"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Budget Select */}
          <Select value={selectedBudget} onValueChange={setSelectedBudget}>
            <SelectTrigger className="bg-card border-0 h-14 rounded-xl text-foreground font-medium shadow-card hover:shadow-soft transition-shadow">
              <SelectValue placeholder="For a budget..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              {budgetRanges.map((range) => (
                <SelectItem
                  key={range.label}
                  value={range.label}
                  className="py-3 cursor-pointer hover:bg-secondary rounded-lg"
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Find Gift Button */}
          <Button
            onClick={handleFindGift}
            disabled={!isFormComplete || isSearching}
            className="h-14 rounded-xl bg-card text-primary font-semibold text-lg hover:bg-secondary shadow-card hover:shadow-soft transition-all disabled:opacity-60"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-spin" />
                Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Find Gift
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            {/* Search Results Header */}
            <div className="gift-finder-gradient rounded-t-xl px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-primary-foreground" />
                <span className="font-semibold text-primary-foreground">Search Results</span>
              </div>
              <span className="text-primary-foreground/80 text-sm">
                {getArchetypeEmoji(searchResult.archetype)} {searchResult.archetype} • {searchResult.category}
              </span>
            </div>

            {/* Results Content */}
            <div className="bg-card rounded-b-xl p-8 shadow-card">
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 mx-auto mb-6 gift-finder-gradient rounded-full flex items-center justify-center shadow-button"
                >
                  <Gift className="w-12 h-12 text-primary-foreground" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Perfect Gift Found!
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We've found amazing <span className="font-semibold text-primary">{searchResult.category}</span> gifts 
                  for <span className="font-semibold text-accent">{searchResult.archetype}</span> within your budget of{" "}
                  <span className="font-semibold">{searchResult.budget}</span>
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium">
                    {getArchetypeEmoji(searchResult.archetype)} {searchResult.archetype}
                  </span>
                  <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium">
                    📦 {searchResult.category}
                  </span>
                  <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium">
                    💰 {searchResult.budget}
                  </span>
                </div>

                <p className="mt-8 text-sm text-muted-foreground italic">
                  "{searchResult.tagline}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
