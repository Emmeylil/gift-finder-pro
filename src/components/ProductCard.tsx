import { ExternalLink, Star } from "lucide-react";
import type { JumiaProduct } from "@/types/product";

interface ProductCardProps {
  product: JumiaProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.prices?.discount;
  const rating = product.rating;
  const hasDiscount = !!(product.prices?.oldPrice && product.prices?.discount);

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 block relative"
    >
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-button">
          {discount}
        </div>
      )}

      <div className="aspect-square overflow-hidden bg-secondary relative">
        <img
          src={product.image}
          alt={product.displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Express Badge */}
        {product.isShopExpress && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-button">
            Express
          </span>
        )}

        {/* Rating Overlay */}
        {rating && rating.totalRatings > 0 && (
          <div className="absolute bottom-2 left-2 bg-card/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-card">
            <Star className="w-3 h-3 text-accent fill-accent" />
            <span className="text-[10px] font-bold text-foreground">{rating.average}</span>
            <span className="text-[10px] text-muted-foreground">({rating.totalRatings})</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {product.brand && (
          <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
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
