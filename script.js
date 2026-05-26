document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PRELOADER SCREEN FADE-OUT
       ========================================================================== */
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 600); // 600ms display for sleek entrance
        });
        
        // Fallback in case load event delays
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 3000);
    }

    /* ==========================================================================
       2. TYPING EFFECT
       ========================================================================== */
    const typingSpan = document.getElementById('typing-text');
    if (typingSpan) {
        const phrases = [
            "Aspiring Python Developer",
            "Problem Solving Enthusiast",
            "Data Analytics Learner"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIdx];
            
            if (isDeleting) {
                typingSpan.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 50; // Deleting speed
            } else {
                typingSpan.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 100; // Typing speed
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typingSpeed = 2000; // Pause at the end of phrase
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 500; // Pause before next word
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000);
    }

    /* ==========================================================================
       3. INTERSECTION OBSERVER SCROLL REVEALS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    /* ==========================================================================
       4. NAVBAR BACKGROUND SHRINK & SHADOW
       ========================================================================== */
    const header = document.querySelector('.header');
    
    function checkHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll();

    /* ==========================================================================
       5. ACTIVE NAVIGATION ITEM TRACKING
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightActiveNavLink() {
        let scrollPosition = window.scrollY + 120; // Offset for sticky navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNavLink);
    highlightActiveNavLink();

    /* ==========================================================================
       6. MOBILE MENU & OVERLAY INTERACTION
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;

    function toggleMobileMenu() {
        mobileToggle.classList.toggle('open');
        mobileOverlay.classList.toggle('open');
        body.classList.toggle('no-scroll');
    }

    if (mobileToggle && mobileOverlay) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileOverlay.classList.contains('open')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    /* ==========================================================================
       7. CUSTOM MOUSE-FOLLOW CURSOR GLOW (CYBER-CYAN)
       ========================================================================== */
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        let mouseX = -300;
        let mouseY = -300;
        let currentX = -300;
        let currentY = -300;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth Lerp loop for fluid cursor movement
        function smoothCursorAnimation() {
            const ease = 0.15; // Smooth easing coefficient
            currentX += (mouseX - currentX) * ease;
            currentY += (mouseY - currentY) * ease;
            
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            
            requestAnimationFrame(smoothCursorAnimation);
        }
        
        requestAnimationFrame(smoothCursorAnimation);
    }

    /* ==========================================================================
       8. PROJECT CARD MOUSE-FOLLOW RADIAL SHADER
       ========================================================================== */
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate absolute pointer coordinates relative to the card bounds
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ==========================================================================
       9. LIGHTWEIGHT 2D HTML5 CANVAS PARTICLE SYSTEM
       ========================================================================== */
    const canvas = document.getElementById('project-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 40; // High performance threshold
        
        function resizeCanvas() {
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle blueprint
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 1; // 1px to 5px circles
                this.speedX = Math.random() * 0.4 - 0.2; // Slow drift
                this.speedY = Math.random() * -0.6 - 0.1; // Float upwards
                this.opacity = Math.random() * 0.3 + 0.1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Reset particles reaching the top
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
                
                // Wrap horizontal edges
                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX = -this.speedX;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`; // Cyber cyan bubbles
                ctx.fill();
            }
        }
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }
        
        initParticles();
        
        // Draw connection lines between particles close in proximity
        function connectParticles() {
            const maxDistance = 120;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.hypot(dx, dy);
                    
                    if (distance < maxDistance) {
                        const alpha = (1 - (distance / maxDistance)) * 0.08; // Delicate fade
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        window.addEventListener('resize', () => {
            initParticles();
        });
    }

    /* ==========================================================================
       10. CONTACT FORM INTERACTIVE WEB GMAIL REDIRECT
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Intercept page reload
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            if (nameInput && emailInput && subjectInput && messageInput) {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const subject = subjectInput.value.trim();
                const message = messageInput.value.trim();
                
                const recipient = 'kumarapubhavyasri@gmail.com';
                const mailSubject = `Portfolio Contact: ${subject}`;
                
                const mailBody = `Hello KUMARAPU BHAVYA SRI,\n\n` +
                                 `My Name: ${name}\n` +
                                 `My Contact Email: ${email}\n\n` +
                                 `Message:\n${message}\n\n` +
                                 `Best Regards,\n${name}`;
                
                // Construct URL-encoded web Gmail compose link
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1` +
                                 `&to=${encodeURIComponent(recipient)}` +
                                 `&su=${encodeURIComponent(mailSubject)}` +
                                 `&body=${encodeURIComponent(mailBody)}`;
                
                // Open Gmail compose directly in a new browser tab without launching local apps
                window.open(gmailUrl, '_blank');
                
                // Provide visual button feedback
                const submitBtn = contactForm.querySelector('.btn-submit');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.style.backgroundColor = '#10B981'; // Success feedback green
                    submitBtn.innerHTML = `<span>Gmail Composing Tab Opened!</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    
                    setTimeout(() => {
                        submitBtn.style.backgroundColor = ''; // Reset to style.css defaults
                        submitBtn.innerHTML = originalText;
                    }, 4500);
                }
                
                // Reset form values
                contactForm.reset();
            }
        });
    }
});
