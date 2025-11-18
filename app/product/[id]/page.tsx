'use client'

import { ProductDetails } from '@/components/product-details'
import { RequireAuth } from '@/components/require-auth'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  return <RequireAuth>
          <ProductDetails id={id} />
         </RequireAuth>
}
