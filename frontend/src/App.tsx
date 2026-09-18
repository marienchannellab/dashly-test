import { useEffect, useRef, useState } from 'react'
import heroImage from './assets/skincare-routine-woman.webp'
import serumImage from './assets/skincare-serum-dropper.webp'
import AnnouncementBar from './components/AnnouncementBar'
import './App.css'

function App() {
  const [routinePressed, setRoutinePressed] = useState(false)
  const [carePressed, setCarePressed] = useState(false)
  const [shopPressed, setShopPressed] = useState(false)
  const [headerStuck, setHeaderStuck] = useState(false)
  const headerMarker = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marker = headerMarker.current
    if (!marker) return
    const observer = new IntersectionObserver(([entry]) => {
      setHeaderStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(marker)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="home-page">
      <AnnouncementBar />
      <div className="header-marker" ref={headerMarker} aria-hidden="true" />
        <header className={`site-header${headerStuck ? ' site-header--stuck' : ''}`}>
          <a className="brand-logo" href="#hero-title" aria-label="LUMEA home">LUMEA</a>
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
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.8 4.6a5.3 5.3 0 0 0-7.5 0L12 6l-1.3-1.4a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.9a5.3 5.3 0 0 0 0-7.5Z" />
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

        </header>

      <section className="hero" aria-labelledby="hero-title">
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
    </main>
  )
}

export default App
