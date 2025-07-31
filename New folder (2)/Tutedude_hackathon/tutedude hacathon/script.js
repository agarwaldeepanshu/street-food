document.addEventListener('DOMContentLoaded', () => {

    const allPages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');

    // --- Page Navigation ---
    function showPage(pageId) {
        // Hide all pages
        allPages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0); // Scroll to top on page change
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            let targetId = link.getAttribute('href')?.substring(1);
            
            // For login/signup buttons that go to dashboards
            if (link.dataset.target) {
                targetId = link.dataset.target;
            }

            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                showPage(targetId);
            }
        });
    });
    
    // Show initial page based on URL hash or default to landing page
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        showPage(initialHash);
    } else {
        showPage('landing-page');
    }

    // --- Dashboard-specific Navigation ---
    function setupDashboardNav(dashboardId) {
        const dashboard = document.getElementById(dashboardId);
        if (!dashboard) return;

        const dashNavLinks = dashboard.querySelectorAll('.dash-nav-link');
        const dashPages = dashboard.querySelectorAll('.dashboard-page');

        dashNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);

                // Update active link in sidebar
                dashNavLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Show target page content
                dashPages.forEach(p => p.classList.remove('active'));
                const targetContent = dashboard.querySelector(`#${targetId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    setupDashboardNav('dashboard-vendor');
    setupDashboardNav('dashboard-supplier');
    
    // --- Modal Logic --- (Remains the same)
});