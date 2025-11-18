'use client'

import { useRouter } from 'next/navigation'
import { AuthLogin } from '@/components/auth-login'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/lib/hooks'

export default function LoginPage() {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      router.replace('/')
    }
  }, [mounted, user, router])

  if (!mounted) return null
  if (user) return null

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <AuthLogin onSuccess={() => {
        setTimeout(() => router.replace('/'), 0)
      }} />
    </main>
  )
}
