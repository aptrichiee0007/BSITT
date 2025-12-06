document.addEventListener('DOMContentLoaded', () => {
    
    const preloader = document.querySelector('.preloader');
    const loadingProgress = document.querySelector('.loading-progress');
    let loadProgress = 0;
    
    const loadingInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 500);
        }
        loadingProgress.style.width = loadProgress + '%';
    }, 150);

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    document.querySelectorAll('a, button, input, select, .inv-slot').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) skewX(-10deg)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0) skewX(-10deg)`;
        });
    });

    const scrambleElements = document.querySelectorAll('[data-scramble]');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    
    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalText = target.innerText;
                let iterations = 0;
                
                const interval = setInterval(() => {
                    target.innerText = originalText.split("")
                        .map((letter, index) => {
                            if(index < iterations) {
                                return originalText[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("");
                    
                    if(iterations >= originalText.length) {
                        clearInterval(interval);
                    }
                    
                    iterations += 1/3;
                }, 30);
                
                scrambleObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    scrambleElements.forEach(el => scrambleObserver.observe(el));

    const typeWriterElements = document.querySelectorAll('[data-typewriter]');
    const typeWriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalHTML = target.innerHTML; 
                const plainText = target.innerText;
                
                target.innerHTML = "";
                let i = 0;
                
                const typing = setInterval(() => {
                    target.innerText = plainText.substring(0, i);
                    i++;
                    if(i > plainText.length) {
                        clearInterval(typing);
                        target.innerHTML = originalHTML; 
                    }
                }, 50);
                typeWriterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    typeWriterElements.forEach(el => typeWriterObserver.observe(el));

    const flickerTarget = document.querySelector('.flicker-target');
    if(flickerTarget) {
        setInterval(() => {
            if(Math.random() > 0.8) {
                flickerTarget.classList.add('flicker-effect');
                setTimeout(() => flickerTarget.classList.remove('flicker-effect'), 500);
            }
        }, 2000);
    }

    const cards = document.querySelectorAll('.matrix-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });

    const heroSection = document.getElementById('home');
    const bike = document.getElementById('hero-bike');
    if (heroSection && bike) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 60;
            const y = (window.innerHeight - e.pageY * 2) / 60;
            bike.style.transform = `translateX(-10%) translateX(${x}px) translateY(${y}px)`;
        });
    }

    const colorBtns = document.querySelectorAll('.color-btn');
    const mainImg = document.getElementById('main-bike-img');
    const colorNameTitle = document.getElementById('color-name');
    const colorDescP = document.getElementById('color-desc');

    const descriptions = {
        black: "The ultimate stealth machine. Non-reflective matte finish commands respect without saying a word.",
        red: "Aggressive styling that turns heads. High-visibility red with premium metallic finish.",
        blue: "Deep Stellar Blue with pearl metallic finish. Sophisticated elegance meets modern performance.",
        white: "Arctic White with pearl finish. Clean, high-contrast visibility combined with timeless elegance."
    };

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const newImgSrc = btn.getAttribute('data-img');
            const colorKey = btn.getAttribute('data-color');
            const colorName = btn.innerText.trim();
            
            mainImg.style.opacity = 0;
            mainImg.style.transform = "scale(0.85) translateX(50px)";
            
            setTimeout(() => {
                mainImg.src = newImgSrc;
                colorNameTitle.innerText = colorName;
                colorDescP.innerText = descriptions[colorKey];
                mainImg.style.opacity = 1;
                mainImg.style.transform = "scale(1) translateX(0)";
            }, 300);
        });
    });

    window.equipItem = function(name, desc, imgId) {
        document.getElementById('item-name').innerText = "MODULE: " + name.toUpperCase();
        document.getElementById('item-desc').innerText = desc;
        document.getElementById('part-overlay').innerText = name.toUpperCase() + " INSTALLED";
        document.getElementById('part-overlay').style.borderColor = "#00ff41";
        document.getElementById('part-overlay').style.color = "#00ff41";
        
        document.querySelectorAll('.inv-slot').forEach(slot => slot.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        document.querySelectorAll('.acc-layer').forEach(layer => layer.style.opacity = '0');
        if(imgId) {
            const targetImg = document.getElementById(imgId);
            if(targetImg) {
                targetImg.style.opacity = '1';
            }
        }
        
        const visualContainer = document.querySelector('.loadout-visual');
        visualContainer.style.transform = "scale(0.99)";
        setTimeout(() => visualContainer.style.transform = "scale(1)", 100);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    const hiddenElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-text, .reveal-img, .matrix-card, .log-card, .spec-group, .timeline-node');
    hiddenElements.forEach(el => observer.observe(el));

    const particlesContainer = document.querySelector('.particles-container');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }

    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target !== '#') smoothScroll(target);
        });
    });

    window.calculateLoan = function() {
        const srp = parseFloat(document.getElementById('srp').value);
        const downInput = document.getElementById('downpayment');
        const months = parseInt(document.getElementById('months').value);
        const resultDisplay = document.getElementById('monthly-result');
        const loanAmountDisplay = document.getElementById('loan-amount');
        const totalInterestDisplay = document.getElementById('total-interest');
        const totalPayableDisplay = document.getElementById('total-payable');
        const downpayment = parseFloat(downInput.value);

        if (!downpayment || downpayment <= 0 || downpayment >= srp) {
            resultDisplay.style.color = "#ff003c";
            resultDisplay.innerText = "INVALID INPUT";
            setTimeout(() => resultDisplay.style.color = "#ff003c", 1500);
            return;
        }

        const loanAmount = srp - downpayment;
        const interestRate = 0.015;
        const totalInterest = loanAmount * interestRate * months;
        const totalAmount = loanAmount + totalInterest;
        const monthly = totalAmount / months;

        let iterations = 0;
        const finalValue = "₱ " + monthly.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        const interval = setInterval(() => {
            resultDisplay.innerText = "₱ " + (Math.random() * 8000).toFixed(2);
            if (iterations > 8) {
                clearInterval(interval);
                resultDisplay.innerText = finalValue;
                loanAmountDisplay.innerText = "₱ " + loanAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                totalInterestDisplay.innerText = "₱ " + totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                totalPayableDisplay.innerText = "₱ " + totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            }
            iterations++;
        }, 40);
    };

    const testRideForm = document.getElementById('testRideForm');
    if (testRideForm) {
        testRideForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your interest! Our team will contact you within 24 hours.');
            testRideForm.reset();
        });
    }

    let lastScrollTop = 0;
    const header = document.querySelector('.hud-header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            glitchText.style.textShadow = `${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #00ffff, ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #ff00ff`;
            setTimeout(() => {
                glitchText.style.textShadow = 'none';
            }, 50);
        }, 3000);
    }

    const statNums = document.querySelectorAll('.stat-num');
    const animateNumbers = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.innerText;
                const isCC = text.includes('125');
                const isKM = text.includes('+');
                const isPrice = text.includes('₱');
                
                let endValue = isCC ? 125 : (isKM ? 50 : 81);
                let current = 0;
                const increment = endValue / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= endValue) {
                        current = endValue;
                        clearInterval(timer);
                    }
                    target.innerText = isPrice ? `₱${Math.floor(current)}K` : (isKM ? `${Math.floor(current)}+` : Math.floor(current));
                }, 30);
                
                observer.unobserve(target);
            }
        });
    };

    const numberObserver = new IntersectionObserver(animateNumbers, { threshold: 0.5 });
    statNums.forEach(num => numberObserver.observe(num));

});