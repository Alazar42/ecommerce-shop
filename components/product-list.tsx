'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchProducts } from '@/lib/redux/slices/products-slice'
import { ProductCard } from './product-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function ProductList() {
  const dispatch = useAppDispatch()
  const { items, loading, error, total, skip, limit } = useAppSelector((state) => state.products)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [searchQuery])

  useEffect(() => {
    dispatch(fetchProducts({ skip: 0, limit, search: debouncedSearch }))
  }, [debouncedSearch, dispatch, limit])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && items.length < total) {
          dispatch(fetchProducts({ skip: skip + limit, limit, search: debouncedSearch }))
        }
      },
      { threshold: 0.1 }
    )
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [dispatch, hasMore, loading, items.length, total, skip, limit, debouncedSearch])

  useEffect(() => {
    setHasMore(skip + limit < total)
  }, [skip, limit, total])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleClearSearch = () => setSearchQuery('')

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium">Search Products</label>
        <div className="flex gap-2 flex-col sm:flex-row">
          <Input
            id="search"
            placeholder="Search by title, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          {searchQuery && (
            <Button variant="outline" onClick={handleClearSearch} className="w-full sm:w-auto">
              Clear
            </Button>
          )}
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found. Try a different search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          {hasMore && (
            <div ref={observerTarget} className="flex items-center justify-center py-8">
              {loading && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading more products...</span>
                </div>
              )}
            </div>
          )}

          {!hasMore && items.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No more products to load
            </div>
          )}
        </>
      )}
    </div>
  )
}
