'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/product-form'
import { DeleteProductDialog } from '@/components/delete-product-dialog'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchProductById } from '@/lib/redux/slices/products-slice'
import { toggleTheme } from '@/lib/redux/slices/theme-slice'
import { ChevronLeft, Moon, Sun, Trash2 } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { RequireAuth } from '@/components/require-auth'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const id = parseInt(params.id as string)
  const { items, loading } = useAppSelector((state) => state.products)
  const isDark = useAppSelector((state) => state.theme.isDark)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const product = items.find((p) => p.id === id)

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id, product])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading product...</span>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card sticky top-0 z-50">
          <div className="mx-auto max-w-7xl flex items-center justify-between p-4">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground">
              <ChevronLeft className="w-4 h-4" />
              <h1 className="text-2xl font-bold">Edit Product</h1>
            </Link>
          </div>
        </nav>
        <div className="mx-auto max-w-2xl p-4 text-center">
          <p className="text-muted-foreground">Product not found</p>
          <Link href="/">
            <Button className="mt-4">Back to Shop</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card sticky top-0 z-50">
          <div className="mx-auto max-w-7xl flex items-center justify-between p-4">
            <Link href={`/product/${id}`} className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <h1 className="text-2xl font-bold">Edit Product</h1>
            </Link>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
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

        <div className="mx-auto max-w-2xl p-4">
          <ProductForm
            initialData={product}
            isEditing
            onSuccess={() => router.push(`/product/${id}`)}
          />
        </div>

        <DeleteProductDialog
          productId={product.id}
          productTitle={product.title}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onSuccess={() => router.push('/')}
        />
      </main>
    </RequireAuth>
  )
}
