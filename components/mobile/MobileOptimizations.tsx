"use client";

import { useEffect } from "react";

/**
 * Mobile Optimization Component
 * Adds mobile-specific styles, touch handling, and viewport optimizations
 */
export default function MobileOptimizations() {
  useEffect(() => {
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";
      document.head.appendChild(meta);
    }

    // Add theme-color meta for mobile browsers
    if (!document.querySelector('meta[name="theme-color"]')) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#3b7ded"; // Primary color
      document.head.appendChild(meta);
    }

    // Add apple-mobile-web-app-capable
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const meta = document.createElement("meta");
      meta.name = "apple-mobile-web-app-capable";
      meta.content = "yes";
      document.head.appendChild(meta);
    }

    // Add mobile-specific styles
    const style = document.createElement("style");
    style.innerHTML = `
      /* Mobile Touch Improvements */
      * {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        -webkit-touch-callout: none;
      }

      /* Touch-friendly buttons */
      @media (max-width: 768px) {
        .btn, button, a, input, select, textarea {
          min-height: 44px;
          min-width: 44px;
        }

        /* Larger font sizes on mobile */
        body {
          font-size: 16px !important; /* Prevent iOS zoom */
        }

        /* Sticky headers on mobile */
        .mobile-sticky-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Full-width cards on mobile */
        .card {
          border-radius: 12px;
        }

        /* Better spacing on mobile */
        .container-fluid {
          padding-left: 12px !important;
          padding-right: 12px !important;
        }

        /* Responsive tables */
        .table-responsive {
          display: block;
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Modal adjustments */
        .modal-dialog {
          margin: 0.5rem;
        }

        .modal-fullscreen-sm-down {
          width: 100vw;
          max-width: none;
          height: 100vh;
          margin: 0;
        }

        /* Bottom navigation spacing */
        body {
          padding-bottom: 70px;
        }

        /* Hide desktop-only elements */
        .d-mobile-none {
          display: none !important;
        }
      }

      /* Pull-to-refresh prevention */
      body {
        overscroll-behavior-y: contain;
      }

      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }

      /* Better touch scrolling */
      .overflow-auto, .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
      }

      /* Swipe gestures */
      .swipeable {
        touch-action: pan-y;
      }

      /* Loading skeleton animations */
      @keyframes skeleton {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }

      .skeleton {
        animation: skeleton 1.5s ease-in-out infinite;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
      }

      /* iOS safe area */
      @supports (padding: max(0px)) {
        body {
          padding-left: max(0px, env(safe-area-inset-left));
          padding-right: max(0px, env(safe-area-inset-right));
        }
      }

      /* Landscape mode adjustments */
      @media (max-width: 768px) and (orientation: landscape) {
        .mobile-landscape-adjust {
          max-height: 60vh;
          overflow-y: auto;
        }
      }

      /* Better form inputs on mobile */
      @media (max-width: 768px) {
        input, select, textarea {
          font-size: 16px !important; /* Prevent iOS zoom */
          border-radius: 8px;
        }

        /* Floating labels */
        .form-floating > label {
          font-size: 14px;
        }
      }

      /* Accessible focus states */
      button:focus-visible,
      a:focus-visible,
      input:focus-visible {
        outline: 2px solid #3b7ded;
        outline-offset: 2px;
      }

      /* Dark mode media query support */
      @media (prefers-color-scheme: dark) {
        :root {
          color-scheme: light; /* Force light mode for now */
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Add touch event listeners for better UX
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeDistance = touchEndY - touchStartY;
      // You can add custom swipe gestures here
      // For example: swipe down to refresh, swipe left/right for navigation
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return null; // This component only adds side effects
}

