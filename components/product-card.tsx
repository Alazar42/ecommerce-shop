'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleFavorite } from '@/lib/redux/slices/favorites-slice'
import { Product } from '@/lib/redux/slices/products-slice'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((state) => state.favorites.items)
  const isFavorite = favorites.includes(product.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(toggleFavorite(product.id))
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const price = product.price ?? 0
  const rating = product.rating ?? 0
  const discount = product.discountPercentage ?? 0
  const stock = product.stock ?? 0
  const title = product.title || 'Untitled Product'
  const category = product.category || 'Uncategorized'
  const thumbnail = product.thumbnail || '/placeholder.svg'

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground mb-2">{category}</p>
          <h3 className="font-semibold text-foreground line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl font-bold text-foreground">${price.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-sm text-destructive-foreground px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-yellow-500">★ {rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({stock} in stock)</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleFavorite}
            className={cn(isFavorite && 'text-destructive-foreground')}
          >
            <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
