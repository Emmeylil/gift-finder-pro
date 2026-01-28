import { ExternalLink } from "lucide-react";
import type { JumiaProduct } from "@/types/product";

interface ProductCardProps {
  product: JumiaProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.displayName}
        </h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.oldPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {product.oldPrice}
              </p>
            )}
            <p className="text-lg font-bold text-primary">
              {product.newPrice}
            </p>
          </div>
          <div className="p-2 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">SKU: {product.sku}</p>
      </div>
    </a>
  );
};
