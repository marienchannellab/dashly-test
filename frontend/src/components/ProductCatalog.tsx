import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import type { Category, Product } from '../types/product'

interface ProductCatalogProps {
  categories: Category[]
  products: Product[]
  eyebrow?: string | null
  resetKey?: number | null
}

function ProductCatalog({ categories, products, eyebrow, resetKey }: ProductCatalogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories[0]?.id ?? null,
  )
  const trackRef = useRef<HTMLDivElement>(null)
  const activeCategoryId = categories.some(
    (category) => category.id === selectedCategoryId,
  )
    ? selectedCategoryId
    : categories[0]?.id ?? null

  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0
  }, [activeCategoryId, resetKey])

  const visibleProducts = useMemo(() => {
    if (activeCategoryId === null) return products

    const productsInCategory = products.filter((product) =>
      product.categories?.some((category) => category.id === activeCategoryId),
    )

    return productsInCategory.length > 0 ? productsInCategory : products
  }, [activeCategoryId, products])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const titleBlocks = Array.from(
      track.querySelectorAll<HTMLElement>('.product-card__title-block'),
    )

    const syncTitleHeight = () => {
      const tallestTitle = titleBlocks.reduce((maximumHeight, block) => {
        const heading = block.querySelector<HTMLElement>('h2')
        const size = block.querySelector<HTMLElement>('p')
        const headingStyles = heading ? getComputedStyle(heading) : null
        const sizeStyles = size ? getComputedStyle(size) : null
        const naturalHeight =
          (heading?.getBoundingClientRect().height ?? 0) +
          (size?.getBoundingClientRect().height ?? 0) +
          (headingStyles ? parseFloat(headingStyles.marginTop) : 0) +
          (headingStyles ? parseFloat(headingStyles.marginBottom) : 0) +
          (sizeStyles ? parseFloat(sizeStyles.marginTop) : 0) +
          (sizeStyles ? parseFloat(sizeStyles.marginBottom) : 0)

        return Math.max(maximumHeight, naturalHeight)
      }, 0)

      track.style.setProperty(
        '--product-title-height',
        `${Math.ceil(tallestTitle)}px`,
      )
    }

    syncTitleHeight()

    const resizeObserver = new ResizeObserver(syncTitleHeight)
    titleBlocks.forEach((block) => {
      const heading = block.querySelector('h2')
      const size = block.querySelector('p')
      if (heading) resizeObserver.observe(heading)
      if (size) resizeObserver.observe(size)
    })

    void document.fonts?.ready.then(syncTitleHeight)

    return () => resizeObserver.disconnect()
  }, [visibleProducts])

  return (
    <div className="product-catalog">
      {eyebrow !== null && (
        <p className="product-catalog__eyebrow">
          {eyebrow ?? `Shop ${categories.find((category) => category.id === activeCategoryId)?.name.toLowerCase() ?? 'products'}`}
        </p>
      )}

      {categories.length > 0 && (
        <div className="product-catalog__categories" role="tablist" aria-label="Product categories">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategoryId === category.id}
              className={activeCategoryId === category.id ? 'product-catalog__category--active' : undefined}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="product-catalog__track" ref={trackRef}>
        {visibleProducts.map((product) => (
          <ProductCard key={product.documentId} product={product} />
        ))}

        {visibleProducts.length === 0 && (
          <p className="product-catalog__empty">No products in this category yet.</p>
        )}
      </div>
    </div>
  )
}

export default ProductCatalog
