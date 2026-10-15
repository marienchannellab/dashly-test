import { useEffect, useRef } from 'react'
import type { Product } from '../types/product'
import ProductCard from './ProductCard'

interface MobileProductDetailsProps {
  product: Product
  onBack: () => void
}

function MobileProductDetails({ product, onBack }: MobileProductDetailsProps) {
  const backButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    backButtonRef.current?.focus()
  }, [])

  return (
    <section
      className="mobile-product-details"
      aria-labelledby="mobile-product-details-title"
    >
      <header className="mobile-product-details__header">
        <button
          ref={backButtonRef}
          className="mobile-product-details__back"
          type="button"
          onClick={onBack}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 5-7 7 7 7" />
          </svg>
          Back to products
        </button>
        <h2 id="mobile-product-details-title">Product details</h2>
      </header>

      <div className="product-catalog mobile-product-details__card">
        <ProductCard product={product} expanded />
      </div>
    </section>
  )
}

export default MobileProductDetails
