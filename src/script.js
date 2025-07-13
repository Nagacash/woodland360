console.log("Top of script.js reached!");
import './style.css';

console.log("Script loaded!");

let player; // Declare player variable globally or accessible

function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '315',
    width: '560',
    videoId: 'Ze261xg32N0', // Your video ID
    playerVars: {
      'playsinline': 1,
      'autoplay': 0, // We will control autoplay programmatically
      'rel': 0, // Do not show related videos
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // You can add logic here if needed when the player is ready
}

function onPlayerStateChange(event) {
  // You can add logic here for player state changes (e.g., playing, paused)
}

// Load the YouTube IFrame Player API asynchronously
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const pageContainer = document.querySelector(".page-container");
  const horizontalContainer = document.querySelector(".horizontal-container");
  const panelsContainer = document.querySelector(".panels-container");
  const panels = document.querySelectorAll(".panel");
  const progressFill = document.querySelector(".nav-progress-fill");
  const navText = document.querySelectorAll(".nav-text")[1];
  const parallaxElements = document.querySelectorAll(".parallax");
  const leftMenu = document.querySelector(".left-menu");
  const menuBtn = document.querySelector(".menu-btn");
  const sectionNavItems = document.querySelectorAll(".section-nav-item");
  const videoBackground = document.querySelector(".video-background");
  const copyEmailBtn = document.querySelector(".copy-email");
  const copyTooltip = document.querySelector(".copy-tooltip");
  const instagramButton = document.querySelector('.instagram-button');
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');
  const backgroundMusic = document.getElementById('background-music');
  const musicToggleBtn = document.getElementById('music-toggle');
  const episodePlayer = document.getElementById('episode-player');
  const episodeButtons = document.querySelectorAll('.episode-button');
  const episodeModal = document.getElementById('episode-modal');
  const modalEpisodePlayer = document.getElementById('modal-episode-player');
  const modalEpisodeTitle = document.getElementById('modal-episode-title');
  const closeButton = document.querySelector('.close-button');
  const shareButtons = document.querySelectorAll('.share-button');

  const modalEpisodeDescription = document.getElementById('modal-episode-description');
  // Move modalEpisodeDescription declaration inside DOMContentLoaded
  // to ensure it's available when accessed.
  

  // Ensure modal is hidden on load
  episodeModal.classList.add('modal-hidden');
  

  

  

  // Constants
  const SMOOTH_FACTOR = 0.065;
  const WHEEL_SENSITIVITY = 1.0;
  const PANEL_COUNT = panels.length;
  const MENU_WIDTH = 250;
  const MENU_COLLAPSED_WIDTH = 60;
  const PARALLAX_INTENSITY = 0.5; // Controls strength of parallax effect

  // State variables
  let targetX = 0;
  let currentX = 0;
  let currentProgress = 0;
  let targetProgress = 0;
  let panelWidth = window.innerWidth;
  let maxScroll = (PANEL_COUNT - 1) * panelWidth;
  let isAnimating = false;
  let currentPanel = 0;
  let lastPanel = -1;
  let menuExpanded = false;

  // Touch variables
  let isDragging = false;
  let startX = 0;
  let startScrollX = 0;
  let velocityX = 0;
  let lastTouchX = 0;
  let lastTouchTime = 0;

  // Helper functions
  const lerp = (start, end, factor) => start + (end - start) * factor;
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  // Cookie banner
  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      cookieBanner.style.display = 'none';
      if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    });
  }

  if (declineCookiesBtn) {
    declineCookiesBtn.addEventListener('click', () => {
      cookieBanner.style.display = 'none';
    });
  }

  // Music toggle
  if (musicToggleBtn && backgroundMusic) {
    musicToggleBtn.addEventListener('click', () => {
      if (backgroundMusic.paused) {
        backgroundMusic.play().then(() => {
          musicToggleBtn.classList.add('playing');
        }).catch(error => {
          console.error("Audio playback failed:", error);
        });
      } else {
        backgroundMusic.pause();
        musicToggleBtn.classList.remove('playing');
      }
    });

    // Initial state check for the button
    if (!backgroundMusic.paused) {
      musicToggleBtn.classList.add('playing');
    }
  }

  // Episode buttons functionality
  let currentPlayingButton = null;

  episodeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const episodeSrc = button.dataset.episodeSrc;
      const episodeTitle = button.textContent.split('\n')[0].trim(); // Get title from button text

      // Clear previous description
      modalEpisodeDescription.innerHTML = '';

      if (episodeSrc) {
        console.log("Episode button clicked. Episode source:", episodeSrc);
        // Pause the hidden player if it's playing
        if (!episodePlayer.paused) {
          episodePlayer.pause();
          console.log("Hidden episode player paused.");
        }

        // Set modal content and show modal
        modalEpisodeTitle.textContent = episodeTitle;
        modalEpisodePlayer.src = episodeSrc;

        // Add specific content for Episode 1
        if (episodeSrc.includes('ep2.mp3')) { // Assuming ep2.mp3 is Episode 1 based on index.html
          modalEpisodeTitle.textContent = "Rap Music, Professional Identity, and Self-Censorship";
          modalEpisodeDescription.innerHTML = `
            <p>This Episode examine the complex appeal of gangsta rap music, particularly among successful professionals and youth. One source, a master's thesis, explores the identity conflict experienced by high-achieving adults who continue to enjoy explicit rap, often leading to self-censorship in professional settings to avoid negative stereotypes. This thesis highlights how individuals reconcile their personal musical tastes with their professional images, and it discusses the historical context of rap's emergence as a voice for the disenfranchised. The second source, an academic article, analyzes gangsta rap as a "Crime as Pop" phenomenon, emphasizing its attractiveness through narratives like "from rags to riches," the staging of self-assertion, stable identity, and resistance against societal norms. It suggests that while mainstream media often demonizes crime, gangsta rap heroizes criminal figures, offering a playful subversion of rules that resonates with audiences, regardless of their background.</p>
          `;
        } else if (episodeSrc.includes('ep1.mp3')) { // Assuming ep1.mp3 is Episode 2 based on index.html
          modalEpisodeTitle.textContent = "The Art of the Comeback: From Failure to Fortune";
          modalEpisodeDescription.innerHTML = `
            <p>In this inspiring episode, we sit down with serial entrepreneurs who share their raw, unfiltered stories of hitting rock bottom and clawing their way back to success. Discover the pivotal moments, the mindset shifts, and the unconventional strategies that turned their failures into fortunes. This isn't just about business; it's about resilience, reinvention, and the indomitable spirit of the human hustle. Learn how to embrace setbacks as stepping stones and transform adversity into your greatest advantage.</p>
          `;
        } else if (episodeSrc.includes('ep3.mp3')) { // Assuming ep3.mp3 is Episode 3 based on index.html
          modalEpisodeTitle.textContent = "Beyond the Hype: Building Sustainable Brands in a Saturated Market";
          modalEpisodeDescription.innerHTML = `
            <p>The market is flooded, trends are fleeting, and consumer attention is a precious commodity. How do you build a brand that not only survives but thrives amidst the noise? This episode dives deep into the strategies for creating sustainable, impactful brands in today's saturated landscape. We explore authentic storytelling, community building, ethical practices, and innovative approaches to stand out and foster lasting loyalty. Tune in to learn how to cut through the hype and build a legacy, not just a business.</p>
          `;
        } else if (episodeSrc.includes('ep1.mp3')) { // Assuming ep1.mp3 is Episode 2 based on index.html
          modalEpisodeTitle.textContent = "The Art of the Comeback: From Failure to Fortune";
          modalEpisodeDescription.innerHTML = `
            <p>In this inspiring episode, we sit down with serial entrepreneurs who share their raw, unfiltered stories of hitting rock bottom and clawing their way back to success. Discover the pivotal moments, the mindset shifts, and the unconventional strategies that turned their failures into fortunes. This isn't just about business; it's about resilience, reinvention, and the indomitable spirit of the human hustle. Learn how to embrace setbacks as stepping stones and transform adversity into your greatest advantage.</p>
          `;
        } else if (episodeSrc.includes('ep3.mp3')) { // Assuming ep3.mp3 is Episode 3 based on index.html
          modalEpisodeTitle.textContent = "Beyond the Hype: Building Sustainable Brands in a Saturated Market";
          modalEpisodeDescription.innerHTML = `
            <p>The market is flooded, trends are fleeting, and consumer attention is a precious commodity. How do you build a brand that not only survives but thrives amidst the noise? This episode dives deep into the strategies for creating sustainable, impactful brands in today's saturated landscape. We explore authentic storytelling, community building, ethical practices, and innovative approaches to stand out and foster lasting loyalty. Tune in to learn how to cut through the hype and build a legacy, not just a business.</p>
          `;
        }

        episodeModal.style.display = 'flex'; // Make it visible before transition
        episodeModal.classList.remove('modal-hidden');
        episodeModal.classList.add('modal-visible');
        console.log("Modal display set to visible. Current display:", episodeModal.style.display);

        modalEpisodePlayer.play().catch(error => {
          console.error("Modal episode playback failed:", error);
        });

        // Update active button visual
        if (currentPlayingButton) {
          currentPlayingButton.classList.remove('playing');
        }
        button.classList.add('playing');
        currentPlayingButton = button;
      }
    });
  });

  // Share button functionality
  shareButtons.forEach(button => {
    button.addEventListener('click', () => {
      const platform = button.dataset.platform;
      const episodeTitle = modalEpisodeTitle.textContent;
      const episodeUrl = window.location.href; // Current page URL

      let shareUrl = '';
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(episodeUrl)}&quote=${encodeURIComponent(episodeTitle)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(episodeUrl)}&title=${encodeURIComponent(episodeTitle)}`;
          break;
        // Add more platforms as needed
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });

  // Close modal functionality
  closeButton.addEventListener('click', () => {
    console.log("Close button clicked.");
    episodeModal.classList.remove('modal-visible');
    episodeModal.classList.add('modal-hidden');
    setTimeout(() => {
      episodeModal.style.display = 'none';
    }, 300); // Match CSS transition duration
    console.log("Modal display set to none. Current display:", episodeModal.style.display);
    modalEpisodePlayer.pause();
    modalEpisodePlayer.src = ''; // Clear src to stop loading
    if (currentPlayingButton) {
      currentPlayingButton.classList.remove('playing');
      currentPlayingButton = null;
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target === episodeModal) {
      episodeModal.classList.remove('modal-visible');
      episodeModal.classList.add('modal-hidden');
      setTimeout(() => {
        episodeModal.style.display = 'none';
      }, 300); // Match CSS transition duration
      modalEpisodePlayer.pause();
      modalEpisodePlayer.src = ''; // Clear src to stop loading
      if (currentPlayingButton) {
        currentPlayingButton.classList.remove('playing');
        currentPlayingButton = null;
      }
    }
  });

  modalEpisodePlayer.addEventListener('ended', () => {
    if (currentPlayingButton) {
      currentPlayingButton.classList.remove('playing');
      currentPlayingButton = null;
    }
  });

  modalEpisodePlayer.addEventListener('pause', () => {
    if (currentPlayingButton) {
      currentPlayingButton.classList.remove('playing');
    }
  });

  modalEpisodePlayer.addEventListener('play', () => {
    // Ensure only the currently playing button has the 'playing' class
    episodeButtons.forEach(button => {
      if (button !== currentPlayingButton) {
        button.classList.remove('playing');
      }
    });
    if (currentPlayingButton) {
      currentPlayingButton.classList.add('playing');
    }
  });

  // Copy email functionality
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const email = document.querySelector(".email").textContent;
      navigator.clipboard.writeText(email).then(() => {
        copyTooltip.classList.add("active");
        setTimeout(() => {
          copyTooltip.classList.remove("active");
        }, 2000);
      });
    });
  }

  // Instagram button functionality
  if (instagramButton) {
    instagramButton.addEventListener("click", () => {
      window.open("https://www.instagram.com/naga_apparel", "_blank");
    });
  }

  // Menu animation - add entrance animation for menu items
  const animateMenuItems = (show) => {
    sectionNavItems.forEach((item, index) => {
      if (show) {
        setTimeout(() => {
          item.classList.add("animate-in");
        }, 50 + index * 30);
      } else {
        item.classList.remove("animate-in");
      }
    });
  };

  // Toggle menu expansion with animation
  menuBtn.addEventListener("click", () => {
    menuExpanded = !menuExpanded;

    leftMenu.classList.toggle("expanded");
    document.body.classList.toggle("menu-expanded");
    console.log("Menu expanded:", menuExpanded);

    if (menuExpanded) {
      setTimeout(() => {
        animateMenuItems(true);
      }, 150);
    } else {
      animateMenuItems(false);
    }

    // Update dimensions after menu animation
    setTimeout(() => {
      updateDimensions(false);
    }, 400);
  });

  // Improved parallax effect with more subtle movement
  const updateParallax = () => {
    parallaxElements.forEach((element) => {
      if (!element) return;

      const speed = Number.parseFloat(element.dataset.speed) || 0.2;

      // Make parallax much more subtle (reduced from 0.5 to 0.2)
      const PARALLAX_INTENSITY = 0.2;

      // Calculate the horizontal movement based on scroll position
      // Use negative values for the parallax effect
      const moveX = -currentX * speed * PARALLAX_INTENSITY;

      // Apply translation to create parallax effect
      element.style.transform = `translateX(${moveX}px)`;
    });
  };

  // Update dimensions on resize
  const updateDimensions = (animate = true) => {
    // Calculate panel width based on current window width
    panelWidth = window.innerWidth;
    maxScroll = (PANEL_COUNT - 1) * panelWidth;

    // Keep the current panel centered
    targetX = currentPanel * panelWidth;
    currentX = targetX;

    // Update panel widths
    panels.forEach((panel) => {
      panel.style.width = `${panelWidth}px`;
    });

    // Apply transform with or without transition
    if (animate) {
      panelsContainer.classList.add("transitioning");
      setTimeout(() => {
        panelsContainer.classList.remove("transitioning");
      }, 400);
    }

    panelsContainer.style.transform = `translateX(-${currentX}px)`;

    // Force parallax update
    updateParallax();
  };

  // Navigate to section when clicking nav item
  sectionNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      const index = Number.parseInt(item.getAttribute("data-index"));

      // Set target position to that panel
      targetX = index * panelWidth;

      // Update active class
      sectionNavItems.forEach((navItem) => {
        navItem.classList.remove("active");
      });
      item.classList.add("active");

      // Start animation
      startAnimation();

      // Close menu on mobile or after navigation
      if (window.innerWidth < 768 && menuExpanded) {
        menuExpanded = false;
        leftMenu.classList.remove("expanded");
        document.body.classList.remove("menu-expanded");
        animateMenuItems(false);

        // Update dimensions after menu closes
        setTimeout(() => {
          updateDimensions(false);
        }, 400);
      }
    });
  });

  // Split text elements with staggered animation
  const splitTexts = document.querySelectorAll(".split-text");
  splitTexts.forEach((text) => {
    const words = text.textContent.split(" ");
    text.innerHTML = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(" ");

    // Add delay to each word
    const wordElements = text.querySelectorAll(".word");
    wordElements.forEach((word, index) => {
      word.style.transitionDelay = `${index * 0.02}s`;
    });
  });

  // Update page counter
  const updatePageCount = () => {
    const currentPanelIndex = Math.round(currentX / panelWidth) + 1;
    const formattedIndex = currentPanelIndex.toString().padStart(2, "0");
    const totalPanels = PANEL_COUNT.toString().padStart(2, "0");
    navText.textContent = `${formattedIndex} / ${totalPanels}`;

    // Update active section in navigation
    sectionNavItems.forEach((item, index) => {
      if (index === currentPanelIndex - 1) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  // Update progress bar
  const updateProgress = () => {
    targetProgress = currentX / maxScroll;
    currentProgress = lerp(
      currentProgress,
      targetProgress,
      SMOOTH_FACTOR * 1.5
    );
    progressFill.style.transform = `scaleX(${currentProgress})`;
  };

  // Update active panel with fixed visibility for backwards navigation
  const updateActivePanel = () => {
    currentPanel = Math.round(currentX / panelWidth);
    if (currentPanel !== lastPanel) {
      // Remove section-animated class from all elements in all panels
      panels.forEach((panel) => {
        panel.classList.remove("was-active");
        const allAnimatedElements = panel.querySelectorAll('.section-animated');
        allAnimatedElements.forEach(el => {
          el.classList.remove('section-animated');
        });
      });

      // Mark previously active panel
      if (lastPanel >= 0 && panels[lastPanel]) {
        panels[lastPanel].classList.remove("active");
      }

      // Set new active panel
      if (panels[currentPanel]) {
        panels[currentPanel].classList.add("active");

        // Apply animation to relevant text elements in the active panel
        const activePanel = panels[currentPanel];
        let elementsToAnimate = [];

        if (currentPanel === 0) { // Introduction
          elementsToAnimate = activePanel.querySelectorAll('h1.title, p.text');
        } else if (currentPanel === 1) { // Podcast
          elementsToAnimate = activePanel.querySelectorAll('h2.title, p.text');
        } else if (currentPanel === 2) { // Hustle
          elementsToAnimate = activePanel.querySelectorAll('.space-text');
        } else if (currentPanel === 3) { // Vision
          elementsToAnimate = activePanel.querySelectorAll('h2.title, p.text');
        } else if (currentPanel === 4) { // Naga
          elementsToAnimate = activePanel.querySelectorAll('.beyond-text');
        } else if (currentPanel === 5) { // Dialogue
          elementsToAnimate = activePanel.querySelectorAll('.quote');
        } else if (currentPanel === 6) { // THRIVE
          elementsToAnimate = activePanel.querySelectorAll('.mega-text');
        } else if (currentPanel === 7) { // PODCAST (video)
          elementsToAnimate = activePanel.querySelectorAll('.mega-text, .new-episodes-text, .watch-logo');
          if (player && typeof player.playVideo === 'function') {
            player.playVideo();
          }
        } else if (currentPanel === 8) { // Contact
          elementsToAnimate = activePanel.querySelectorAll('.contact-name');
        }

        // Pause video if not on video panel
        if (currentPanel !== 7) {
          if (player && typeof player.pauseVideo === 'function') {
            player.pauseVideo();
          }
        }

        elementsToAnimate.forEach(el => {
          el.classList.add('section-animated');
        });
      }

      // Ensure all previous panels remain visible when scrolling back
      for (let i = 0; i < panels.length; i++) {
        if (i < currentPanel) {
          panels[i].classList.add("visited");
        } else {
          panels[i].classList.remove("visited");
        }
      }

      lastPanel = currentPanel;
    }
  };

  // Animation loop
  const animate = () => {
    // Smooth scrolling with lerp
    currentX = lerp(currentX, targetX, SMOOTH_FACTOR);
    panelsContainer.style.transform = `translateX(-${currentX}px)`;

    // Update progress and navigation
    updateProgress();
    updatePageCount();
    updateActivePanel();
    updateParallax();

    if (Math.abs(targetX - currentX) > 0.1 || isAnimating) {
      requestAnimationFrame(animate);
    } else {
      isAnimating = false;
    }
  };

  // Start animation
  const startAnimation = () => {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(animate);
    }
  };

  // Event handlers
  const handleWheel = (e) => {
    e.preventDefault();
    targetX = clamp(targetX + e.deltaY * WHEEL_SENSITIVITY, 0, maxScroll);
    startAnimation();
  };

  const handleMouseDown = (e) => {
    if (e.target.closest(".left-menu") || e.target.closest(".copy-email"))
      return; // Don't drag when clicking menu or copy button

    isDragging = true;
    startX = e.clientX;
    startScrollX = currentX;
    lastTouchX = e.clientX;
    lastTouchTime = Date.now();
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    targetX = clamp(startScrollX - dx, 0, maxScroll);

    const currentTime = Date.now();
    const timeDelta = currentTime - lastTouchTime;
    if (timeDelta > 0) {
      const touchDelta = lastTouchX - e.clientX;
      velocityX = (touchDelta / timeDelta) * 15;
    }

    lastTouchX = e.clientX;
    lastTouchTime = currentTime;
    e.preventDefault();
    startAnimation();
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = "grab";

    if (Math.abs(velocityX) > 0.5) {
      targetX = clamp(targetX + velocityX * 8, 0, maxScroll);
    }

    const nearestPanel = Math.round(targetX / panelWidth);
    targetX = nearestPanel * panelWidth;
    startAnimation();
  };

  const handleTouchStart = (e) => {
    if (e.target.closest(".left-menu") || e.target.closest(".copy-email"))
      return; // Don't drag when touching menu

    isDragging = true;
    startX = e.touches[0].clientX;
    startScrollX = currentX;
    lastTouchX = e.touches[0].clientX;
    lastTouchTime = Date.now();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    targetX = clamp(startScrollX - dx, 0, maxScroll);

    const currentTime = Date.now();
    const timeDelta = currentTime - lastTouchTime;
    if (timeDelta > 0) {
      const touchDelta = lastTouchX - e.touches[0].clientX;
      velocityX = (touchDelta / timeDelta) * 12;
    }

    lastTouchX = e.touches[0].clientX;
    lastTouchTime = currentTime;
    e.preventDefault();
    startAnimation();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    if (Math.abs(velocityX) > 0.5) {
      targetX = clamp(targetX + velocityX * 6, 0, maxScroll);
    }

    const nearestPanel = Math.round(targetX / panelWidth);
    targetX = nearestPanel * panelWidth;
    startAnimation();
  };

  // Event listeners
  horizontalContainer.addEventListener("wheel", handleWheel, {
    passive: false
  });
  horizontalContainer.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
  horizontalContainer.addEventListener("touchstart", handleTouchStart, {
    passive: true
  });
  horizontalContainer.addEventListener("touchmove", handleTouchMove, {
    passive: false
  });
  horizontalContainer.addEventListener("touchend", handleTouchEnd, {
    passive: true
  });

  window.addEventListener("resize", () => {
    updateDimensions();
  });

  // Make sure parallax elements are loaded
  parallaxElements.forEach((img) => {
    if (img.tagName === "IMG") {
      if (img.complete) {
        // Image already loaded
        img.classList.add("loaded");
      } else {
        // Wait for image to load
        img.addEventListener("load", () => {
          img.classList.add("loaded");
        });
      }
    }
  });

  // Video background
  if (videoBackground) {
    videoBackground.playbackRate = 0.6;
  }

  // Initialize
  updateDimensions();
  updateActivePanel();
  updatePageCount();
  startAnimation();

  // Initial animation for first panel
  setTimeout(() => {
    panels[0].classList.add("active");
    sectionNavItems[0].classList.add("active");
  }, 100);

  // Force parallax update on load
  setTimeout(() => {
    updateParallax();
  }, 200);
});