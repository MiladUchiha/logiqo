'use client';

import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Badge */}
          <div className={styles.badge}>
            <Zap className={styles.badgeIcon} />
            <span>AI-Powered Project Management</span>
          </div>

          {/* Main Heading */}
          <h1 className={styles.heading}>
            Build better projects with
            <span className={styles.highlight}> intelligent workflows</span>
          </h1>

          {/* Subheading */}
          <p className={styles.subheading}>
            FlowBuild combines powerful project management with AI assistance to help teams 
            deliver exceptional results faster than ever before.
          </p>

          {/* CTA Buttons */}
          <div className={styles.actions}>
            <button className={styles.primaryButton}>
              <span>Start Building</span>
              <ArrowRight className={styles.buttonIcon} />
            </button>
            
            <button className={styles.secondaryButton}>
              <Sparkles className={styles.buttonIcon} />
              <span>See AI in Action</span>
            </button>
          </div>

          {/* Subtle feature highlights */}
          <div className={styles.features}>
            <div className={styles.feature}>Smart task automation</div>
            <div className={styles.feature}>Intelligent insights</div>
            <div className={styles.feature}>Seamless collaboration</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 