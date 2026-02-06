import { ExternalLink, Star } from "lucide-react";
import type { JumiaProduct } from "@/types/product";

interface ProductCardProps {
  product: JumiaProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const hasDiscount = product.prices.oldPrice && product.prices.discount;
  
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-secondary relative">
        <img
          src={product.image}
          alt={product.displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.prices.discount && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
            {product.prices.discount}
          </span>
        )}
        {product.isShopExpress && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            Express
          </span>
        )}
      </div>
      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.displayName}
        </h3>
        
        {product.rating && product.rating.totalRatings > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating.average.toFixed(1)} ({product.rating.totalRatings})
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {hasDiscount && (
              <p className="text-xs text-muted-foreground line-through">
                {product.prices.oldPrice}
              </p>
            )}
            <p className="text-lg font-bold text-primary">
              {product.prices.price}
            </p>
          </div>
          <div className="p-2 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </a>
  );
};
