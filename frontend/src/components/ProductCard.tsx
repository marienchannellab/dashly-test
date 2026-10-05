import { useState } from 'react'
import type { Product } from '../types/product'
import { STRAPI_URL } from '../config'

interface ProductCardProps {
  product: Product
}

interface ResilientImageProps {
  src: string
  alt: string
  className: string
  skeletonClassName: string
  decorative?: boolean
}

function ResilientImage({
  src,
  alt,
  className,
  skeletonClassName,
  decorative = false,
}: ResilientImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  )

  return (
    <span className={`${className}-frame`}>
      {status !== 'loaded' && (
        <span
          className={`${className} ${skeletonClassName} product-card__skeleton`}
          role={decorative ? undefined : 'img'}
          aria-label={decorative ? undefined : `Image for ${alt}`}
          aria-hidden={decorative || undefined}
        />
      )}

      {status !== 'error' && (
        <img
          className={`${className}${status === 'loading' ? ' product-card__image--loading' : ''}`}
          src={src}
          alt={decorative ? '' : alt}
          aria-hidden={decorative || undefined}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </span>
  )
}

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
        {product.image ? (
          <ResilientImage
            key={product.image.url}
            src={`${STRAPI_URL}${product.image.url}`}
            alt={product.image.alternativeText ?? product.name}
            className="product-card__image"
            skeletonClassName="product-card__image--skeleton"
          />
        ) : (
          <div
            className="product-card__image product-card__image--skeleton product-card__skeleton"
            role="img"
            aria-label={`Image for ${product.name} is unavailable`}
          />
        )}

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
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path
              transform="translate(3 4.5)"
              d="M13 22.5C13 22.5 0.5 15.5 0.5 7.00001C0.500254 5.49768 1.02082 4.0418 1.97318 2.8799C2.92555 1.71801 4.25093 0.921813 5.72399 0.626686C7.19705 0.331559 8.72685 0.555718 10.0533 1.26105C11.3798 1.96638 12.421 3.10935 13 4.49563C13.579 3.10936 14.6202 1.96639 15.9467 1.26106C17.2731 0.555721 18.8029 0.33156 20.276 0.626686C21.7491 0.921812 23.0745 1.71801 24.0268 2.8799C24.9792 4.0418 25.4997 5.49768 25.5 7.00001C25.5 15.5 13 22.5 13 22.5Z"
            />
          </svg>
        </button>
      </div>

      <div className="product-card__title-block">
        <h2>{product.name}</h2>
        <p>{product.size}</p>
      </div>

      <div className="product-card__variations">
        {product.variationGroups
          .toSorted((a, b) => a.order - b.order)
          .map((group) => (
            <div
              key={group.id}
              className={`product-card__variation-group ${
                group.name === 'Formula'
                  ? 'product-card__variation-group--formula'
                  : ''
              } ${
                ['Formula', 'Set includes', 'Choose finish'].includes(
                  group.name,
                )
                  ? 'product-card__variation-group--stacked'
                  : ''
              } ${
                group.name === 'Size'
                  ? 'product-card__variation-group--size'
                  : ''
              } ${
                group.name === 'Skin type'
                  ? 'product-card__variation-group--skin-type'
                  : ''
              }`}
            >
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
                          <ResilientImage
                            key={option.image.url}
                            src={`${STRAPI_URL}${option.image.url}`}
                            alt=""
                            className="product-card__option-image"
                            skeletonClassName="product-card__option-image--skeleton"
                            decorative
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

      <button className="product-card__add" type="button">
        <span className="product-card__add-background" aria-hidden="true" />
        <span className="product-card__add-content">
          Add to bag
          <svg
            className="product-card__add-arrow"
            viewBox="0 0 14 16"
            aria-hidden="true"
          >
            <path d="M1 15 13 3M5 3h8v8" />
          </svg>
        </span>
      </button>
      <button className="product-card__details" type="button">View details</button>
    </article>
  )
}

export default ProductCard
