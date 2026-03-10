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

    elementsToAnimate.forEach(el => observer.observe(el));

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

    // DNA Quiz Logic
    const quizOptions = document.querySelectorAll('.action-option');
    const quizResult = document.getElementById('quiz-result');
    quizOptions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dna = e.target.getAttribute('data-dna');
            quizResult.style.display = 'block';
            quizResult.innerHTML = `Your Super Me Profile: <strong>The Strategic ${dna}</strong><br>
                                    <span style="color:var(--text-light-muted); font-size: 0.9em; font-weight:normal;">Primary Strand: 75% ${dna} | Recommended Starting Echelon: Echelon 1 with fast-track bridge.</span>`;

            // visually deselect others
            quizOptions.forEach(opt => opt.style.opacity = '0.5');
            e.target.style.opacity = '1';
            e.target.style.background = 'var(--primary-purple)';
            e.target.style.color = 'white';
        });
    });

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
        'sports_artisan': 'Echelon 1: Asset Producer (Sports Highlight Editor)'
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
