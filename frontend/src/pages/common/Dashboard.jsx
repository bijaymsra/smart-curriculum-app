import React, { useEffect, useRef } from "react";
import './Dashboard.css';
import logo from "../images/logo.png";
import student from "../images/student.png";
import faculty from "../images/faculty.png";
import admin from "../images/admin.png";

export default function Dashboard() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Helper to query inside component only
    const $ = (sel) => root.querySelector(sel);
    const $$ = (sel) => Array.from(root.querySelectorAll(sel));

    // Mobile Menu Toggle
    const mobileMenuToggle = $('.mobile-menu-toggle');
    const navMenu = $('.nav-menu');

    const handleMobileToggle = (e) => {
      if (!navMenu || !mobileMenuToggle) return;
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    };

    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', handleMobileToggle);

    // Close mobile menu when clicking outside
    const handleDocumentClick = (e) => {
      if (!root.contains(e.target)) {
        navMenu?.classList.remove('active');
        mobileMenuToggle?.classList.remove('active');
      }
    };
    document.addEventListener('click', handleDocumentClick);

    // Navbar scroll effect
    const navbar = $('.navbar');
    let lastScroll = 0;
    const handleScrollForNavbar = () => {
      const currentScroll = window.pageYOffset;
      if (navbar) {
        if (currentScroll > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScrollForNavbar);

    // Smooth scrolling for anchor links (scoped)
    $$('a[href^="#"]').forEach(anchor => {
      const onClick = function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = root.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          // Close mobile menu after clicking
          navMenu?.classList.remove('active');
          mobileMenuToggle?.classList.remove('active');
        }
      };
      anchor.addEventListener('click', onClick);
      // store the handler for cleanup on the element
      anchor._reactCleanup = onClick;
    });

    // Active navigation link based on scroll position
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');

    function activateNavLink() {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 150)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
          link.classList.add('active');
        }
      });
    }

    // Debounce helper and attaching debounced activation
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
    const debouncedActivateNav = debounce(activateNavLink, 100);
    window.addEventListener('scroll', debouncedActivateNav);

    // Screenshot Carousel
    const carousel = $('.screenshots-carousel');
    const prevBtn = $('.carousel-btn.prev');
    const nextBtn = $('.carousel-btn.next');
    const dots = $$('.dot');
    let currentSlide = 0;
    const totalSlides = $$('.screenshot-item').length;

    function updateCarousel() {
      if (!carousel) return;
      const slideWidth = carousel.offsetWidth;
      carousel.scrollTo({
        left: slideWidth * currentSlide,
        behavior: 'smooth'
      });

      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % Math.max(1, totalSlides);
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + Math.max(1, totalSlides)) % Math.max(1, totalSlides);
      updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      const handler = () => {
        currentSlide = index;
        updateCarousel();
      };
      dot.addEventListener('click', handler);
      dot._reactCleanup = handler;
    });

    // Auto-play carousel
    let autoplayInterval = setInterval(nextSlide, 5000);

    // Pause autoplay on hover
    const handleMouseEnter = () => clearInterval(autoplayInterval);
    const handleMouseLeave = () => { autoplayInterval = setInterval(nextSlide, 5000); };

    if (carousel) {
      carousel.addEventListener('mouseenter', handleMouseEnter);
      carousel.addEventListener('mouseleave', handleMouseLeave);
    }

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const animatedElements = $$('.feature-card, .method-card, .benefit-item');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Counter animation for hero stats
    function animateCounter(element, target, duration = 2000) {
      let start = 0;
      const increment = target / (duration / 16);
      const isDecimal = target.toString().includes('.');

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          element.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
          clearInterval(timer);
        } else {
          element.textContent = isDecimal ? start.toFixed(1) : Math.floor(start);
        }
      }, 16);
    }

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = $$('.stat-number');
          statNumbers.forEach(stat => {
            const text = stat.textContent;
            let value = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;

            if (text.includes('%')) {
              animateCounter(stat, value, 1500);
              const interval = setInterval(() => {
                if (parseFloat(stat.textContent) >= value) {
                  stat.textContent = value + '%';
                  clearInterval(interval);
                }
              }, 100);
            } else if (text.includes('+')) {
              animateCounter(stat, value, 1500);
              const interval = setInterval(() => {
                if (parseFloat(stat.textContent) >= value) {
                  stat.textContent = value + '+';
                  clearInterval(interval);
                }
              }, 100);
            } else if (text.toLowerCase().includes('k')) {
              animateCounter(stat, value, 1500);
              const interval = setInterval(() => {
                if (parseFloat(stat.textContent) >= value) {
                  stat.textContent = value + 'k';
                  clearInterval(interval);
                }
              }, 100);
            } else {
              animateCounter(stat, value, 1500);
            }
          });
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const heroSection = $('.hero');
    if (heroSection) heroObserver.observe(heroSection);

    // Touch / swipe handling
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        nextSlide();
      }
      if (touchEndX > touchStartX + 50) {
        prevSlide();
      }
    }

    if (carousel) {
      carousel.addEventListener('touchstart', handleTouchStart);
      carousel.addEventListener('touchend', handleTouchEnd);
    }

    // Lazy loading images (scoped)
    let imageObserver = null;
    if ('IntersectionObserver' in window) {
      imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset && img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = $$('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    console.log('SmartAttend Home Page Loaded Successfully!');

    // CLEANUP
    return () => {
      if (mobileMenuToggle) mobileMenuToggle.removeEventListener('click', handleMobileToggle);
      document.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('scroll', handleScrollForNavbar);
      // remove anchored click handlers
      $$('a[href^="#"]').forEach(a => {
        if (a._reactCleanup) a.removeEventListener('click', a._reactCleanup);
        delete a._reactCleanup;
      });
      if (nextBtn) nextBtn.removeEventListener('click', nextSlide);
      if (prevBtn) prevBtn.removeEventListener('click', prevSlide);
      dots.forEach(d => { if (d._reactCleanup) d.removeEventListener('click', d._reactCleanup); delete d._reactCleanup; });
      clearInterval(autoplayInterval);
      if (carousel) {
        carousel.removeEventListener('mouseenter', handleMouseEnter);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchend', handleTouchEnd);
      }
      observer.disconnect();
      heroObserver.disconnect();
      if (imageObserver) imageObserver.disconnect();
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', debouncedActivateNav);
    };
  }, []);

  return (
    <div ref={rootRef}>
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            {/* <img src={logo} alt="Logo" className="logo" /> */}
            <span className="brand-name">Attenza</span>
          </div>
          <ul className="nav-menu">
            <li><a href="#home" className="nav-link active">Home</a></li>
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
            <li><a href="#screenshots" className="nav-link">Screenshots</a></li>
            <li><a href="about" className="nav-link">About</a></li>
            <li><a href="docs" className="nav-link">Docs</a></li>
          </ul>
          <div className="nav-actions">
            <a href="login" className="btn btn-outline">Login</a>
            <a href="signup" className="btn btn-primary">Get Started</a>
          </div>
          <button className="mobile-menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section  */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Smart Curriculum & Personalized System Management</h1>
              <p className="hero-subtitle">Automate attendance with Intelligent-powered built for the future of education.</p>
              <div className="hero-buttons">
                <a href="signup" className="btn btn-primary btn-large">Request Demo</a>
                <a href="#how-it-works" className="btn btn-outline btn-large">Learn More</a>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Institutions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Active Users</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              {/* <img src={logo} alt="Platform Dashboard Preview" /> */}
            </div>
          </div>
        </div>
      </section>

          {/* Features Section */}
    <section id="features" class="features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Powerful Features for Modern Education</h2>
                <p class="section-subtitle">Everything you need to manage attendance and boost student productivity</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src={logo} alt="Face Recognition"/>
                    </div>
                    <h3 class="feature-title">Multi-Modal Attendance</h3>
                    <p class="feature-description">QR codes works best for your institution.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src={logo} alt="Smart Planner"/>
                    </div>
                    <h3 class="feature-title">Personalized Planner</h3>
                    <p class="feature-description">Intellizent-driven recommendations that convert idle time into productive academic and career activities.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src={logo} alt="Real-time"/>
                    </div>
                    <h3 class="feature-title">Real-Time Insights</h3>
                    <p class="feature-description">Live attendance monitoring, instant alerts, and comprehensive analytics for informed decision-making.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src={logo} alt="Automation"/>
                    </div>
                    <h3 class="feature-title">Full Automation</h3>
                    <p class="feature-description">Eliminate manual errors and save time with automated attendance tracking and reporting.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src={logo} alt="Analytics"/>
                    </div>
                    <h3 class="feature-title">Advanced Analytics</h3>
                    <p class="feature-description">Detailed reports, trends, and compliance dashboards for administrators and faculty.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src={logo} alt="Integration"/>
                    </div>
                    <h3 class="feature-title">Seamless Integration</h3>
                    <p class="feature-description">Connect with existing LMS, ERP systems, and student information systems effortlessly.</p>
                </div>
            </div>
        </div>
    </section>

     {/* How It Works Section  */}
    <section id="how-it-works" class="how-it-works">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">How It Works</h2>
                <p class="section-subtitle">Three flexible methods to track attendance accurately</p>
            </div>
           <center> <div class="methods-grid">
              <div class="method-card">
                    <h3 class="method-title">📱 QR Code Scanning</h3>
                    <p class="method-description">Quick and easy attendance marking using dynamically generated QR codes that refresh periodically.</p>
                    <ul class="method-features">
                        <li>Time-limited codes</li>
                        <li>Session verification</li>
                        <li>Fraud prevention</li>
                    </ul>
                </div> 
            </div> </center>
        </div>
    </section>

     {/* Screenshots Section  */}
    <section id="screenshots" class="screenshots">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">See It In Action</h2>
                <p class="section-subtitle">Intuitive interfaces designed for students, faculty, and administrators</p>
            </div>
            <div class="screenshots-carousel">
                <div class="screenshot-item">
                    <img src={student} alt="Student Dashboard"/>
                    <div class="screenshot-caption">
                        <h4>Student Dashboard</h4>
                        <p>Track attendance, manage tasks, and view personalized schedules</p>
                    </div>
                </div>
                <div class="screenshot-item">
                    <img src={faculty} alt="Faculty Interface"/>
                    <div class="screenshot-caption">
                        <h4>Faculty Dashboard</h4>
                        <p>Live attendance tracking and class management tools</p>
                    </div>
                </div>
                <div class="screenshot-item">
                    <img src={admin} alt="Admin Analytics"/>
                    <div class="screenshot-caption">
                        <h4>Admin Dashboard</h4>
                        <p>Comprehensive insights and institutional management</p>
                    </div>
                </div>
            </div>
            <div class="carousel-controls">
                <button class="carousel-btn prev" aria-label="Previous">←</button>
                <div class="carousel-dots">
                    <span class="dot active"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
                <button class="carousel-btn next" aria-label="Next">→</button>
            </div>
        </div>
    </section>

     {/* Benefits Section  */}
    <section class="benefits">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Why Choose us?</h2>
                <p class="section-subtitle">Aligned with NEP 2020 for personalized learning excellence</p>
            </div>
            <div class="benefits-grid">
                <div class="benefit-item">
                    <h3>For Students</h3>
                    <ul>
                        <li>Never miss attendance updates</li>
                        <li>Optimize your free time productively</li>
                        <li>Receive personalized learning recommendations</li>
                        <li>Track academic progress effortlessly</li>
                    </ul>
                </div>
                <div class="benefit-item">
                    <h3>For Faculty</h3>
                    <ul>
                        <li>Save hours on attendance management</li>
                        <li>Access real-time class insights</li>
                        <li>Identify at-risk students early</li>
                        <li>Generate reports instantly</li>
                    </ul>
                </div>
                <div class="benefit-item">
                    <h3>For Institutions</h3>
                    <ul>
                        <li>Ensure compliance with attendance policies</li>
                        <li>Reduce administrative overhead</li>
                        <li>Make data-driven decisions</li>
                        <li>Integrate with existing systems</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

     {/* CTA Section  */}
    <section class="dascta">
        <div class="container">
            <div class="dascta-content">
                <h2 class="dascta-title">Ready to Transform Your Institution?</h2>
                <p class="dascta-subtitle">Join leading educational institutions to enhance learning outcomes</p>
                <div class="dascta-buttons">
                    <a href="signup" class="btn btn-primary btn-large">Request a Demo</a>
                    <a href="about" class="btn btn-outline-light btn-large">Contact Sales</a>
                </div>
            </div>
        </div>
    </section>


      {/* Footer (include full markup as you had it) */}
      <footer className="dasfooter">
        <div className="container">
          <div className="dasfooter-grid">
            <div className="dasfooter-column">
              <div className="dasfooter-brand">
                <span className="brand-name">Attenza</span>
              </div>
              <p className="dasfooter-description">Revolutionizing education through intelligent attendance tracking and personalized learning.</p>
              <div className="social-links">
                <a href="#" aria-label="Twitter">Twitter</a>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
                <a href="#" aria-label="Facebook">Facebook</a>
              </div>
            </div>
            <div className="dasfooter-column">
              <h4 className="dasfooter-heading">Product</h4>
              <ul className="dasfooter-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="pricing.html">Pricing</a></li>
                <li><a href="docs">Documentation</a></li>
              </ul>
            </div>
            <div className="dasfooter-column">
              <h4 className="dasfooter-heading">Company</h4>
              <ul className="dasfooter-links">
                <li><a href="about">About Us</a></li>
                <li><a href="blog">Blog</a></li>
                <li><a href="careers">Careers</a></li>
                <li><a href="contact">Contact</a></li>
              </ul>
            </div>
            <div className="dasfooter-column">
              <h4 className="dasfooter-heading">Legal</h4>
              <ul className="dasfooter-links">
                <li><a href="privacy.html">Privacy Policy</a></li>
                <li><a href="terms.html">Terms of Service</a></li>
                <li><a href="security.html">Security</a></li>
                <li><a href="compliance.html">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="dasfooter-bottom">
            <p>&copy; {new Date().getFullYear()} Attenza - Smart Curriculum & Personalized System Management. All rights reserved.</p>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Developed by Bijay Kumar Mishra</p>
          </div>
        </div>
      </footer>
    </div>
  );
}