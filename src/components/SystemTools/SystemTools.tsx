'use client';

import { useState } from 'react';
import { Zap, BarChart3, Settings, Users, Shield, Smartphone } from 'lucide-react';
import styles from './SystemTools.module.css';

const SystemTools = () => {
  // const [hoveredTool, setHoveredTool] = useState<number | null>(null); // Not used in bento

  const toolsData = [ // Keep data if needed for content, or embed directly
    {
      id: 'launch',
      title: 'Rapid Time-to-Market',
      description: 'Fast MVNO launch with pre-configured modules and expert guidance.',
      icon: Zap, // Icon can still be used
      // Mockup data can be used inside the bento item
    },
    {
      id: 'methodology',
      title: 'Proven Methodology',
      description: 'Step-by-step LaunchPad program for planning, implementation, marketing, and acquisition.',
      icon: BarChart3,
    },
    {
      id: 'scalability',
      title: 'Scalability and Performance',
      description: 'Platform scales to meet growing demands, ensuring peak performance.',
      icon: Settings,
    },
    {
      id: 'costs',
      title: 'Reduced Operational Costs',
      description: 'Streamlined automation and interface for optimized resources.',
      icon: Users, 
    },
    {
      id: 'support',
      title: 'Expert Support',
      description: '24/7 support for smooth and efficient operations.',
      icon: Shield,
    },
    {
      id: 'flexibility',
      title: 'Unmatched Flexibility',
      description: 'Configurable workflows, rules, and integrations for unique business needs.',
      icon: Smartphone,
    }
  ];

  // Grid layout based on screenshot (6 columns, 7 rows)
  const gridPlacements = [
    { gridColumn: '1 / 3', gridRow: '1 / 3' }, // launch (2 wide, 2 rows tall)
    { gridColumn: '3 / 7', gridRow: '1 / 3' }, // methodology (4 wide, 2 rows tall)
    { gridColumn: '1 / 4', gridRow: '3 / 6' }, // scalability (3 wide, 3 rows tall)
    { gridColumn: '4 / 7', gridRow: '3 / 5' }, // costs (3 wide, 2 rows tall)
    { gridColumn: '1 / 4', gridRow: '6 / 8' }, // support (3 wide, 2 rows tall)
    { gridColumn: '4 / 7', gridRow: '5 / 8' }, // flexibility (3 wide, 3 rows tall)
  ];

  return (
    <section className={styles.cards__wrapper}> {/* Changed from systemTools to cards__wrapper */}
      <div className={styles.header}>
        <p className={styles.subtitle}>
          [ From Vision to Reality ]
        </p>
        <h2 className={styles.title}>
          <span className={styles.titleLight}>Launching Your</span>
          <span className={styles.titleDark}>MVNO</span>
        </h2>
        <p className={styles.description}>
          Effortel's MVNO LaunchPad and Mobile Suite provide the foundation 
          you need to not only launch your MVNO with unprecedented speed, 
          but also thrive in the competitive telecommunications landscape.
        </p>
      </div>

      <div className={`${styles.cards__holder} ${styles.cards__holder_isBento}`}>
        <div className={styles.cards__inner}>
          {toolsData.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <div 
                key={tool.id} 
                className={styles.bentoItem}
                style={gridPlacements[index]} // Apply grid placement
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <IconComponent size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <h3>{tool.title}</h3>
                </div>
                <p>{tool.description}</p>

                {/* Simplified Mockups - to be styled further or made more complex if needed */}
                <div className={styles.bentoMockup}>
                  {tool.id === 'launch' && (
                    <div className={styles.launchInterface}>LAUNCH MOCKUP</div>
                  )}
                  {tool.id === 'methodology' && (
                    <div className={styles.methodologyDashboard}>METHODOLOGY MOCKUP</div>
                  )}
                  {tool.id === 'scalability' && (
                    <div className={styles.performanceMetrics}>SCALABILITY MOCKUP</div>
                  )}
                  {tool.id === 'costs' && (
                    <div className={styles.costAnalysis}>COSTS MOCKUP</div>
                  )}
                  {tool.id === 'support' && (
                    <div className={styles.supportChat}>SUPPORT MOCKUP</div>
                  )}
                  {tool.id === 'flexibility' && (
                    <div className={styles.workflowBuilder}>FLEXIBILITY MOCKUP</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SystemTools; 