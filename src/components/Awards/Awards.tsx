'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { Star, Quote, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import styles from './Awards.module.css'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  rating: number
  text: string
  avatar: string
  year: string
  award: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    rating: 5,
    text: "This AI tool has revolutionized our workflow. The interface is intuitive and the results are consistently outstanding.",
    avatar: "SC",
    year: "2024",
    award: "Best AI Innovation"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Lead Developer",
    company: "StartupXYZ",
    rating: 5,
    text: "Incredible performance and reliability. It's become an essential part of our development process.",
    avatar: "MR",
    year: "2023",
    award: "Developer's Choice"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Design Director",
    company: "Creative Agency",
    rating: 5,
    text: "The AI capabilities are mind-blowing. It understands context perfectly and delivers exactly what we need.",
    avatar: "EW",
    year: "2023",
    award: "Design Excellence"
  },
  {
    id: 4,
    name: "David Kim",
    role: "CTO",
    company: "Innovation Labs",
    rating: 5,
    text: "Best AI tool we've ever used. The accuracy and speed are unmatched in the industry.",
    avatar: "DK",
    year: "2022",
    award: "Technology Leader"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Marketing Lead",
    company: "Global Corp",
    rating: 5,
    text: "Game-changing technology! Our team productivity has increased by 300% since implementation.",
    avatar: "LT",
    year: "2022",
    award: "Business Impact"
  }
]

