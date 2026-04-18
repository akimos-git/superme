document.addEventListener("DOMContentLoaded", () => {
    
    // --- Dynamic Hero Sequences (Intro + Scroll Parallax) ---
    const elLeft = document.querySelector('.intro-seq-left');
    const elRight = document.querySelector('.intro-seq-right');
    const img1 = document.querySelector('.img-1');
    const img2 = document.querySelector('.img-2');
    const img3 = document.querySelector('.img-3');
    const img4 = document.querySelector('.img-4');
    const img5 = document.querySelector('.img-5');

    let heroProgress = 0;
    let introComplete = false;
    let startTime = performance.now();

    function getLocalP(p, start, end) {
        if (p <= start) return 0;
        if (p >= end) return 1;
        return (p - start) / (end - start);
    }

    function applyTransforms(p) {
        if (!elLeft || !elRight) return;
        const isMobile = window.innerWidth <= 768;
        const xOffset = isMobile ? 0 : 220; // Don't shift titles horizontally on mobile where they are stacked
        const xTravel = isMobile ? 0 : 190;
        const cardScale = isMobile ? 0.6 : 1.0; // Cards fan out less on narrow screens

        // --- Text Phase ---
        // p goes 0.0 (cards gone, text wide/faded) to 1.0 (text squeezed around fanned cards)
        let textP = getLocalP(p, 0.2, 1.0);
        let leftX = -xOffset + (xTravel * textP);
        let rightX = xOffset - (xTravel * textP);
        
        let textOp = getLocalP(p, 0.0, 0.2); // fade out entirely when scrolled deep
        
        elLeft.style.transform = `translateX(${leftX}px)`;
        elLeft.style.opacity = textOp;
        
        elRight.style.transform = `translateX(${rightX}px)`;
        elRight.style.opacity = textOp;

        // --- Sequenced Cards ---
        const cards = [
            { el: img1, rot: -24, tx: -140 * cardScale, ty: -20 * cardScale },
            { el: img2, rot: -12, tx: -70 * cardScale, ty: -10 * cardScale },
            { el: img3, rot: 0, tx: 0, ty: 0 },
            { el: img4, rot: 12, tx: 70 * cardScale, ty: -10 * cardScale },
            { el: img5, rot: 24, tx: 140 * cardScale, ty: -20 * cardScale }
        ];

        // Process each card with a staggered time window
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (!card.el) continue;
            
            // Stagger start points: Card 0 starts at p=0.0, Card 4 starts at p=0.4
            // Range dynamically ends 0.6 progress length after its start
            let start = i * 0.1;
            let end = 0.6 + (i * 0.1); 
            
            let cardP = getLocalP(p, start, end);
            
            // First 50% of the card's progress is drop. Last 50% is fanning out.
            let dropP = getLocalP(cardP, 0, 0.5);
            let fanP = getLocalP(cardP, 0.5, 1.0);
            
            // Easing for drop
            let easedDrop = 1 - Math.pow(1 - dropP, 3); // cubic easeOut
            let yPos = -1000 + (1000 * easedDrop);
            
            // Easing for fan
            let easedFan = 1 - Math.pow(1 - fanP, 2); // quadratic easeOut
            
            let rot = card.rot * easedFan;
            let transX = card.tx * easedFan;
            let transY = card.ty * easedFan;
            
            card.el.style.transform = `translateY(${yPos}px) rotate(${rot}deg) translate(${transX}px, ${transY}px)`;
            card.el.style.opacity = dropP; 
        }
    }

    function renderHero(time) {
        if (!introComplete) {
            let elapsed = time - startTime;
            let rawProgress = Math.min(elapsed / 2200, 1);
            
            // easeInOut component for smoothness
            let easeP = rawProgress < 0.5 
                ? 4 * rawProgress * rawProgress * rawProgress 
                : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
                
            heroProgress = easeP;
            applyTransforms(heroProgress);

            if (rawProgress >= 1) {
                introComplete = true;
            }
        } else {
            // Parallax Scrub based on scroll
            // .v-hero is 250vh, so we have 150vh of purely scroll-locked animation time
            const maxScroll = window.innerHeight * 1.5;
            const scrollY = window.scrollY;
            
            // As scroll goes down, scrollP goes towards 0
            const scrollP = Math.max(0, 1 - (scrollY / maxScroll));
            
            // Target is directly scrollP (p goes from 1.0 to 0.0)
            let mappedP = scrollP;
            
            // Smoothly lerp towards the target
            heroProgress += (mappedP - heroProgress) * 0.12;
            applyTransforms(heroProgress);
        }
        requestAnimationFrame(renderHero);
    }

    if (elLeft) {
        requestAnimationFrame(renderHero);
    }

    
    // --- Scroll Revealer (Vertora Animation Style) ---
    const revealElements = document.querySelectorAll('.stagger-reveal, .stagger-reveal-group');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                // Optional: stop observing once revealed for run-once animation
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Initially reveal anything already in viewport on load properly
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
                el.classList.add('is-revealed');
            }
        });
    }, 100);

    // --- Navbar Scroll Effect ---
    const nav = document.querySelector('.v-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- DNA Scanner Logic ---
    const runBtn = document.getElementById('run-diagnostic-btn');
    const scannerText = document.getElementById('scanner-text');
    const scanLine = document.querySelector('.scan-line');

    if(runBtn && scannerText) {
        const outcomes = [
            "<span style='color:#A37CFF'>ARCHITECT</span> <span style='color:#9CA3AF'>| Ecosystem Design</span>",
            "<span style='color:#A37CFF'>ANALYST</span> <span style='color:#9CA3AF'>| Tech Infrastructure</span>",
            "<span style='color:#A37CFF'>ARTISAN</span> <span style='color:#9CA3AF'>| Production & Assets</span>"
        ];
        
        runBtn.addEventListener('click', () => {
            if (runBtn.disabled) return;
            
            runBtn.disabled = true;
            runBtn.innerText = "Analyzing Traits...";
            if (scanLine) {
                scanLine.style.animation = "scan-vertical 1.2s linear infinite";
            }
            
            let ticks = 0;
            const maxTicks = 15;
            const interval = setInterval(() => {
                const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
                scannerText.innerHTML = `<span style="color:#9CA3AF">ANALYZING:</span> ${randomStr}<span class="block-cursor">_</span>`;
                ticks++;
                
                if (ticks >= maxTicks) {
                    clearInterval(interval);
                    
                    const finalOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                    scannerText.innerHTML = `<span style="color:#10B981">MATCH:</span> ${finalOutcome}`;
                    
                    if (scanLine) {
                        scanLine.style.animation = "none";
                        scanLine.style.top = "-100%";
                    }
                    
                    setTimeout(() => {
                        runBtn.disabled = false;
                        runBtn.innerText = "Restart Sequence";
                    }, 2000);
                }
            }, 100);
        });
    }

    // --- Opportunity Map Logic ---
    const economyFilter = document.getElementById('economy-filter');
    const dnaFilter = document.getElementById('dna-filter');
    const filterResult = document.getElementById('filter-result');
    const resultWrapper = document.getElementById('role-matching-result-container');

    if (economyFilter && dnaFilter) {
        const roleMap = {
            'creator_artisan': 'Asset Producer (Thumbnail Design, Vertical Editing)',
            'creator_analyst': 'Growth Engineer (Audience Retention, Brand Negotiator)',
            'creator_architect': 'Ecosystem Architect (SaaS Lead, IP Expansion)',
            'sports_artisan': 'Asset Producer (Sports Highlight Editor)',
            'sports_analyst': 'Performance Optimizer (Sponsorship ROI, Biometrics)',
            'sports_architect': 'Infrastructure Pioneer (Smart-Stadium Tech, Global Rights)',
            'tech_artisan': 'Frontend Builder',
            'tech_analyst': 'QA Analyst & Data Associate',
            'tech_architect': 'Backend Support Associate',
            'business_artisan': 'Client Success Executive',
            'business_analyst': 'Operations Analyst',
            'business_architect': 'Operations Architect',
            'design_artisan': 'Graphic Designer & Motion Graphic Editor',
            'design_analyst': 'UX Researcher',
            'design_architect': 'UI Assistant & Design Systems'
        };

        function updateOpportunityMap() {
            const eco = economyFilter.value;
            const dna = dnaFilter.value;
            if (eco && dna) {
                const key = `${eco}_${dna}`;
                const resultRole = roleMap[key] || "Cross-functional Operations Unit";
                
                filterResult.innerHTML = `
                    <p style="color: #fff; font-size: 1.1rem; margin-bottom: 8px;">
                        <strong>Top Match:</strong> <span style="color: #FACC15">${resultRole}</span>
                    </p>
                    <p style="color: #9CA3AF; font-size: 0.9rem;">Recommended Next Step: Take Masterclass</p>
                `;
                resultWrapper.classList.add('active');
            } else {
                resultWrapper.classList.remove('active');
                filterResult.innerHTML = `<p class="text-muted">Select both filters to see your career match...</p>`;
            }
        }

        economyFilter.addEventListener('change', updateOpportunityMap);
        dnaFilter.addEventListener('change', updateOpportunityMap);
    }

    // --- Dynamic Hover Effect for Industry Cards ---
    const industryCards = document.querySelectorAll('.v-ind-card');
    industryCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Create a subtle radial gradient at mouse position
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.06), rgba(28, 28, 36, 1) 40%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = 'var(--bg-card)';
        });
    });
});
