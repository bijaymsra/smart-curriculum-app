// About.js
import React from "react";
import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.aboutPage}>
      {/* Navigation */}
      <nav className={styles.abtnavbar}>
        <div className={styles.navAbtcontainer}>
          <a href="#" className={styles.abtlogo}>
            Attenza
          </a>
          <ul className={styles.navLinks}>
            <li>
              <a href="/" className={styles.backBtn}>
                ← Back to Home
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.abthero}>
        <h1>Smart Curriculum & Personalized System Management</h1>
        <p>
          Revolutionizing education through intelligent attendance tracking and
          personalized learning experiences
        </p>
      </section>

      {/* About Content */}
      <section className={styles.abtcontainer}>
        <div className={styles.aboutContent}>
          <h3>Transforming Educational Management</h3>
          <p>
            The Smart Attendance and Personalized Student Planner is a unified
            web-based platform that combines cutting-edge technology with
            educational excellence. Our system automates attendance tracking
            while enhancing student productivity through intelligent scheduling
            and personalized learning recommendations.
          </p>
          <p>
            By leveraging advanced QR code scanning, we eliminate manual errors
            and reduce administrative burden. Simultaneously, our intelligent
            planner uses predictive analytics to transform students' idle time
            into goal-oriented academic and career activities, perfectly aligned
            with the NEP 2020 vision of personalized, technology-enabled
            learning.
          </p>

          <div className={styles.visionMission}>
            <div className={styles.visionCard}>
              <h4>Our Vision</h4>
              <p>
                To create an educational ecosystem where technology seamlessly
                enhances learning outcomes, administrative efficiency, and
                student success through intelligent automation and
                personalization.
              </p>
            </div>
            <div className={styles.visionCard}>
              <h4>Our Mission</h4>
              <p>
                Empower educational institutions with smart tools that minimize
                administrative overhead while maximizing student engagement,
                attendance accuracy, and personalized learning opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className={styles.abthowItWorks}>
        <div className={styles.abtcontainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSubtitle}>
              Three flexible methods to track attendance accurately
            </p>
          </div>

          <div className={styles.methodsGrid}>
            <div className={styles.methodCard}>
              <div className={styles.methodIcon}>
                <span>📱</span>
              </div>
              <h3 className={styles.methodTitle}>QR Code Scanning</h3>
              <p className={styles.methodDescription}>
                Quick and easy attendance marking using dynamically generated QR
                codes that refresh periodically.
              </p>
              <ul className={styles.methodFeatures}>
                <li>Time-limited codes</li>
                <li>Session verification</li>
                <li>Fraud prevention</li>
                <li>Instant validation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.abtbenefits}>
        <div className={styles.abtcontainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Our Platform?</h2>
            <p className={styles.sectionSubtitle}>
              Comprehensive benefits for students, faculty, and institutions
            </p>
          </div>

          <div className={styles.abtbenefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>⚡</div>
              <h4>Time Efficient</h4>
              <p>Reduce attendance marking time from minutes to seconds</p>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎯</div>
              <h4>Accurate Tracking</h4>
              <p>Eliminate errors and proxy attendance with automated verification</p>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>📊</div>
              <h4>Real-time Analytics</h4>
              <p>Instant insights into attendance patterns and student engagement</p>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🔒</div>
              <h4>Secure & Private</h4>
              <p>Enterprise-grade security with GDPR compliance</p>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎓</div>
              <h4>NEP 2020 Aligned</h4>
              <p>Supports personalized learning and skill development goals</p>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🔄</div>
              <h4>Easy Integration</h4>
              <p>Seamlessly connects with existing LMS and ERP systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to Transform Your Institution?</h2>
        <p>
          Join hundreds of educational institutions already using our platform
        </p>
        <a href="signup" className={styles.ctaButton}>
          Request a Demo
        </a>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} Attenza - Smart Curriculum & Personalized System Management. All rights reserved.
        </p>
        <p>
          <a
            href="/"
            style={{ color: "white", textDecoration: "underline" }}
          >
            Back to Home
          </a>
        </p>
      </footer>
    </div>
  );
}
