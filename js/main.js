document.addEventListener("DOMContentLoaded", () => {
    
    // Remove loading state once DOM is ready
    document.body.classList.remove("loading-state");

    /* =========================================
       1. INITIALIZATION: LENIS SMOOTH SCROLL
       ========================================= */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Update ScrollTrigger on lenis scroll
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    /* =========================================
       1.5 THEME TOGGLE LOGIC
       ========================================= */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlEl.setAttribute('data-theme', 'light');
        themeIcon.className = 'fa-solid fa-moon';
    } else {
        htmlEl.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fa-solid fa-sun';
    }

    themeToggle.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'light') {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            htmlEl.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fa-solid fa-moon';
        }
    });

    /* =========================================
       2. HEADER SCROLL EFFECT
       ========================================= */
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* =========================================
       3. CUSTOM CURSOR & MAGNETIC EFFECT
       ========================================= */
    const cursor = document.getElementById("custom-cursor");
    const cursorFollower = document.getElementById("cursor-follower");
    
    if (window.matchMedia("(pointer: fine)").matches) {
        // Move cursor smoothly
        let mouseX = 0, mouseY = 0;
        let pMouseX = 0, pMouseY = 0;
        
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move small cursor
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0,
                ease: "none"
            });
        });

        // Add lag for follower
        gsap.ticker.add(() => {
            pMouseX += (mouseX - pMouseX) * 0.15;
            pMouseY += (mouseY - pMouseY) * 0.15;
            
            gsap.set(cursorFollower, {
                x: pMouseX,
                y: pMouseY
            });
        });

        // Hover effect for clickables
        const interactiveEle = document.querySelectorAll('a, button, input, textarea');
        interactiveEle.forEach(el => {
            el.addEventListener("mouseenter", () => {
                document.body.classList.add("cursor-hover");
            });
            el.addEventListener("mouseleave", () => {
                document.body.classList.remove("cursor-hover");
                // reset magnetic buttons just in case
                gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            });
        });

        // Magnetic Buttons Logic
        const magnetics = document.querySelectorAll(".magnetic");
        magnetics.forEach(btn => {
            btn.addEventListener("mousemove", function(e) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const strength = btn.dataset.strength || 20;

                gsap.to(btn, {
                    x: (x / rect.width) * strength,
                    y: (y / rect.height) * strength,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            btn.addEventListener("mouseleave", function() {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    /* =========================================
       4. MOBILE NAVIGATION
       ========================================= */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* =========================================
       5. TYPING ANIMATION (Hero Section)
       ========================================= */
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor-blink");

    if (typedTextSpan) {
        const textArray = ["Developer.", "Problem Solver.", "Tech Enthusiast."];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000; // Delay between current and next text
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if(textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }

        // Init typing
        setTimeout(type, 1500);
    }

    /* =========================================
       6. GSAP SCROLL ANIMATIONS & EXTREME CARDS
       ========================================= */
       
    // Smooth, Lightweight Section Card Entrances
    const sectionCards = gsap.utils.toArray('.section-card');
    
    // Simpler, highly performant entrance styles
    const animationStyles = [
        () => ({ y: 80, opacity: 0, duration: 1.0, ease: "power3.out" }),
        () => ({ y: 50, scale: 0.95, opacity: 0, duration: 1.0, ease: "power2.out" }),
        () => ({ x: -50, opacity: 0, duration: 1.0, ease: "power2.out" }),
        () => ({ x: 50, opacity: 0, duration: 1.0, ease: "power2.out" })
    ];

    sectionCards.forEach((card, index) => {
        if(card.closest('#hero')) return; // let hero load normally
        
        // Pick a random lightweight style
        const stylePicker = Math.floor(Math.random() * animationStyles.length);
        const animConfig = animationStyles[stylePicker](index);
        
        // Apply optimized configurations
        gsap.from(card, {
            ...animConfig,
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none" // Animate ONCE. Massive performance save.
            }
        });
    });
    
    // Parallax background grid - global
    gsap.to(".global-grid", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });

    // Reveal Up Animation for general elements
    const revealElements = document.querySelectorAll(".reveal-up");
    revealElements.forEach(elem => {
        gsap.from(elem, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Starts when element is 85% down the viewport
                toggleActions: "play none none reverse"
            }
        });
    });

    // Fade In for Hero Image wrapper
    gsap.from(".reveal-fade", {
        opacity: 0,
        scale: 0.9,
        duration: 1.5,
        delay: 0.5,
        ease: "power3.out"
    });

    // Animate Skill Bars
    const skillBars = document.querySelectorAll(".skill-bar-fill");
    skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute("data-width");
        gsap.to(bar, {
            width: targetWidth,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".skills-container",
                start: "top 80%",
            }
        });
    });

    // Timeline line growing
    gsap.to(".timeline-line", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".timeline",
            start: "top 80%",
            end: "bottom 50%",
            scrub: 1
        }
    });

    // Staggered reveal for project cards
    gsap.from(".project-card", {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    /* =========================================
       8. SCROLL SPY (ACTIVE NAV TABS)
       ========================================= */
    const sections = document.querySelectorAll("section[id]");
    const navItemsList = document.querySelectorAll(".nav-links .nav-item:not(.nav-resume-btn)");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 250) {
                current = section.getAttribute("id");
            }
        });

        navItemsList.forEach((item) => {
            item.classList.remove("active");
            if (current && item.getAttribute("href").includes(current)) {
                item.classList.add("active");
            }
        });
    });

    /* =========================================
       9. HTML RESUME MODAL
       ========================================= */
    const resumeModal = document.getElementById("resumeModal");
    
    window.openResumeModal = function(e) {
        if (e) e.preventDefault();
        resumeModal.classList.add("active");
        if(typeof lenis !== "undefined") lenis.stop();
        document.body.style.overflow = "hidden"; 
    };

    window.closeResumeModal = function() {
        resumeModal.classList.remove("active");
        if(typeof lenis !== "undefined") lenis.start();
        document.body.style.overflow = "auto";
    };

    if(resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeResumeModal();
        });
    }

    /* =========================================
       10. SKILLS FILTERING
       ========================================= */
    const filterBtns = document.querySelectorAll(".filter-btn");
    const filterItems = document.querySelectorAll(".filter-item");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            filterItems.forEach(item => {
                if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                    item.classList.remove("hidden");
                    setTimeout(() => item.style.opacity = "1", 50);
                } else {
                    item.style.opacity = "0";
                    setTimeout(() => item.classList.add("hidden"), 300);
                }
            });
        });
    });

    /* =========================================
       11. CONTACT FORM AJAX HANDLER
       ========================================= */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status === 200) {
                    alert("Success! Your message was sent.");
                    contactForm.reset();
                } else {
                    console.error("Web3Forms API Error:", jsonResponse);
                    alert("Delivery Failed: " + (jsonResponse.message || "Unknown error"));
                }
            })
            .catch(error => {
                console.error("AJAX Error:", error);
                alert("Network error: Something prevented the message from sending. Check the console.");
            })
            .finally(() => {
                btn.innerHTML = originalHTML;
            });
        });
    }

});
