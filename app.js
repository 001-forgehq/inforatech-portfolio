/**
 * InforaTech Systems Portfolio - Application JavaScript
 * Handles: mobile menu, tabs, form validation, scroll animations
 */

(function () {
  'use strict';

  // ==========================================================================
  // DOM Cache
  // ==========================================================================
  const elements = {
    navToggle: document.querySelector('.mobile-menu-toggle'),
    navMenu: document.querySelector('.nav-menu'),
    contactForm: document.getElementById('contact-form'),
    tabs: document.querySelectorAll('.tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    characterCount: document.querySelector('.form-character-count')
  };

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  /**
   * Detect if we're in reduced motion preference mode
   */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Debounce function for resize handlers
   */
  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Format character count with comma separators
   */
  function formatCount(value) {
    if (!value && value !== 0) return '[PLACEHOLDER: 0]';
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // ==========================================================================
  // Mobile Menu Toggle
  // ==========================================================================
  function initMobileMenu() {
    if (!elements.navToggle) return;

    elements.navToggle.addEventListener('click', () => {
      const isExpanded = elements.navToggle.getAttribute('aria-expanded') === 'true';

      elements.navToggle.setAttribute('aria-expanded', !isExpanded);

      // Toggle menu visibility with slide animation
      if (isExpanded) {
        elements.navMenu.style.animation = 'none';
        elements.navMenu.offsetHeight; /* trigger reflow */
        elements.navMenu.style.animation = 'slideUp 0.3s var(--ease-out)';
        setTimeout(() => {
          if (elements.navToggle.getAttribute('aria-expanded') === 'false') {
            elements.navMenu.classList.remove('is-open');
          }
        }, 280);
      } else {
        elements.navMenu.classList.add('is-open');
        elements.navMenu.style.animation = 'slideDown 0.3s var(--ease-out)';
      }

      // Prevent body scroll when menu is open on mobile
      document.body.style.overflowHidden = !isExpanded;
    });

    // Close menu when clicking a nav link (mobile only)
    const desktopLinks = Array.from(elements.navMenu.querySelectorAll('a.desktop-only'));
    if (desktopLinks.length > 0) {
      elements.navMenu.addEventListener('click', (e) => {
        if (!prefersReducedMotion && e.target.closest('.desktop-only')) {
          elements.navToggle.setAttribute('aria-expanded', 'false');
          elements.navMenu.style.animation = 'slideUp 0.3s var(--ease-out)';
          setTimeout(() => elements.navMenu.classList.remove('is-open'), 280);
          document.body.style.overflowHidden = '';
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !prefersReducedMotion) {
        const menuOpen = elements.navToggle.getAttribute('aria-expanded') === 'true';
        if (menuOpen) {
          elements.navToggle.setAttribute('aria-expanded', 'false');
          elements.navMenu.style.animation = 'slideUp 0.3s var(--ease-out)';
          setTimeout(() => elements.navMenu.classList.remove('is-open'), 280);
          document.body.style.overflowHidden = '';
        }
      }
    });
  }

  /**
   * Keyframe definitions for mobile menu animation
   */
  const styleSheet = new CSSStyleSheet();
  try {
    styleSheet.insertRule('@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }', 0);
    styleSheet.insertRule('@keyframes slideUp { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }', 1);
    styleSheet.insertRule('@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }', 2);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
  } catch (e) {
    console.error('Error inserting animation rules', e);
  }

  // ==========================================================================
  // Tab Navigation (Business MS modules)
  // ==========================================================================
  function initTabs() {
    elements.tabs.forEach((tabBtn, index) => {
      tabBtn.addEventListener('click', () => {
        const panelId = tabBtn.getAttribute('aria-controls');
        const targetPanel = document.getElementById(panelId);

        if (!targetPanel || prefersReducedMotion) return;

        // Close all tabs first
        elements.tabs.forEach((btn) => {
          btn.setAttribute('aria-selected', 'false');
        });

        elements.tabPanels.forEach((panel) => {
          panel.classList.remove('active');
        });

        // Activate clicked tab
        tabBtn.setAttribute('aria-selected', 'true');
        targetPanel.classList.add('active');

        // Subtle expand animation for the panel
        targetPanel.style.animation = 'none';
        targetPanel.offsetHeight; /* trigger reflow */
        targetPanel.style.animation = 'fadeIn 0.3s var(--ease-out)';
      });
    });
  }

  // ==========================================================================
  // Contact Form Validation
  // ==========================================================================
  function initFormValidation() {
    if (!elements.contactForm) return;

    const validationRules = {
      name: {
        minLength: 2,
        maxLength: 100,
        message: 'Please enter at least 2 characters.'
      },
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Enter a valid email address (e.g., name@example.com).'
      },
      phone: {
        pattern: /^[\d\s\+\-\(\)]{10,20}$/,
        message: 'Please enter a phone number with optional spaces, + or ().'
      },
      company: {
        minLength: 2,
        maxLength: 200,
        message: 'Company name is required.'
      },
      interest: {
        required: true,
        message: 'Please select an interest area.'
      }
    };

    const inputs = Array.from(elements.contactForm.querySelectorAll('input, textarea'));
    let hasErrors = false;

    /**
     * Validate a single field
     */
    function validateField(input, rules) {
      if (!rules || !rules.required && !elements.contactForm.checkValidity()) return null;

      const value = input.value.trim();
      let valid = true;
      let errorMessage = '';

      // Required check
      if (rules.required && !value) {
        valid = false;
        errorMessage = rules.message || 'This field is required.';
      } else if (!rules.pattern && rules.minLength) {
        if (value.length < rules.minLength) {
          valid = false;
          errorMessage = rules.message || `Minimum ${rules.minLength} characters required.`;
        }
      } else if (!rules.pattern && rules.maxLength) {
        if (value.length > rules.maxLength) {
          valid = false;
          errorMessage = rules.message || `Maximum ${rules.maxLength} characters allowed.`;
        }
      } else if (rules.pattern) {
        if (!rules.pattern.test(value)) {
          valid = false;
          errorMessage = rules.message;
        }
      }

      // Toggle validity classes
      input.classList.toggle('invalid', !valid);
      return valid ? null : errorMessage;
    }

    /**
     * Reset all error states
     */
    function resetErrors() {
      inputs.forEach(input => input.classList.remove('invalid'));
      hasErrors = false;
      const messageEl = elements.contactForm.querySelector('.message-error');
      if (messageEl) {
        messageEl.hidden = true;
      }
    }

    /**
     * Show all errors for a form submission
     */
    function showAllErrors() {
      let hasError = false;

      inputs.forEach(input => {
        const ruleKey = input.id.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (ruleKey === 'character-count') return; // Skip character count display

        if (input.id) {
          const rules = validationRules[input.id];
          if (!rules) return;

          const error = validateField(input, rules);
          if (error) {
            hasError = true;
            input.classList.add('invalid');
          } else {
            input.classList.remove('invalid');
          }
        }
      });

      return hasError;
    }

    /**
     * Handle form submission
     */
    elements.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      resetErrors();

      // Validate all fields
      const hasErrors = showAllErrors();
      if (hasErrors) return;

      // Get message length and update display
      const messageInput = elements.contactForm.querySelector('#message');
      if (messageInput && elements.characterCount) {
        elements.characterCount.textContent = formatCount(messageInput.value.length);
      }

      // Simulate form submission - in production, this would send to backend
      // For demo, show success message and reset form
      const messageEl = elements.contactForm.querySelector('.message-success');
      if (messageEl && !messageEl.hidden) {
        return; // Already showing success
      }

      // Hide any existing errors
      document.querySelectorAll('.message-error').forEach(el => el.hidden = true);

      // Show success message
      const formMessage = elements.contactForm.querySelector('.form-message');
      if (formMessage && !messageEl) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-success';
        messageDiv.textContent = 'Message received! We\'ll get back to you within [PLACEHOLDER: 24-48 hours] or the timeframe specified in your case.';
        formMessage.replaceWith(messageDiv);
      }

      // Reset form after a delay
      setTimeout(() => {
        elements.contactForm.reset();
        if (messageInput) {
          elements.characterCount.textContent = formatCount(0);
        }
        // Clear success message
        const existingSuccess = elements.contactForm.querySelector('.message-success');
        if (existingSuccess && existingSuccess.parentElement === formMessage) {
          existingSuccess.hidden = true;
        }
      }, 5000);
    });

    /**
     * Real-time validation on input
     */
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const ruleKey = input.id.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (ruleKey === 'character-count') return;

        resetErrors(); // Remove any existing error state on typing
        const rules = validationRules[input.id];
        if (rules && !rules.required) {
          validateField(input, rules);
        }
      });

      input.addEventListener('blur', () => {
        const rules = validationRules[input.id];
        if (rules && !rules.required) {
          validateField(input, rules);
        }
      });
    });
  }

  /**
   * Character counter for message textarea
   */
  function initCharacterCounter() {
    const messageInput = document.getElementById('message');
    const counterDisplay = elements.characterCount;

    if (!messageInput || !counterDisplay) return;

    // Hide counter on mobile (takes up space)
    if (window.innerWidth < 769) {
      counterDisplay.style.display = 'none';
    } else {
      counterDisplay.style.display = '';
    }

    // Listen for window resize
    const handleResize = debounce(() => {
      if (window.innerWidth < 769) {
        counterDisplay.style.display = 'none';
      } else {
        counterDisplay.style.display = '';
      }
    }, 100);

    window.addEventListener('resize', handleResize);

    // Update on input
    messageInput.addEventListener('input', () => {
      counterDisplay.textContent = formatCount(messageInput.value.length);
    });
  }

  // ==========================================================================
  // Scroll Reveal Animations (optional)
  // ==========================================================================
  function initScrollAnimations() {
    if (prefersReducedMotion) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Target sections for animation
    const animatedElements = document.querySelectorAll('section, .project-block');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)';
      observer.observe(el);
    });
  }

  // ==========================================================================
  // Lazy Loading (if needed - HTML above doesn't use lazy images, but pattern here)
  // ==========================================================================
  function initLazyLoading() {
    // This would handle image lazy loading if we had external images
    // For now, all content is inline or SVG-based
  }

  // ==========================================================================
  // ARIA Live Region for Form Messages (screen reader announcements)
  // ==========================================================================
  function initAccessibility() {
    const formMessage = elements.contactForm.querySelector('.form-message');
    if (!formMessage) return;

    // Announce validation errors to screen readers
    const errorMessages = formMessage.querySelectorAll('.message-error');
    errorMessages.forEach(el => {
      el.addEventListener('hidden', () => {
        const region = document.querySelector('[aria-live="polite"]');
        if (region && region.textContent === el.textContent) {
          // Clear the region content so it can announce new messages
          region.textContent = '';
        }
      });
    });
  }

  // ==========================================================================
  // Initialize All Modules
  // ==========================================================================
  function init() {
    initMobileMenu();
    initTabs();
    initFormValidation();
    initCharacterCounter();
    initScrollAnimations();
    initAccessibility();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready
    init();
  }

})();
