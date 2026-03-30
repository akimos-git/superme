document.addEventListener("DOMContentLoaded", () => {
    // Scroll animations inspired by Decagon
    const elementsToAnimate = document.querySelectorAll('.bento-cell, .vertical-card, .feature-row .text-block, .feature-row .graphic-block, .sms-stat');

    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional delay based on dom order for staggered effects
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    // Ensure all elements with .animate-on-scroll are observed
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Nav pill minimize on scroll
    const nav = document.querySelector('.pill-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // DNA Scanner Logic
    const runBtn = document.getElementById('run-diagnostic-btn');
    const scannerText = document.getElementById('scanner-text');
    const scanLine = document.querySelector('.scan-line');

    if(runBtn && scannerText) {
        const outcomes = [
            "<span class='match-purple'>ARCHITECT</span><span class='match-green'>| Ecosystem Design</span>",
            "<span class='match-purple'>ANALYST</span><span class='match-green'>| Tech Infrastructure</span>",
            "<span class='match-purple'>ARTISAN</span><span class='match-green'>| Production & Assets</span>"
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
                scannerText.innerHTML = `<span class="match-label">ANALYZING:</span>${randomStr}<span class="block-cursor"></span>`;
                scannerText.style.color = "#9CA3AF";
                ticks++;
                
                if (ticks >= maxTicks) {
                    clearInterval(interval);
                    
                    const finalOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                    scannerText.innerHTML = `<span class="match-label">MATCH:</span>${finalOutcome}<span class="block-cursor"></span>`;
                    scannerText.style.color = "#10B981";
                    
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

    // Opportunity Map Logic
    const economyFilter = document.getElementById('economy-filter');
    const dnaFilter = document.getElementById('dna-filter');
    const filterResult = document.getElementById('filter-result');

    if (economyFilter && dnaFilter) {
        const roleMap = {
            'creator_artisan': 'Asset Producer (Thumbnail Design, Vertical Editing)',
            'creator_analyst': 'Growth Engineer (Audience Retention, Brand Negotiator)',
            'creator_architect': 'Ecosystem Architect (SaaS Lead, IP Expansion)',
            'creator_catalyst': 'Community Moderation / Sales',
            'sports_artisan': 'Asset Producer (Sports Highlight Editor)',
            'sports_analyst': 'Performance Optimizer (Sponsorship ROI, Biometrics)',
            'sports_architect': 'Infrastructure Pioneer (Smart-Stadium Tech, Global Rights)',
            'sports_catalyst': 'Engagement Unit (Game-day Social, Fan Experience)',
            'tech_artisan': 'Frontend Builder',
            'tech_analyst': 'QA Analyst & Data Associate',
            'tech_architect': 'Backend Support Associate',
            'tech_catalyst': 'Tech Growth & Support',
            'business_artisan': 'Client Success Executive',
            'business_analyst': 'Operations Analyst',
            'business_architect': 'Operations Architect',
            'business_catalyst': 'Sales Associate & Growth Coordinator',
            'design_artisan': 'Graphic Designer & Motion Graphic Editor',
            'design_analyst': 'UX Researcher',
            'design_architect': 'UI Assistant & Design Systems',
            'design_catalyst': 'Brand Asset Creator',
            // Entertainment
            'entertainment_artisan': 'Film & Audio Editor',
            'entertainment_analyst': 'Streaming Analyst',
            'entertainment_architect': 'Executive Producer',
            'entertainment_catalyst': 'Talent Agent & Promoter',
            // Green
            'green_artisan': 'Renewable Component Technician',
            'green_analyst': 'Sustainability Auditor',
            'green_architect': 'Eco-System Planner',
            'green_catalyst': 'Climate Advocate & Partnerships',
            // Healthcare
            'health_artisan': 'Medical Technician & Care Pro',
            'health_analyst': 'Health Data & Outcomes Analyst',
            'health_architect': 'Healthcare Systems Director',
            'health_catalyst': 'Patient Care Coordinator',
            // Education
            'edu_artisan': 'Curriculum Developer',
            'edu_analyst': 'EdTech Outcomes Researcher',
            'edu_architect': 'Learning Platform Founder',
            'edu_catalyst': 'Student Success Coach',
            // Finance
            'finance_artisan': 'Financial Modeler',
            'finance_analyst': 'Quantitative Analyst',
            'finance_architect': 'DeFi Protocol Architect',
            'finance_catalyst': 'Broker & Investor Relations',
            // Hospitality
            'hospitality_artisan': 'Event & Culinary Execution',
            'hospitality_analyst': 'Yield & Pricing Manager',
            'hospitality_architect': 'Experience Designer',
            'hospitality_catalyst': 'Guest Relations Director',
            // Deep Tech
            'deeptech_artisan': 'Robotics Prototyper',
            'deeptech_analyst': 'AI Safety Researcher',
            'deeptech_architect': 'Machine Learning Architect',
            'deeptech_catalyst': 'Tech Evangelist'
        };

        function updateOpportunityMap() {
            const eco = economyFilter.value;
            const dna = dnaFilter.value;
            if (eco && dna) {
                const key = `${eco}_${dna}`;
                const resultRole = roleMap[key] || "Cross-functional Unit";
                
                // Animate to visible
                const wrapper = document.getElementById('role-matching-result-container');
                filterResult.innerHTML = `
                    <div class="result-content-inner">
                        <p class="match-title"><strong>Top Match:</strong> <span class="highlight">${resultRole}</span></p>
                        <p class="next-step-hint">Recommended Next Step: Take Masterclass</p>
                    </div>
                `;
                wrapper.classList.add('active');
            } else {
                const wrapper = document.getElementById('role-matching-result-container');
                wrapper.classList.remove('active');
            }
        }

        economyFilter.addEventListener('change', updateOpportunityMap);
        dnaFilter.addEventListener('change', updateOpportunityMap);
    }

    // Dynamic Magnetic, 3D Tilt, and Ripple Effects for Buttons
    const dynamicButtons = document.querySelectorAll('.btn, .bento-btn');
    dynamicButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transition = 'transform 0.1s ease-out';
            // Magnetic pull and slight 3D tilt
            btn.style.transform = `perspective(500px) translate(${x * 0.15}px, ${y * 0.15}px) rotateX(${-y * 0.1}deg) rotateY(${x * 0.1}deg) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            btn.style.transform = 'perspective(500px) translate(0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
        
        // Ripple effect on click
        btn.addEventListener('click', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            ripple.style.pointerEvents = 'none';
            ripple.style.borderRadius = '50%';
            ripple.style.animation = 'btn-ripple-effect 0.6s linear';
            
            // Ensure button can contain the ripple
            if(getComputedStyle(btn).position === 'static') {
                btn.style.position = 'relative';
            }
            btn.style.overflow = 'hidden';
            
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

