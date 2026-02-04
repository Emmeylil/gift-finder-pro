import { useState, useMemo } from "react";
import { Heart, Gift, Search, Sparkles, AlertCircle } from "lucide-react";
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
import { ProductGrid } from "./ProductGrid";
import { fetchJumiaProductsDirect } from "@/services/jumiaScraperService";
import type { JumiaProduct } from "@/types/product";

export const GiftFinder = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");

  const [products, setProducts] = useState<JumiaProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
    setProducts([]);
    setHasSearched(false);
    setSearchError(null);
  };

  const handleFindGift = async () => {
    if (!selectedArchetype || !selectedCategory || !selectedBudget) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const results = await fetchJumiaProductsDirect({
        archetype: selectedArchetype,
        category: selectedCategory,
        budget: selectedBudget,
        country: "NG",
      });
      setProducts(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("Unable to find gifts at the moment. This might be due to connection issues or temporary blocks. Please try again or choose a different category.");
      setProducts([]);
    } finally {
      setIsSearching(false);
    }
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
        {hasSearched && (
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
                {getArchetypeEmoji(selectedArchetype)} {selectedArchetype} • {selectedCategory}
              </span>
            </div>

            {/* Results Content */}
            <div className="bg-card rounded-b-xl p-6 shadow-card">
              {searchError ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Search Failed</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">{searchError}</p>
                </div>
              ) : isSearching ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4 gift-finder-gradient rounded-full flex items-center justify-center"
                  >
                    <Gift className="w-8 h-8 text-primary-foreground" />
                  </motion.div>
                  <p className="text-muted-foreground">Searching for perfect gifts...</p>
                </div>
              ) : (
                <ProductGrid products={products} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
