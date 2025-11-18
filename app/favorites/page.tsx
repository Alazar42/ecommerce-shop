'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchProducts } from '@/lib/redux/slices/products-slice'
import { removeFavorite } from '@/lib/redux/slices/favorites-slice'
import { toggleTheme } from '@/lib/redux/slices/theme-slice'
import { ProductCard } from '@/components/product-card'
import { ChevronLeft, Heart, Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { RequireAuth } from '@/components/require-auth'

export default function FavoritesPage() {
  const dispatch = useAppDispatch()
  const favoriteIds = useAppSelector((state) => state.favorites.items)
  const allProducts = useAppSelector((state) => state.products.items)
  const isDark = useAppSelector((state) => state.theme.isDark)
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([])

  useEffect(() => {
    dispatch(fetchProducts({ skip: 0, limit: 100 }))
  }, [dispatch])

  useEffect(() => {
    const filtered = allProducts.filter((product) => favoriteIds.includes(product.id))
    setFavoriteProducts(filtered)
  }, [allProducts, favoriteIds])

  const handleRemoveFavorite = (productId: number) => {
    dispatch(removeFavorite(productId))
    toast.success('Removed from favorites')
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card sticky top-0 z-50">
          <div className="mx-auto max-w-7xl flex items-center justify-between p-4">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <h1 className="text-2xl font-bold">Favorites</h1>
            </Link>
            <div className="flex gap-2">
              <Link href="/create">
                <Button>+ Add Product</Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(toggleTheme())}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl p-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 fill-destructive text-destructive" />
              <h2 className="text-xl font-semibold text-foreground">
                Saved Items
              </h2>
            </div>
            <p className="text-muted-foreground">
              You have {favoriteIds.length} favorited product{favoriteIds.length !== 1 ? 's' : ''}
            </p>
          </div>

          {favoriteProducts.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Favorites Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start adding products to your favorites to see them here
                </p>
                <Link href="/">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFavorite(product.id)}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </RequireAuth>
  )
}
