'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CreditCard, Zap, Package, Calendar } from 'lucide-react';
import styles from './AICapabilities.module.css';

const AICapabilities = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const features = [
    {
      id: 'billing',
      title: 'Smart Billing',
      shortTitle: 'BILLING',
      description: 'Automated billing processes with AI-powered accuracy and real-time processing capabilities',
      icon: CreditCard,
      color: '#FBCDCD'
    },
    {
      id: 'charging',
      title: 'Dynamic Charging',
      shortTitle: 'CHARGING',
      description: 'Intelligent charging systems that adapt to usage patterns and optimize rates automatically',
      icon: Zap,
      color: '#FEE09F'
    },
    {
      id: 'catalog',
      title: 'Product Catalog',
      shortTitle: 'CATALOG',
      description: 'AI-curated product catalogs with smart recommendations and intelligent inventory management',
      icon: Package,
      color: '#E3FFD1'
    },
    {
      id: 'events',
      title: 'Event Processing',
      shortTitle: 'EVENTS',
      description: 'Real-time event processing and analytics for immediate insights and intelligent actions',
      icon: Calendar,
      color: '#9BF7FF'
    }
  ];

  const nextFeature = useCallback(() => {
    setIsTransitioning(true);
    progressRef.current = 0;
    setProgress(0);
    
    setTimeout(() => {
      setActiveFeature(current => {
        const next = (current + 1) % features.length;
        return next;
      });
      setIsTransitioning(false);
    }, 150);
  }, [features.length]);

  const startAutoProgress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        progressRef.current += 1.2;
        setProgress(progressRef.current);
        
        if (progressRef.current >= 100) {
          nextFeature();
        }
      }
    }, 60);
  }, [nextFeature, isPaused]);

  useEffect(() => {
    startAutoProgress();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAutoProgress]);

  const handleFeatureClick = (index: number) => {
    if (index !== activeFeature && !isTransitioning) {
      setIsPaused(true);
      setIsTransitioning(true);
      progressRef.current = 0;
      setProgress(0);
      
      setTimeout(() => {
        setActiveFeature(index);
        setIsTransitioning(false);
        setIsPaused(false);
      }, 150);
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section className={styles.capabilities}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <p className={styles.subtitle}>
              [ Efficiency, Scalability, and Intelligence ]
            </p>
            <h2 className={styles.title}>
              <span className={styles.titleLight}>Unparalleled</span>
              <span className={styles.titleDark}>BSS/OSS Capabilities</span>
            </h2>
          </div>

          {/* Navigation Cards with Auto-cycle */}
          <div 
            className={styles.navigation}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {features.map((feature, index) => (
              <button
                key={feature.id}
                className={`${styles.navItem} ${activeFeature === index ? styles.active : ''}`}
                onClick={() => handleFeatureClick(index)}
              >
                <div className={styles.navContent}>
                  <feature.icon className={styles.navIcon} />
                  <span className={styles.navLabel}>{feature.shortTitle}</span>
                </div>
                {activeFeature === index && (
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Feature Display with smooth transitions */}
          <div className={styles.featureDisplay}>
            <div className={`${styles.featureContent} ${isTransitioning ? styles.transitioning : ''}`}>
              <div className={styles.featureInfo}>
                <h3 className={styles.featureTitle}>
                  {features[activeFeature].title}
                </h3>
                <p className={styles.featureDescription}>
                  {features[activeFeature].description}
                </p>
              </div>
              
              {/* Feature visualization with smooth color transition */}
              <div className={styles.featureVisual}>
                <div 
                  className={styles.visualPlaceholder}
                  style={{ backgroundColor: features[activeFeature].color }}
                >
                  {(() => {
                    const IconComponent = features[activeFeature].icon;
                    return <IconComponent className={styles.visualIcon} />;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICapabilities; 