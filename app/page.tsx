'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleTheme } from '@/lib/redux/slices/theme-slice'
import { logout } from '@/lib/redux/slices/auth-slice'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun, LogOut } from 'lucide-react'
import { ProductList } from '@/components/product-list'
import { HeroSection } from '@/components/hero-section'

export default function Home() {
  const dispatch = useAppDispatch()
  const isDark = useAppSelector((state) => state.theme.isDark)
  const user = useAppSelector((state) => state.auth.user)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    if (mounted && !user) {
      router.replace('/login')
    }
  }, [mounted, user, router])

  if (!mounted) return null
  if (!user) return null

  const handleLogout = () => {
    dispatch(logout())
    router.replace('/login')
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-foreground">Micky's Shop</h1>
          <div className="flex gap-2 items-center">
            <Link href="/favorites">
              <Button variant="ghost" className="hidden sm:inline-flex">Favorites</Button>
            </Link>
            <Link href="/create">
              <Button className="hidden sm:inline-flex">+ Add Product</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleTheme())}
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <span className="text-sm text-muted-foreground ml-2 hidden sm:inline-block">
              Welcome, {user.email.split('@')[0]}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection />

      <div id="products" className="mx-auto max-w-7xl p-4">
        <ProductList />
      </div>
    </main>
  )
}
