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
            nav.style.padding = "8px 24px";
            nav.style.background = "rgba(255, 255, 255, 0.85)";
        } else {
            nav.style.padding = "12px 24px";
            nav.style.background = "rgba(255, 255, 255, 0.6)";
        }
    });

    // DNA Scanner Logic
    const runBtn = document.getElementById('run-diagnostic-btn');
    const scannerText = document.getElementById('scanner-text');
    const scanLine = document.querySelector('.scan-line');

    if(runBtn && scannerText) {
        const outcomes = [
            "<span style='color: #FCD34D'>ARCHITECT</span> | Ecosystem Design",
            "<span style='color: #60A5FA'>ANALYST</span> | Tech Infrastructure",
            "<span style='color: #A78BFA'>ARTISAN</span> | Production & Assets",
            "<span style='color: #F472B6'>CATALYST</span> | Sales & Community"
        ];
        
        runBtn.addEventListener('click', () => {
            if (runBtn.disabled) return;
            runBtn.disabled = true;
            runBtn.innerText = "Scanning...";
            scanLine.style.animation = "scan-vertical 1.2s linear infinite";
            
            let ticks = 0;
            const maxTicks = 25;
            const interval = setInterval(() => {
                const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
                scannerText.innerText = `ANALYZING: ${randomStr}`;
                scannerText.style.color = "#9CA3AF";
                ticks++;
                
                if (ticks >= maxTicks) {
                    clearInterval(interval);
                    const finalOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                    scannerText.innerHTML = `MATCH: ${finalOutcome}`;
                    scannerText.style.color = "#10B981";
                    runBtn.innerText = "Diagnostic Complete";
                    scanLine.style.animation = "none";
                    scanLine.style.top = "-100%";
                    setTimeout(() => {
                        runBtn.disabled = false;
                        runBtn.innerText = "Restart Sequence";
                    }, 4000);
                }
            }, 60);
        });
    }

    // Opportunity Map Logic
    const economyFilter = document.getElementById('economy-filter');
    const dnaFilter = document.getElementById('dna-filter');
    const filterResult = document.getElementById('filter-result');

    const roleMap = {
        'creator_artisan': 'Echelon 1: Asset Producer (Thumbnail Design, Vertical Editing)',
        'creator_analyst': 'Echelon 2: Growth Engineer (Audience Retention, Brand Negotiator)',
        'creator_architect': 'Echelon 3: Ecosystem Architect (SaaS Lead, IP Expansion)',
        'creator_catalyst': 'Echelon 1: Community Moderation / Sales',
        'sports_catalyst': 'Echelon 1: Engagement Unit (Game-day Social, Fan Experience)',
        'sports_analyst': 'Echelon 2: Performance Optimizer (Sponsorship ROI, Biometrics)',
        'sports_architect': 'Echelon 3: Infrastructure Pioneer (Smart-Stadium Tech, Global Rights)',
        'sports_artisan': 'Echelon 1: Asset Producer (Sports Highlight Editor)',
        'tech_artisan': 'Echelon 1: Frontend Builder',
        'tech_analyst': 'Echelon 2: QA Analyst & Data Associate',
        'tech_architect': 'Echelon 3: Backend Support Associate',
        'tech_catalyst': 'Echelon 1: Tech Growth & Support',
        'business_catalyst': 'Echelon 1: Sales Associate & Growth Coordinator',
        'business_analyst': 'Echelon 2: Operations Analyst',
        'business_artisan': 'Echelon 1: Client Success Executive',
        'business_architect': 'Echelon 3: Operations Architect',
        'design_artisan': 'Echelon 1: Graphic Designer & Motion Graphic Editor',
        'design_catalyst': 'Echelon 2: Brand Asset Creator',
        'design_architect': 'Echelon 3: UI Assistant & Design Systems',
        'design_analyst': 'Echelon 2: UX Researcher'
    };

    function updateOpportunityMap() {
        const eco = economyFilter.value;
        const dna = dnaFilter.value;
        if (eco && dna) {
            const key = `${eco}_${dna}`;
            const resultRole = roleMap[key] || "Echelon 1: Cross-functional Unit";
            filterResult.style.display = 'block';
            filterResult.innerHTML = `<strong>Top Match:</strong> <span style="color: var(--primary-yellow)">${resultRole}</span><br>
                                      <span style="font-size:0.85em; color:var(--text-light-muted);">Precision Module required: Available</span>`;
        } else {
            filterResult.style.display = 'none';
        }
    }

    economyFilter.addEventListener('change', updateOpportunityMap);
    dnaFilter.addEventListener('change', updateOpportunityMap);
});
