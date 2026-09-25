import { useEffect, useRef, useState } from 'react'
import cleanseImage from '../assets/skincare-cleanse-routine.webp'
import treatmentImage from '../assets/skincare-treatment-routine.webp'
import moisturisingImage from '../assets/skincare-moisturising-routine.webp'
import protectionImage from '../assets/skincare-sun-protection.webp'
import headingStar from '../assets/how-it-works-star.svg'
import { getCategories, getProducts } from '../api/products'
import type { Category, Product } from '../types/product'
import ProductCatalog from './ProductCatalog'
import './HowItWorks.css'

const steps = [
  {
    number: '01',
    name: 'Cleanse',
    tagline: 'Start with a fresh canvas.',
    description: 'Gently remove makeup, SPF and daily impurities without stripping your skin.',
    cta: 'Shop cleansers',
    image: cleanseImage,
    imageAlt: 'Applying a cleanser to the palm of a hand',
    className: 'step-card--cleanse',
  },
  {
    number: '02',
    name: 'Treat',
    tagline: 'Target what your skin needs.',
    description: 'Serums and treatments deliver targeted ingredients to help with dryness, dullness, texture and blemishes.',
    cta: 'Shop treatments',
    image: treatmentImage,
    imageAlt: 'Applying a skincare treatment to the palm of a hand',
    className: 'step-card--treat',
  },
  {
    number: '03',
    name: 'Moisturise',
    tagline: 'Lock in lasting hydration.',
    description: 'Moisturisers help strengthen the skin barrier, lock in hydration and leave skin soft and balanced.',
    cta: 'Shop moisturisers',
    image: moisturisingImage,
    imageAlt: 'Woman applying moisturiser to her face',
    className: 'step-card--moisturise',
  },
  {
    number: '04',
    name: 'Protect',
    tagline: 'Your essential final step.',
    description: 'Daily SPF helps protect your skin from UV damage and keeps it looking healthy every day.',
    cta: 'Shop SPF',
    image: protectionImage,
    imageAlt: 'Woman applying sun protection to her face',
    className: 'step-card--protect',
  },
]

const DESKTOP_STACK_BOTTOM_GAP = 96

function HowItWorks() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(() => (
    window.innerWidth >= 900 ? 0 : null
  ))
  const [selectedStep, setSelectedStep] = useState<number | null>(() => (
    window.innerWidth >= 900 ? 0 : null
  ))
  const stepsRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<Array<HTMLElement | null>>([])
  const desktopCatalogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getProducts()
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Failed to load products:', error))
      .finally(() => setLoading(false))

    getCategories()
      .then(setCategories)
      .catch((error) => console.error('Failed to load categories:', error))
  }, [])

  useEffect(() => {
    if (!catalogOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('catalog-modal-open')

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCatalogOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('catalog-modal-open')
    }
  }, [catalogOpen])

  useEffect(() => {
    const stack = stepsRef.current
    const desktopCatalog = desktopCatalogRef.current
    const cards = stepRefs.current.filter((card): card is HTMLElement => Boolean(card))
    if (!stack || !desktopCatalog || !cards.length) return

    let frame = 0
    let lockScrollY: number | null = null
    let catalogLockScrollY: number | null = null

    const unlockCatalog = () => {
      desktopCatalog.classList.remove('how-it-works__desktop-catalog--fixed')
      desktopCatalog.style.removeProperty('--catalog-left')
      desktopCatalog.style.removeProperty('--catalog-width')
      desktopCatalog.style.removeProperty('--stack-shift')
      catalogLockScrollY = null
    }

    const unlockStack = () => {
      stack.classList.remove('steps--locked')
      stack.style.removeProperty('--stack-left')
      stack.style.removeProperty('--stack-width')
      stack.style.removeProperty('--stack-shift')
      stack.style.removeProperty('height')
      desktopCatalog.style.removeProperty('--stack-shift')
      lockScrollY = null
    }

    const updateStackLock = () => {
      frame = 0

      if (window.innerWidth < 900) {
        unlockStack()
        unlockCatalog()
        return
      }

      const stackRect = stack.getBoundingClientRect()
      const requiredBottom = Math.max(
        ...cards.map((card) => Number.parseFloat(getComputedStyle(card).top) + card.offsetHeight),
      )
      const isLocked = stack.classList.contains('steps--locked')
      const isCatalogFixed = desktopCatalog.classList.contains(
        'how-it-works__desktop-catalog--fixed',
      )

      if (!isCatalogFixed) {
        const catalogRect = desktopCatalog.getBoundingClientRect()
        if (catalogRect.top <= 111) {
          desktopCatalog.style.setProperty('--catalog-left', `${catalogRect.left}px`)
          desktopCatalog.style.setProperty('--catalog-width', `${catalogRect.width}px`)
          desktopCatalog.classList.add('how-it-works__desktop-catalog--fixed')
          catalogLockScrollY = window.scrollY
        }
      } else if (
        !isLocked &&
        catalogLockScrollY !== null &&
        window.scrollY < catalogLockScrollY - 2
      ) {
        unlockCatalog()
      }

      if (isLocked) {
        if (lockScrollY !== null && window.scrollY < lockScrollY - 2) {
          unlockStack()
          return
        }

        const shift = Math.max(
          0,
          requiredBottom + DESKTOP_STACK_BOTTOM_GAP - stackRect.bottom,
        )
        stack.style.setProperty('--stack-shift', `${shift}px`)
        desktopCatalog.style.setProperty('--stack-shift', `${shift}px`)
        return
      }

      const isFullyCollapsed = cards.every((card) => {
        const stickyTop = Number.parseFloat(getComputedStyle(card).top)
        return Math.abs(card.getBoundingClientRect().top - stickyTop) <= 2
      })

      if (!isFullyCollapsed) return

      const catalogRect = desktopCatalog.getBoundingClientRect()
      stack.style.setProperty('--stack-left', `${stackRect.left}px`)
      stack.style.setProperty('--stack-width', `${stackRect.width}px`)
      stack.style.setProperty('--stack-shift', '0px')
      desktopCatalog.style.setProperty('--catalog-left', `${catalogRect.left}px`)
      desktopCatalog.style.setProperty('--catalog-width', `${catalogRect.width}px`)
      desktopCatalog.style.setProperty('--stack-shift', '0px')
      stack.style.height = `${stack.offsetHeight}px`
      lockScrollY = window.scrollY
      stack.classList.add('steps--locked')
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateStackLock)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    scheduleUpdate()

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      unlockStack()
      unlockCatalog()
    }
  }, [])

  useEffect(() => {
    let frame = 0

    const updateActiveStep = () => {
      frame = 0
      if (window.innerWidth >= 900) {
        setActiveStep((currentStep) => currentStep ?? 0)
        setSelectedStep((currentStep) => currentStep ?? 0)
        return
      }

      let currentStep: number | null = null
      stepRefs.current.forEach((card, index) => {
        if (!card) return
        const stickyTop = Number.parseFloat(getComputedStyle(card).top)
        if (card.getBoundingClientRect().top <= stickyTop + 2) currentStep = index
      })
      setActiveStep(currentStep)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateActiveStep)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    scheduleUpdate()

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  function selectStep(index: number) {
    setActiveStep(index)
    setSelectedStep(index)
  }

  function openCatalog(index: number) {
    setActiveStep(index)
    setSelectedStep(index)
    setCatalogOpen(true)
  }

  return (
    <section className="how-it-works" aria-labelledby="how-it-works-title">
      <header className="how-it-works__heading">
        <h2 id="how-it-works-title">
          How it
          <img
            className="how-it-works__heading-star"
            src={headingStar}
            alt=""
            aria-hidden="true"
          />
          <strong>works</strong>
        </h2>
        <p>
          <span>4 simple steps to</span>{' '}
          <span>healthier-looking skin</span>
        </p>
      </header>

      <div className="how-it-works__layout">
        <div className="steps" ref={stepsRef}>
          {steps.map((step, index) => (
            <article
              key={step.number}
              ref={(node) => { stepRefs.current[index] = node }}
              className={`step-card ${step.className}${activeStep === index ? ' step-card--active' : ''}`}
              onClick={() => {
                if (window.innerWidth < 900) {
                  openCatalog(index)
                } else {
                  selectStep(index)
                }
              }}
            >
              <h3>
                <span className="step-card__number" aria-label={step.number}>
                  <span aria-hidden="true">{step.number}</span>
                </span>
                <span className="step-card__name">{step.name}</span>
              </h3>
              <p className="step-card__tagline">{step.tagline}</p>
              <p className="step-card__description">{step.description}</p>
              <button
                type="button"
                className="step-card__cta"
                onClick={(event) => {
                  event.stopPropagation()
                  if (window.innerWidth < 900) {
                    openCatalog(index)
                  } else {
                    selectStep(index)
                  }
                }}
              >
                {step.cta}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path className="step-card__arrow-desktop" d="M6 18 18 6M7 6h11v11" />
                  <path className="step-card__arrow-mobile" d="M2 12h20m-7-7 7 7-7 7" />
                </svg>
              </button>
              <img src={step.image} alt={step.imageAlt} />
            </article>
          ))}
        </div>

        <div className="how-it-works__desktop-catalog" ref={desktopCatalogRef}>
          {loading ? <p>Loading products…</p> : (
            <ProductCatalog
              categories={categories}
              products={products}
              eyebrow={selectedStep === null ? 'Shop products' : steps[selectedStep].cta}
              resetKey={activeStep}
            />
          )}
        </div>
      </div>

      {catalogOpen && (
        <div
          className="catalog-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="catalog-modal-title"
          onClick={(event) => {
            if (event.target === event.currentTarget && window.innerWidth >= 600) {
              setCatalogOpen(false)
            }
          }}
        >
          <div className="catalog-modal__panel">
            <button
              className="catalog-modal__close"
              type="button"
              aria-label="Close products"
              onClick={() => setCatalogOpen(false)}
            >
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 2l10 10M12 2 2 12" />
              </svg>
            </button>
            <h2 id="catalog-modal-title">
              {activeStep === null ? 'Shop products' : steps[activeStep].cta}
            </h2>
            {loading ? <p>Loading products…</p> : (
              <ProductCatalog
                categories={categories}
                products={products}
                eyebrow={null}
                resetKey={activeStep}
              />
            )}
            <p className="catalog-modal__label">Shop products for:</p>
            <div className="catalog-modal__steps">
              {steps.map((step, index) => (
                <button
                  key={step.number}
                  type="button"
                  className={activeStep === index ? 'catalog-modal__step--active' : undefined}
                  aria-pressed={activeStep === index}
                  onClick={() => setActiveStep(index)}
                >
                  <span>{step.number}</span> {step.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HowItWorks
