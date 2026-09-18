import { useState } from 'react'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
}

const STRAPI_URL = 'http://localhost:1337'

const variationLabels: Record<string, string> = {
  Formula: 'Choose formula:',
  'Skin type': 'Skin type:',
  Size: 'Size:',
  'Set includes': 'Set includes:',
  'Choose finish': 'Choose finish:',
}

function getInitialSelectedOptions(product: Product) {
  return product.variationGroups.reduce<Record<number, number>>(
    (selectedOptions, group) => {
      const firstOption = [...group.options].sort(
        (a, b) => a.order - b.order,
      )[0]

      if (firstOption) {
        selectedOptions[group.id] = firstOption.id
      }

      return selectedOptions
    },
    {},
  )
}

function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >(() => getInitialSelectedOptions(product))

  const { mode, basePrice, discountPercent, salePrice } = product.pricing

  const finalPrice =
    mode === 'percentage' && discountPercent != null
      ? basePrice * (1 - discountPercent / 100)
      : mode === 'fixed' && salePrice != null
        ? salePrice
        : basePrice

  const calculatedDiscountPercent =
    mode === 'fixed' && salePrice != null && salePrice < basePrice
      ? Math.round(((basePrice - salePrice) / basePrice) * 100)
      : discountPercent

  const hasDiscount =
    calculatedDiscountPercent != null &&
    calculatedDiscountPercent > 0 &&
    finalPrice < basePrice

  const handleOptionSelect = (groupId: number, optionId: number) => {
    setSelectedOptions((current) => ({
      ...current,
      [groupId]: optionId,
    }))
  }

  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src={`${STRAPI_URL}${product.image.url}`}
          alt={product.image.alternativeText ?? product.name}
        />

        <div className="product-card__badges">
          {product.badges.map((badge) => (
            <span key={badge.id} className="product-card__badge">
              {badge.label}
            </span>
          ))}
        </div>

        <button
          className={`product-card__favorite ${
            isFavorite ? 'product-card__favorite--active' : ''
          }`}
          type="button"
          aria-label={
            isFavorite
              ? `Remove ${product.name} from favorites`
              : `Add ${product.name} to favorites`
          }
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((current) => !current)}
        >
          <span aria-hidden="true">♡</span>
        </button>
      </div>

      <h2>{product.name}</h2>
      <p>{product.size}</p>

      <div className="product-card__variations">
        {product.variationGroups
          .toSorted((a, b) => a.order - b.order)
          .map((group) => (
            <div key={group.id} className="product-card__variation-group">
              <p>{variationLabels[group.name] ?? `${group.name}:`}</p>

              <div className="product-card__options">
                {group.options
                  .toSorted((a, b) => a.order - b.order)
                  .map((option) => {
                    const isSelected =
                      selectedOptions[group.id] === option.id

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`product-card__option ${
                          option.image
                            ? 'product-card__option--with-image'
                            : ''
                        } ${
                          isSelected
                            ? 'product-card__option--active'
                            : ''
                        }`}
                        aria-pressed={isSelected}
                        onClick={() =>
                          handleOptionSelect(group.id, option.id)
                        }
                      >
                        {option.image && (
                          <img
                            className="product-card__option-image"
                            src={`${STRAPI_URL}${option.image.url}`}
                            alt=""
                            aria-hidden="true"
                          />
                        )}

                        <span className="product-card__option-label">
                          {option.value}
                        </span>

                        {option.discountPercent != null && (
                          <span className="product-card__option-discount">
                            -{option.discountPercent}%
                          </span>
                        )}
                      </button>
                    )
                  })}
              </div>
            </div>
          ))}
      </div>

      <div className="product-card__pricing">
        {hasDiscount && (
          <span className="product-card__old-price">
            £{basePrice.toFixed(2)}
          </span>
        )}

        <span className="product-card__price">
          Price £{finalPrice.toFixed(2)}
        </span>

        {hasDiscount && (
          <span className="product-card__discount">
            -{calculatedDiscountPercent}%
          </span>
        )}
      </div>
    </article>
  )
}

export default ProductCard