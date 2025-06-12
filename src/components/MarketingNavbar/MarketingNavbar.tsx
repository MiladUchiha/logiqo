'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X, Building2, ArrowRight } from 'lucide-react'
import styles from './MarketingNavbar.module.css'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const MarketingNavbar = () => {
  const router = useRouter()
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const navigationItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-triggered navbar state
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top -10',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setIsScrolled(self.progress > 0)
        },
      })
    })

    return () => ctx.revert()
  }, [])

  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen
    setIsMobileMenuOpen(newState)
    
    if (newState) {
      // Opening animation
      gsap.timeline()
        .set([mobileMenuRef.current, overlayRef.current], { display: 'block' })
        .to(overlayRef.current, { 
          opacity: 1, 
          duration: 0.2, 
          ease: 'power2.out' 
        })
        .to(mobileMenuRef.current, { 
          x: '0%', 
          duration: 0.3, 
          ease: 'power2.out' 
        }, '-=0.1')
        .fromTo(
          mobileMenuRef.current?.querySelectorAll('li') || [],
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, stagger: 0.03 }
        )
    } else {
      // Closing animation
      gsap.timeline()
        .to(mobileMenuRef.current, { 
          x: '100%', 
          duration: 0.25, 
          ease: 'power2.in' 
        })
        .to(overlayRef.current, { 
          opacity: 0, 
          duration: 0.15, 
          ease: 'power2.in' 
        }, '-=0.1')
        .set([mobileMenuRef.current, overlayRef.current], { display: 'none' })
    }
  }

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    gsap.timeline()
      .to(mobileMenuRef.current, { 
        x: '100%', 
        duration: 0.25, 
        ease: 'power2.in' 
      })
      .to(overlayRef.current, { 
        opacity: 0, 
        duration: 0.15, 
        ease: 'power2.in' 
      }, '-=0.1')
      .set([mobileMenuRef.current, overlayRef.current], { display: 'none' })
  }

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleSignIn = () => {
    router.push('/signin')
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      >
        <div className={styles.navContainer}>
          {/* Logo */}
          <div className={styles.logo}>
            <Building2 className={styles.logoIcon} />
            <h1 className={styles.logoText}>ConstructFlow</h1>
          </div>

          {/* Desktop Navigation */}
          <ul className={styles.navigation}>
            {navigationItems.map((item, index) => (
              <li key={index} className={styles.navItem}>
                <a
                  href={item.href}
                  className={styles.navLink}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className={styles.desktopActions}>
            <button 
              className={styles.signInButton}
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <button 
              className={styles.ctaButton}
              onClick={handleGetStarted}
            >
              <span>Get Started</span>
              <ArrowRight className={styles.ctaIcon} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={handleMobileMenuToggle}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={styles.mobileMenuIcon} />
            ) : (
              <Menu className={styles.mobileMenuIcon} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.visible : ''}`}
        onClick={handleMobileMenuToggle}
        style={{ display: 'none' }}
      />

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
        style={{ display: 'none' }}
      >
        <div className={styles.mobileMenuContent}>
          <ul className={styles.mobileNavigation}>
            {navigationItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={styles.mobileNavLink}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.mobileActions}>
            <button 
              className={styles.mobileSignInButton}
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <button 
              className={styles.mobileCtaButton}
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MarketingNavbar