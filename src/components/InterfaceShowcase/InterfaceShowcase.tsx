'use client';

import { useEffect, useRef } from 'react';
import { Upload, Users, BarChart3, Settings, CreditCard } from 'lucide-react';
import styles from './InterfaceShowcase.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const InterfaceShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const showcaseCards = [
    {
      id: 'self-service',
      number: '01',
      title: 'Powerful Self-Service Tools',
      description: 'Customer self-management for reduced support costs and increased satisfaction.',
      features: ['Drag & Drop File Upload', 'Real-time Processing', 'Automated Workflows'],
      mockup: {
        title: 'Customers',
        subtitle: 'ADD SUBSCRIBERS',
        content: 'DRAG & DROP YOUR FILE',
        icon: Upload
      },
      color: '#E3FFD1'
    },
    {
      id: 'management',
      number: '02',
      title: 'Advanced User Management',
      description: 'Comprehensive user controls with role-based access and intelligent automation.',
      features: ['Role-based Access', 'Bulk Operations', 'Smart Notifications'],
      mockup: {
        title: 'User Management',
        subtitle: 'MANAGE PERMISSIONS',
        content: 'CONFIGURE USER ROLES',
        icon: Users
      },
      color: '#9BF7FF'
    },
    {
      id: 'analytics',
      number: '03',
      title: 'Real-time Analytics Dashboard',
      description: 'Comprehensive insights with interactive charts and customizable reporting.',
      features: ['Live Data Streams', 'Custom Reports', 'Predictive Analytics'],
      mockup: {
        title: 'Analytics',
        subtitle: 'VIEW INSIGHTS',
        content: 'REAL-TIME METRICS',
        icon: BarChart3
      },
      color: '#FBCDCD'
    },
    {
      id: 'configuration',
      number: '04',
      title: 'Intelligent Configuration',
      description: 'Smart system settings with automated optimization and seamless integration.',
      features: ['Auto-optimization', 'API Integration', 'Custom Workflows'],
      mockup: {
        title: 'Configuration',
        subtitle: 'SYSTEM SETTINGS',
        content: 'OPTIMIZE PERFORMANCE',
        icon: Settings
      },
      color: '#FEE09F'
    },
    {
      id: 'billing',
      number: '05',
      title: 'Smart Billing Engine',
      description: 'Automated billing with flexible pricing models and intelligent revenue optimization.',
      features: ['Dynamic Pricing', 'Automated Invoicing', 'Revenue Analytics'],
      mockup: {
        title: 'Billing',
        subtitle: 'PROCESS PAYMENTS',
        content: 'AUTOMATED BILLING',
        icon: CreditCard
      },
      color: '#E2C9FB'
    }
  ];

  useEffect(() => {
    const cards = cardsRef.current;
    const cardsContainerElement = cardsContainerRef.current;

    if (!cardsContainerElement || cards.length === 0) return;

    let activeCardIndex = 0;

    gsap.set(cards, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 0.85,
      y: 0,
    });

    if (cards[0]) {
      gsap.set(cards[0], { opacity: 1, scale: 1, y: 0, zIndex: cards.length });
    }

    const holdPerCardVH = 1.5;
    const transitionAnimDuration = 0.7;

    function animateTransition(newIndex: number) {
      const currentCard = cards[newIndex];
      if (newIndex === activeCardIndex && currentCard &&
        gsap.getProperty(currentCard, "opacity") == 1 &&
        gsap.getProperty(currentCard, "scale") == 1 &&
        gsap.getProperty(currentCard, "y") == 0) {
        return;
      }

      const oldActiveIndex = activeCardIndex;
      activeCardIndex = newIndex;

      cards.forEach((card, i) => {
        if (i === newIndex) {
          gsap.fromTo(card,
            { opacity: 0, scale: 0.9, y: 30, zIndex: cards.length -1 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: transitionAnimDuration,
              ease: "expo.inOut",
              onStart: () => { gsap.set(card, { zIndex: cards.length }); }
            }
          );
        } else if (i === oldActiveIndex) {
          gsap.to(card, {
            opacity: 0.4,
            scale: 0.85,
            y: -30,
            duration: transitionAnimDuration,
            ease: "expo.inOut",
            onStart: () => { gsap.set(card, { zIndex: cards.length - 1 }); }
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.80,
            y: 0,
            duration: transitionAnimDuration * 0.6,
            ease: "expo.inOut"
          });
        }
      });
    }

    const pinAndCardScrollTrigger = ScrollTrigger.create({
      trigger: cardsContainerElement,
      pin: cardsContainerElement,
      start: 'top top',
      end: () => `+=${(cards.length * holdPerCardVH * window.innerHeight)}`,
      anticipatePin: 1,
      onUpdate: (self) => {
        let targetIndex = Math.floor(self.progress * cards.length);
        targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));

        if (targetIndex !== activeCardIndex) {
          animateTransition(targetIndex);
        }
      },
    });

    return () => {
      pinAndCardScrollTrigger.kill();
      gsap.killTweensOf(cardsRef.current);
    };
  }, [showcaseCards.length]);

  return (
    <section ref={sectionRef} className={styles.showcase}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titlePrimary}>Intuitive Interface and</span>
            <span className={styles.titleSecondary}>Effortless Self-Management</span>
          </h2>
          {/* <p className={styles.subtitle}>\n            Effortel Mobile Suite is designed and engineered to streamline operations, \n            accelerate revenue growth, and deliver exceptional customer experiences.\n          </p> */}
        </div>
        <div ref={cardsContainerRef} className={styles.cardsContainer}>
          {showcaseCards.map((cardData, index) => (
            <div
              key={cardData.id}
              ref={el => {
                if (el) cardsRef.current[index] = el;
              }}
              className={`${styles.card}`}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardNumber}>{cardData.number}</div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{cardData.title}</h3>
                </div>
              </div>
              <div className={styles.mockupContainer}>
                <div className={styles.mockup} style={{backgroundColor: cardData.color, borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
                  <cardData.mockup.icon style={{width: '50px', height: '50px', marginBottom: '10px'}} />
                  <h4>{cardData.mockup.title}</h4>
                  <p>{cardData.mockup.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InterfaceShowcase; 