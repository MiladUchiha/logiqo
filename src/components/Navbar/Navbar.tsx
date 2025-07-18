'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Menu, 
  X, 
  Building2, 
  Home, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  LogOut,
  User
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import styles from './Navbar.module.css'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Documents', href: '/documents', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
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
    
    router.push(href)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      >
        <div className={styles.navContainer}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => router.push('/dashboard')}>
            <Building2 className={styles.logoIcon} />
            <h1 className={styles.logoText}>ConstructFlow</h1>
          </div>

          {/* Desktop Navigation */}
          <ul className={styles.navigation}>
            {navigationItems.map((item, index) => (
              <li key={index} className={styles.navItem}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`${styles.navLink} ${isActiveRoute(item.href) ? styles.activeLink : ''}`}
                >
                  <item.icon size={16} />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          {/* User Menu */}
          <div className={styles.userMenu}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <User size={16} />
              </div>
              <span className={styles.userName}>
                {user?.user_metadata?.full_name || user?.email || 'User'}
              </span>
            </div>
            
            <button
              className={styles.signOutButton}
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut size={16} />
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
          {/* Mobile User Info */}
          <div className={styles.mobileUserInfo}>
            <div className={styles.mobileUserAvatar}>
              <User size={20} />
            </div>
            <div className={styles.mobileUserDetails}>
              <div className={styles.mobileUserName}>
                {user?.user_metadata?.full_name || 'User'}
              </div>
              <div className={styles.mobileUserEmail}>
                {user?.email}
              </div>
            </div>
          </div>

          <ul className={styles.mobileNavigation}>
            {navigationItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  className={`${styles.mobileNavLink} ${isActiveRoute(item.href) ? styles.activeMobileLink : ''}`}
                >
                  <item.icon size={18} />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          
          <div className={styles.mobileActions}>
            <button 
              className={styles.mobileSignOutButton}
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar