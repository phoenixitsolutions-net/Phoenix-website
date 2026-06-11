// Add simple entrance animations and scroll effects
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hamburger Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Particle System ---
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
                // Randomly assign theme colors (Phoenix Orange, Green, Amber)
                const colors = ['rgba(255, 87, 34, 0.2)', 'rgba(0, 112, 60, 0.2)', 'rgba(255, 152, 0, 0.2)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const count = Math.min(Math.floor(width / 15), 60);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            // Draw connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }



    // --- Service Details Modal Controller ---
    const serviceDetails = {
        computer: {
            title: "Computer Sales & Service",
            icon: "fas fa-desktop",
            description: "We provide high-performance systems, custom builds, and chip-level technical repair services for individual users and corporate clients.",
            list: [
                "Authorized sales of premium laptops and desktops (Dell, HP, Lenovo, ASUS).",
                "Custom-engineered PC configurations for high-end gaming, 3D rendering, and AI computing.",
                "Chip-level diagnostics and motherboard servicing.",
                "Original hardware component replacements (RAM, SSD, screen, battery).",
                "Annual Maintenance Contracts (AMC) and networking services for businesses."
            ]
        },
        web: {
            title: "Website Designing",
            icon: "fas fa-globe",
            description: "We create stunning, user-centered, and fast websites optimized for high conversion rates and search rankings.",
            list: [
                "Modern, responsive corporate websites and landing pages.",
                "Secure, feature-rich E-Commerce stores with payment gateways.",
                "Custom web applications utilizing cutting-edge JS frameworks.",
                "Search Engine Optimization (SEO) & Google My Business local search setup.",
                "High-performance speed tuning and Google Web Vitals optimization."
            ]
        },
        software: {
            title: "Software Development",
            icon: "fas fa-code",
            description: "We engineer customized software systems, internal databases, and secure APIs designed to automate business operations.",
            list: [
                "Tailor-made ERP, billing, CRM, and inventory management systems.",
                "Secure backend API development and cloud infrastructure integration.",
                "Database design, migration, and management (SQL/NoSQL).",
                "Cloud server deployments (AWS, Microsoft Azure, Private VPS).",
                "Automation scripts to streamline manual administrative workflows."
            ]
        },
        marketing: {
            title: "Digital Marketing",
            icon: "fas fa-server",
            description: "We design data-driven campaigns to increase brand reach, lead collection, and organic consumer acquisitions.",
            list: [
                "On-page and off-page Search Engine Optimization (SEO).",
                "Social Media Marketing (SMM) on Facebook, Instagram, LinkedIn.",
                "Pay-Per-Click (PPC) and cost-per-click Google Search & Display Ads.",
                "Graphic design, copy-writing, and promotional content strategy.",
                "Marketing funnel development and lead nurturing campaign analytics."
            ]
        }
    };

    const modal = document.getElementById('serviceModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');
    const serviceCards = document.querySelectorAll('.service-card');

    if (modal && modalBody && serviceCards.length > 0) {
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const serviceKey = card.getAttribute('data-service');
                const data = serviceDetails[serviceKey];
                
                if (data) {
                    let listItems = '';
                    data.list.forEach(item => {
                        listItems += `<li><i class="fas fa-check-circle"></i><span>${item}</span></li>`;
                    });

                    modalBody.innerHTML = `
                        <div class="modal-details">
                            <h3><i class="${data.icon}"></i> ${data.title}</h3>
                            <p>${data.description}</p>
                            <ul>
                                ${listItems}
                            </ul>
                        </div>
                    `;
                    
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Lock background scroll
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        // Close when clicking background overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key press
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- Web3Forms AJAX Submission ---
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            
            // Add loading spinner
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
            const originalHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner"></div><span>Sending...</span>';
            
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    // Success
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                } else {
                    // API error
                    console.log(res);
                    alert(res.message || 'Something went wrong! Please try again.');
                }
            })
            .catch(error => {
                console.error(error);
                alert('Network error. Please try again later.');
            })
            .finally(() => {
                // Reset button state
                submitBtn.classList.remove('btn-loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHtml;
                contactForm.reset();
            });
        });
    }
});
