'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchProductById } from '@/lib/redux/slices/products-slice'
import { toggleFavorite } from '@/lib/redux/slices/favorites-slice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, ChevronLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { ProductImageGallery } from './product-image-gallery'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductDetailsProps {
  id: number
}

export function ProductDetails({ id }: ProductDetailsProps) {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((state) => state.products)
  const favorites = useAppSelector((state) => state.favorites.items)
  
  const product = items.find((p) => p.id === id)
  const isFavorite = favorites.includes(id)

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id, product])

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(id))
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleAddToCart = () => {
    toast.success('Added to cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading product details...</span>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || 'Product not found'}
            </p>
            <Link href="/">
              <Button>Back to Shop</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl p-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          {/* Images */}
          <div>
            <ProductImageGallery images={product.images} title={product.title} />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.title}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-sm bg-destructive/10 text-muted-foreground px-3 py-1 rounded-md w-fit">
                  Save {product.discountPercentage}%
                </p>
              )}
            </div>

            {/* Rating and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Rating</p>
                    <p className="text-2xl font-bold text-yellow-500">★ {product.rating.toFixed(1)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Stock</p>
                    <p className={`text-2xl font-bold ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      {product.stock}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Brand and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Brand</p>
                <p className="font-semibold text-foreground">{product.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-semibold text-foreground">{product.category}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleFavorite}
                className={cn(isFavorite && 'text-destructive-foreground hover:text-destructive')}
              >
                <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
              </Button>
              <Link href={`/product/${id}/edit`}>
                <Button
                  variant="outline"
                  size="lg"
                >
                  Edit
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock Status:</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