export const Awards = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isManualChange, setIsManualChange] = useState(false)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const flashOverlayRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Create infinite array by tripling the testimonials
  const infiniteTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials
  ]

  const totalCards = testimonials.length

  const triggerFlashEffect = useCallback((direction: 'left' | 'right') => {
    if (flashOverlayRef.current) {
      const overlay = flashOverlayRef.current
      
      // Set initial state
      gsap.set(overlay, {
        opacity: 0,
        background: direction === 'left' 
          ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.3), transparent)'
          : 'linear-gradient(-90deg, rgba(37, 99, 235, 0.3), transparent)',
        display: 'block'
      })
      
      // Flash animation
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(overlay, { display: 'none' })
            }
          })
        }
      })
    }
    
    // Add ripple effect to navigation button
    const buttons = document.querySelectorAll(`.${styles.navButton}`)
    const targetButton = direction === 'left' ? buttons[0] : buttons[1]
    
    if (targetButton) {
      gsap.to(targetButton, {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(targetButton, {
            scale: 1,
            duration: 0.2,
            ease: "elastic.out(1, 0.3)"
          })
        }
      })
    }
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCards)
  }, [totalCards])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards)
  }, [totalCards])

  const handleManualNext = useCallback(() => {
    // Clear any existing manual timeout
    if (manualTimeoutRef.current) {
      clearTimeout(manualTimeoutRef.current)
    }
    
    setIsManualChange(true)
    triggerFlashEffect('right')
    nextSlide()
    
    // Reset manual change flag after animation completes
    manualTimeoutRef.current = setTimeout(() => {
      setIsManualChange(false)
    }, 600) // Match animation duration
  }, [triggerFlashEffect, nextSlide])

  const handleManualPrev = useCallback(() => {
    // Clear any existing manual timeout
    if (manualTimeoutRef.current) {
      clearTimeout(manualTimeoutRef.current)
    }
    
    setIsManualChange(true)
    triggerFlashEffect('left')
    prevSlide()
    
    // Reset manual change flag after animation completes
    manualTimeoutRef.current = setTimeout(() => {
      setIsManualChange(false)
    }, 600) // Match animation duration
  }, [triggerFlashEffect, prevSlide])

  const startAutoPlay = useCallback(() => {
    // Clear existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    // Start new interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards)
    }, 4000)
  }, [totalCards])

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handleManualPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleManualNext()
      } else if (event.key === ' ') {
        event.preventDefault()
        if (intervalRef.current) {
          stopAutoPlay()
        } else {
          startAutoPlay()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleManualNext, handleManualPrev, startAutoPlay, stopAutoPlay])

  // Initialize autoplay only once
  useEffect(() => {
    startAutoPlay()
    return () => {
      stopAutoPlay()
      if (manualTimeoutRef.current) {
        clearTimeout(manualTimeoutRef.current)
      }
    }
  }, [startAutoPlay, stopAutoPlay])

  useEffect(() => {
    if (!cardsContainerRef.current) return

    const cards = cardsContainerRef.current.querySelectorAll(`.${styles.card}`)
    
    // Consistent animation duration
    const animationDuration = 0.6
    const easing = isManualChange ? "back.out(1.7)" : "power2.out"
    
    // Animate all cards with infinite positioning
    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement
      
      // Calculate the actual position in the testimonials array
      const testimonialIndex = index % totalCards
      
      // Calculate distance from current center, considering infinite loop
      let distance = testimonialIndex - currentIndex
      
      // Handle wrapping for shortest distance
      if (distance > totalCards / 2) {
        distance -= totalCards
      } else if (distance < -totalCards / 2) {
        distance += totalCards
      }
      
      // Determine which copy of the card to show based on distance
      let actualDistance = distance
      
      if (Math.floor(index / totalCards) === 0) {
        // First copy (left side)
        actualDistance = distance + totalCards
      } else if (Math.floor(index / totalCards) === 1) {
        // Middle copy (main)
        actualDistance = distance
      } else {
        // Third copy (right side)
        actualDistance = distance - totalCards
      }
      
      // Show only cards within reasonable viewing distance
      const maxVisibleDistance = 3
      if (Math.abs(actualDistance) > maxVisibleDistance) {
        gsap.set(cardElement, { opacity: 0, display: 'none' })
        return
      }
      
      gsap.set(cardElement, { display: 'block' })
      
      if (actualDistance === 0) {
        // Center card - fully visible and in focus with enhanced animation
        gsap.to(cardElement, {
          x: 0,
          scale: isManualChange ? 1.05 : 1,
          opacity: 1,
          zIndex: 10,
          filter: 'blur(0px)',
          duration: animationDuration,
          ease: easing,
          onComplete: isManualChange ? () => {
            gsap.to(cardElement, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            })
          } : undefined
        })
        
        // Add center class for hover effects
        cardElement.classList.add(styles.centerCard)
      } else {
        // Side cards - faded and positioned
        const absDistance = Math.abs(actualDistance)
        const direction = actualDistance < 0 ? -1 : 1
        const xOffset = direction * (200 + (absDistance - 1) * 120)
        const scaleValue = Math.max(0.8 - (absDistance - 1) * 0.15, 0.4)
        const opacityValue = Math.max(0.6 - (absDistance - 1) * 0.2, 0.1)
        const blurValue = Math.min(absDistance * 1.5, 6)
        
        gsap.to(cardElement, {
          x: xOffset,
          scale: scaleValue,
          opacity: opacityValue,
          zIndex: 10 - absDistance,
          filter: `blur(${blurValue}px)`,
          duration: animationDuration,
          ease: easing
        })
        
        // Remove center class from background cards
        cardElement.classList.remove(styles.centerCard)
      }
    })
  }, [currentIndex, totalCards, isManualChange])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <section className={styles.awardsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Excellence in AI Solutions</h2>
          <p className={styles.subtitle}>
            Recognized by industry leaders worldwide
          </p>
          <div className={styles.keyboardHint}>
            <Zap className="w-4 h-4" />
            Use ← → arrows or click buttons to navigate • Space to pause/play
          </div>
        </div>

        <div className={styles.sliderContainer}>
          <div className={styles.flashOverlay} ref={flashOverlayRef}></div>
          
          <div className={styles.cardsContainer} ref={cardsContainerRef}>
            {infiniteTestimonials.map((testimonial, index) => (
              <div 
                key={`${testimonial.id}-${Math.floor(index / totalCards)}`}
                className={styles.card}
                onMouseEnter={stopAutoPlay}
                onMouseLeave={startAutoPlay}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.year}>{testimonial.year}</div>
                    <div className={styles.quoteIcon}>
                      <Quote className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className={styles.award}>{testimonial.award}</div>
                  
                  <div className={styles.rating}>
                    {renderStars(testimonial.rating)}
                  </div>

                  <p className={styles.testimonialText}>
                    "{testimonial.text}"
                  </p>

                  <div className={styles.author}>
                    <div className={styles.avatar}>
                      {testimonial.avatar}
                    </div>
                    <div className={styles.authorInfo}>
                      <h4 className={styles.authorName}>{testimonial.name}</h4>
                      <p className={styles.authorRole}>
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.navigation}>
          <button 
            className={styles.navButton}
            onClick={handleManualPrev}
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
            title="Previous (←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className={styles.playPauseIndicator}>
            {intervalRef.current ? (
              <div className={styles.playingIndicator}>
                <div className={styles.playingDot}></div>
                <div className={styles.playingDot}></div>
                <div className={styles.playingDot}></div>
              </div>
            ) : (
              <div className={styles.pausedIndicator}>⏸</div>
            )}
          </div>

          <button 
            className={styles.navButton}
            onClick={handleManualNext}
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
            title="Next (→)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className={styles.counter}>
          {currentIndex + 1} / {totalCards}
        </div>
      </div>
    </section>
  )
}
