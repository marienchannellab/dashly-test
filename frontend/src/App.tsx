import { useEffect, useRef, useState } from 'react'
import heroImage from './assets/skincare-routine-woman.webp'
import serumImage from './assets/skincare-serum-dropper.webp'
import AnnouncementBar from './components/AnnouncementBar'
import HowItWorks from './components/HowItWorks'
import './App.css'

function App() {
  const [routinePressed, setRoutinePressed] = useState(false)
  const [carePressed, setCarePressed] = useState(false)
  const [shopPressed, setShopPressed] = useState(false)
  const [headerStuck, setHeaderStuck] = useState(false)
  const headerMarker = useRef<HTMLDivElement>(null)
  const page = useRef<HTMLElement>(null)
  const hero = useRef<HTMLElement>(null)

  useEffect(() => {
    const marker = headerMarker.current
    if (!marker) return
    const observer = new IntersectionObserver(([entry]) => {
      setHeaderStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(marker)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const pageElement = page.current
    const heroElement = hero.current
    if (!pageElement || !heroElement) return

    const updateBackgroundHeight = () => {
      const heroBottom = heroElement.getBoundingClientRect().bottom
      const pageTop = pageElement.getBoundingClientRect().top
      pageElement.style.setProperty('--hero-background-height', `${heroBottom - pageTop + 32}px`)
    }

    const observer = new ResizeObserver(updateBackgroundHeight)
    observer.observe(heroElement)
    window.addEventListener('resize', updateBackgroundHeight)
    updateBackgroundHeight()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateBackgroundHeight)
    }
  }, [])

  return (
    <main className="home-page" ref={page}>
      <AnnouncementBar />
      <div className="header-marker" ref={headerMarker} aria-hidden="true" />
        <header className={`site-header${headerStuck ? ' site-header--stuck' : ''}`}>
          <div className="site-header__inner">
          <a
            className="brand-logo"
            href="#top"
            aria-label="LUMEA home"
            data-text="LUMEA"
            onClick={(event) => {
              event.preventDefault()
              window.history.replaceState(null, '', window.location.pathname + window.location.search)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            LUMEA
          </a>
          <nav className="desktop-navigation" aria-label="Shop navigation">
            {['Shop', 'Skincare', 'Sets', 'About'].map((item) => (
              <button
                key={item}
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>

          <nav className="header-actions" aria-label="Main navigation">
            <button
              className="icon-button menu-button"
              aria-label="Menu"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 6h14M5 12h14M5 18h14" />
              </svg>
            </button>
            <button className="icon-button search-button" aria-label="Search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg>
            </button>

            <button className="icon-button" aria-label="Wishlist">
              <svg className="header-heart" viewBox="0 0 32 32" aria-hidden="true">
                <path
                  transform="translate(3 4.5)"
                  vectorEffect="non-scaling-stroke"
                  d="M13 22.5C13 22.5 0.5 15.5 0.5 7.00001C0.500254 5.49768 1.02082 4.0418 1.97318 2.8799C2.92555 1.71801 4.25093 0.921813 5.72399 0.626686C7.19705 0.331559 8.72685 0.555718 10.0533 1.26105C11.3798 1.96638 12.421 3.10935 13 4.49563C13.579 3.10936 14.6202 1.96639 15.9467 1.26106C17.2731 0.555721 18.8029 0.33156 20.276 0.626686C21.7491 0.921812 23.0745 1.71801 24.0268 2.8799C24.9792 4.0418 25.4997 5.49768 25.5 7.00001C25.5 15.5 13 22.5 13 22.5Z"
                />
              </svg>
            </button>

            <button className="icon-button" aria-label="Shopping bag, 2 items">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 3h3l3 13h11l3-10H6M9 9h10" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              <span className="cart-count" aria-hidden="true">2</span>
            </button>
          </nav>
          </div>
        </header>

      <section className="hero" ref={hero} aria-labelledby="hero-title">
        <div className="hero-content">
          <h1 id="hero-title">
            Skincare made
            <br />
            <span>simple</span>
          </h1>

          <p className="hero-subtitle">
            Thoughtful formulas for
            <br />
            healthy, glowing skin
          </p>

          <div className="hero-cta">
            <p>Not sure what your skin needs?</p>

            <button
              className={`routine-button${routinePressed ? ' routine-button--pressed' : ''}`}
              onPointerDown={(event) => {
                if (event.pointerType !== 'mouse') setRoutinePressed(true)
              }}
              onBlur={() => setRoutinePressed(false)}
            >
              <span className="routine-button__background" aria-hidden="true" />
              <span className="routine-button__content">
                Find your routine
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18 18 6M6 6h12v12" />
              </svg>
              </span>
            </button>
          </div>

          <button
            className={`care-badge${carePressed ? ' care-badge--pressed' : ''}`}
            type="button"
            onPointerDown={(event) => {
              if (event.pointerType !== 'mouse') setCarePressed(true)
            }}
            onBlur={() => setCarePressed(false)}
          >
            <span>Dermatologist-inspired care</span>
          </button>

          <img
            className="hero-image"
            src={heroImage}
            alt="Woman with her eyes closed enjoying the sunlight"
            fetchPriority="high"
          />
          <aside className="essentials">
            <img className="essentials-image" src={serumImage} alt="Skincare serum in a glass dropper" />
            <div className="essentials-card">
              <h2>LUMEA essentials</h2>
              <p>Simple formulas.<br />Thoughtful ingredients.<br />Everyday results.</p>
              <button
                type="button"
                className={`essentials-button${shopPressed ? ' essentials-button--pressed' : ''}`}
                onPointerDown={(event) => {
                  if (event.pointerType !== 'mouse') setShopPressed(true)
                }}
                onBlur={() => setShopPressed(false)}
              >
                <span className="essentials-button__background" aria-hidden="true" />
                <span className="essentials-button__content">Shop now <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg></span>
              </button>
            </div>
          </aside>
        </div>
      </section>
      <HowItWorks />
    </main>
  )
}

export default App
