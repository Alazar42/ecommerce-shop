'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/product-form'
import { ChevronLeft, Moon, Sun } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleTheme } from '@/lib/redux/slices/theme-slice'
import { RequireAuth } from '@/components/require-auth'

export default function CreateProductPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isDark = useAppSelector((state) => state.theme.isDark)

  return (
    <RequireAuth>
      <main className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card sticky top-0 z-50">
          <div className="mx-auto max-w-7xl flex items-center justify-between p-4">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <h1 className="text-2xl font-bold">Add Product</h1>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleTheme())}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </nav>

        <div className="mx-auto max-w-2xl p-4">
          <ProductForm onSuccess={() => router.push('/')} />
        </div>
      </main>
    </RequireAuth>
  )
}
