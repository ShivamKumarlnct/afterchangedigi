/* =========================================
   1. THREE.JS 3D BACKGROUND ANIMATION
   ========================================= */
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

function init3D() {
    // --- SETUP CONTAINER ---
    let container = document.getElementById('canvas-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'canvas-container';
        document.body.prepend(container);
    }

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.002); // White fog for clean look

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- OBJECT 1: MAIN GEOMETRIC SHAPE (Icosahedron) ---
    const geometry = new THREE.IcosahedronGeometry(2.2, 0);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x5d2e8e, // Brand Purple
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const mainMesh = new THREE.Mesh(geometry, material);
    scene.add(mainMesh);

    // --- OBJECT 2: PARTICLE STARFIELD ---
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 1200;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 25; 
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xff7f50, // Brand Orange
        transparent: true,
        opacity: 0.8,
    });
    
    const starMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(starMesh);

    // --- MOUSE INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Rotate Main Mesh
        mainMesh.rotation.y += 0.005;
        mainMesh.rotation.x += 0.002;

        // Rotate Stars
        starMesh.rotation.y = -elapsedTime * 0.05;

        // Mouse Parallax
        mainMesh.rotation.y += 0.05 * (targetX - mainMesh.rotation.y);
        mainMesh.rotation.x += 0.05 * (targetY - mainMesh.rotation.x);

        // Floating Motion
        mainMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

        renderer.render(scene, camera);
    }

    animate();

    // --- RESIZE HANDLER ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Start 3D
init3D();


/* =========================================
   2. NAVIGATION LOGIC
   ========================================= */
// Note: We attach these to 'window' so HTML onclick="" works with type="module"

window.showPage = function(pageId) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden-section');
    });

    // Ensure we reset single blog view if leaving blog area
    const blogSingle = document.getElementById('blog-single');
    if (blogSingle && pageId !== 'blog') {
        blogSingle.classList.add('hidden-section');
        blogSingle.classList.remove('active-section');
    }

    // Show target section
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.remove('hidden-section');
        targetSection.classList.add('active-section');
    }

    // Mobile Menu cleanup
    const navLinks = document.getElementById('navLinks');
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.toggleMenu = function() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
};

window.toggleMobileDropdown = function(event) {
    if (window.innerWidth <= 768) {
        event.preventDefault();
        const dropdownMenu = document.getElementById('servicesDropdown');
        if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        } else {
            dropdownMenu.style.display = 'block';
        }
    }
};
// Select all cards
const cards = document.querySelectorAll('.service-card, .testimonial-card, .value-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation (Max 15 degrees)
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;

        // Apply 3D Transform
        // scale3d(1.05) zooms the card slightly when hovering
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    // Reset when mouse leaves
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

/* =========================================
   3. BLOG DATA (50 Items)
   ========================================= */
const blogPosts = [
    // SEO (Orange Theme)
    { title: "The Future of SEO in 2025", category: "SEO", date: "Jan 20, 2025", color: "orange", image: "https://images.unsplash.com/photo-1572021335469-3157207b7000?auto=format&fit=crop&w=600&q=80", desc: "AI and voice search are redefining how we rank. Learn the new strategies." },
    { title: "Local SEO: Dominating Varanasi", category: "SEO", date: "Jan 18, 2025", color: "orange", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", desc: "How to rank your business in local map packs and get more foot traffic." },
    { title: "Backlinks vs. Content", category: "SEO", date: "Jan 15, 2025", color: "orange", image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=600&q=80", desc: "Which is more important for ranking in Google? The answer might surprise you." },
    { title: "Technical SEO Checklist", category: "SEO", date: "Jan 12, 2025", color: "orange", image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80", desc: "Ensure your site is crawlable and indexable with this technical guide." },
    { title: "Voice Search Optimization", category: "SEO", date: "Jan 10, 2025", color: "orange", image: "https://images.unsplash.com/photo-1589254065878-42c9daf97008?auto=format&fit=crop&w=600&q=80", desc: "Optimizing for Alexa, Siri, and Google Assistant is no longer optional." },
    { title: "Mobile-First Indexing", category: "SEO", date: "Jan 08, 2025", color: "orange", image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=600&q=80", desc: "Why your mobile site matters more than desktop for Google ranking." },
    { title: "Keyword Research Tools", category: "SEO", date: "Jan 05, 2025", color: "orange", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", desc: "Top 5 free tools to find high-volume keywords with low competition." },
    { title: "SEO for E-commerce", category: "SEO", date: "Jan 02, 2025", color: "orange", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80", desc: "Driving sales through organic search traffic for online stores." },
    { title: "Core Web Vitals Guide", category: "SEO", date: "Dec 28, 2024", color: "orange", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", desc: "Improving LCP, FID, and CLS for better rankings." },
    { title: "Google Algorithm Updates", category: "SEO", date: "Dec 25, 2024", color: "orange", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", desc: "How to survive the latest core updates." },

    // Social Media (Blue Theme)
    { title: "Instagram Reels Strategy", category: "Social Media", date: "Dec 22, 2024", color: "blue", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80", desc: "How to go viral with short-form video content on Instagram." },
    { title: "LinkedIn for B2B Leads", category: "Social Media", date: "Dec 20, 2024", color: "blue", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=600&q=80", desc: "Turning connections into high-paying clients on LinkedIn." },
    { title: "Facebook Ads vs. Boost", category: "Social Media", date: "Dec 18, 2024", color: "blue", image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=600&q=80", desc: "Stop boosting posts; start running professional ad campaigns." },
    { title: "Influencer Marketing 101", category: "Social Media", date: "Dec 15, 2024", color: "blue", image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=600&q=80", desc: "How to choose the right influencer for your brand without wasting money." },
    { title: "Social Media Calendar", category: "Social Media", date: "Dec 12, 2024", color: "blue", image: "https://images.unsplash.com/photo-1506784983877-45594fa4c5c3?auto=format&fit=crop&w=600&q=80", desc: "Plan a month of content in just one hour with this template." },
    { title: "Twitter (X) for Business", category: "Social Media", date: "Dec 10, 2024", color: "blue", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=600&q=80", desc: "Is X still relevant for marketing in 2025?" },
    { title: "YouTube Shorts Growth", category: "Social Media", date: "Dec 08, 2024", color: "blue", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80", desc: "Leveraging YouTube's algorithm for quick growth." },
    { title: "Community Management", category: "Social Media", date: "Dec 05, 2024", color: "blue", image: "https://images.unsplash.com/photo-1529236183278-96038939865d?auto=format&fit=crop&w=600&q=80", desc: "Building a loyal tribe around your brand." },
    { title: "User Generated Content", category: "Social Media", date: "Dec 02, 2024", color: "blue", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80", desc: "Why UGC converts better than professional ads." },
    { title: "Social Media Trends 2025", category: "Social Media", date: "Nov 30, 2024", color: "blue", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80", desc: "What's next for social media platforms?" },

    // PPC (Purple Theme)
    { title: "Maximizing ROAS", category: "PPC Ads", date: "Nov 28, 2024", color: "purple", image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80", desc: "Get more revenue for every rupee spent on ads." },
    { title: "Google Ads Bidding", category: "PPC Ads", date: "Nov 25, 2024", color: "purple", image: "https://images.unsplash.com/photo-1590212151175-e5879610801b?auto=format&fit=crop&w=600&q=80", desc: "Manual vs. Automated bidding strategies explained." },
    { title: "Retargeting Magic", category: "PPC Ads", date: "Nov 22, 2024", color: "purple", image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80", desc: "Bringing back visitors who didn't buy." },
    { title: "Copywriting for Ads", category: "PPC Ads", date: "Nov 20, 2024", color: "purple", image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=600&q=80", desc: "Writing headlines that get high CTR." },
    { title: "Landing Page Optimization", category: "PPC Ads", date: "Nov 18, 2024", color: "purple", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", desc: "Why your ads get clicks but no sales." },
    { title: "Competitor Analysis", category: "PPC Ads", date: "Nov 15, 2024", color: "purple", image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80", desc: "Spying on your competitors' ad strategies." },
    { title: "YouTube Video Ads", category: "PPC Ads", date: "Nov 12, 2024", color: "purple", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80", desc: "Cheaper and more effective than you think." },
    { title: "Performance Max Campaigns", category: "PPC Ads", date: "Nov 10, 2024", color: "purple", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", desc: "Mastering Google's AI-driven ad format." },
    { title: "A/B Testing Guide", category: "PPC Ads", date: "Nov 08, 2024", color: "purple", image: "https://images.unsplash.com/photo-1507238691940-0db597a92b83?auto=format&fit=crop&w=600&q=80", desc: "The scientific way to improve ad performance." },
    { title: "PPC for Small Business", category: "PPC Ads", date: "Nov 05, 2024", color: "purple", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80", desc: "Budget-friendly ad strategies for startups." },

    // Web Dev (Green Theme)
    { title: "WordPress vs. Coding", category: "Web Dev", date: "Nov 02, 2024", color: "green", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80", desc: "Which platform is right for your business?" },
    { title: "Website Speed Optimization", category: "Web Dev", date: "Oct 30, 2024", color: "green", image: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=600&q=80", desc: "Loading in under 2 seconds keeps users happy." },
    { title: "UI/UX Best Practices", category: "Web Dev", date: "Oct 28, 2024", color: "green", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80", desc: "Designing for the user, not just for looks." },
    { title: "Responsive Design", category: "Web Dev", date: "Oct 25, 2024", color: "green", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", desc: "Ensuring your site looks good on all devices." },
    { title: "E-commerce Security", category: "Web Dev", date: "Oct 22, 2024", color: "green", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80", desc: "Protecting your customer data and payments." },
    { title: "Web Accessibility (A11y)", category: "Web Dev", date: "Oct 20, 2024", color: "green", image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=600&q=80", desc: "Making your website usable for everyone." },
    { title: "Selecting a Hosting Provider", category: "Web Dev", date: "Oct 18, 2024", color: "green", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80", desc: "Why cheap hosting costs you more in the long run." },
    { title: "The Power of Landing Pages", category: "Web Dev", date: "Oct 15, 2024", color: "green", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80", desc: "Stripping away distractions to focus on sales." },
    { title: "JavaScript Frameworks", category: "Web Dev", date: "Oct 12, 2024", color: "green", image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=600&q=80", desc: "React, Vue, or Angular: What to choose?" },
    { title: "Website Maintenance", category: "Web Dev", date: "Oct 10, 2024", color: "green", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80", desc: "Why regular updates prevent hacking." },

    // Design & Content (Red Theme)
    { title: "Color Psychology", category: "Design", date: "Oct 08, 2024", color: "red", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=600&q=80", desc: "How colors influence purchasing decisions." },
    { title: "Typography Trends", category: "Design", date: "Oct 05, 2024", color: "red", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80", desc: "Choosing the right font for your brand voice." },
    { title: "Logo Design Basics", category: "Design", date: "Oct 02, 2024", color: "red", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80", desc: "What makes a memorable logo?" },
    { title: "Canva vs. Photoshop", category: "Design", date: "Sep 30, 2024", color: "red", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80", desc: "Do you really need expensive software?" },
    { title: "Visual Hierarchy", category: "Design", date: "Sep 28, 2024", color: "red", image: "https://images.unsplash.com/photo-1507238691940-0db597a92b83?auto=format&fit=crop&w=600&q=80", desc: "Guiding the user's eye to the call to action." },
    { title: "Blogging for Business", category: "Content", date: "Sep 25, 2024", color: "red", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80", desc: "Why a blog is your best salesperson." },
    { title: "Email Marketing Funnels", category: "Content", date: "Sep 22, 2024", color: "red", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80", desc: "Nurturing leads from cold to sold." },
    { title: "Video Content Strategy", category: "Content", date: "Sep 20, 2024", color: "red", image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80", desc: "Why video is consuming the internet." },
    { title: "Podcasting for Brands", category: "Content", date: "Sep 18, 2024", color: "red", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80", desc: "Building authority through audio content." },
    { title: "The Art of Storytelling", category: "Content", date: "Sep 15, 2024", color: "red", image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=600&q=80", desc: "Connecting emotionally with your audience." }
];


/* =========================================
   4. DYNAMIC BLOG RENDERER
   ========================================= */

// Generate Single Post HTML
function generateArticleContent(title, category) {
    return `
        <p class="lead" style="font-size: 20px; color: #333; margin-bottom: 30px;">
            <strong>${title}</strong> is one of the most critical aspects of digital success in today's market. Whether you are a small business in Varanasi or a global brand, understanding this concept is key to sustainable growth.
        </p>
        
        <h2>Why ${title} Matters for Your Business?</h2>
        <p>In the fast-paced world of ${category}, staying ahead of the curve is essential. We have seen many businesses fail simply because they ignored the fundamentals of <strong>${title}</strong>. It directly affects how customers perceive your brand and impacts your bottom line revenue.</p>
        
        <div class="blog-highlight">
            "The key to success in Digital Marketing is not just execution, but understanding the strategy behind ${title}. It's about connecting with humans, not just algorithms." - Adarsh Arya
        </div>

        <h3>Key Benefits of Mastering This:</h3>
        <ul>
            <li><strong>Increased Visibility:</strong> Proper implementation ensures you are seen by the right audience at the right time.</li>
            <li><strong>Higher Engagement:</strong> Content tailored around this topic resonates better with users, leading to more likes, shares, and comments.</li>
            <li><strong>Better ROI:</strong> Efficient strategies lead to lower costs and higher returns on your marketing investment.</li>
        </ul>

        <h2>How to Implement This Strategy</h2>
        <p>Start by analyzing your current performance. Are you currently leveraging ${title}? If not, it is time to create a roadmap. At <strong>The Digibazzar</strong>, we recommend a three-step approach: Analyze, Optimize, and Scale.</p>
        
        <h3>1. The Analysis Phase</h3>
        <p>Look at your data. What does it tell you? Without data, you are just guessing. Use tools like Google Analytics or Search Console.</p>

        <h3>2. Optimization</h3>
        <p>Once you have the data, refine your approach. This might mean tweaking your keywords, adjusting your ad spend, or redesigning your graphics.</p>

        <h2>Conclusion</h2>
        <p>Mastering <strong>${title}</strong> is a journey, not a destination. Keep testing, keep learning, and keep growing. If you need expert help, The Digibazzar is always here to assist you in Varanasi.</p>
    `;
}

// Render Grid
let itemsPerPage = 9;
let currentPage = 1;

window.renderBlogs = function() {
    const container = document.getElementById('blog-grid-container');
    const loadBtn = document.getElementById('load-more-btn');
    
    if (!container) return;

    const end = currentPage * itemsPerPage;
    container.innerHTML = ''; 

    const postsToShow = blogPosts.slice(0, end);

    postsToShow.forEach((post, index) => {
        const imgUrl = post.image;
        
        const cardHTML = `
            <div class="blog-card" onclick="openBlogPost(${index})">
                <div class="blog-img-box">
                    <img src="${imgUrl}" alt="${post.title}">
                    <span class="blog-category" style="background-color: var(--brand-${post.color === 'purple' ? 'purple' : post.color === 'orange' ? 'orange' : post.color === 'blue' ? 'blue' : post.color === 'green' ? 'green' : 'red'})">${post.category}</span>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.desc}</p>
                    <a href="javascript:void(0)" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    if (end >= blogPosts.length && loadBtn) {
        loadBtn.classList.add('hidden-btn');
    }
};

window.loadMoreBlogs = function() {
    currentPage++;
    window.renderBlogs();
};


/* =========================================
   5. SINGLE POST LOGIC
   ========================================= */

window.openBlogPost = function(index) {
    const post = blogPosts[index];
    
    // Populate Header
    document.getElementById('single-post-title').innerText = post.title;
    document.getElementById('single-post-category').innerText = post.category;
    document.getElementById('single-post-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${post.date}`;
    
    // Set Hero Image (Higher Res)
    const heroImgUrl = post.image.replace('w=600', 'w=1200');
    document.getElementById('single-post-img').src = heroImgUrl;
    
    // Generate Content
    document.getElementById('single-post-body').innerHTML = generateArticleContent(post.title, post.category);

    // Switch Views
    document.getElementById('blog').classList.add('hidden-section');
    document.getElementById('blog').classList.remove('active-section');
    
    const singlePage = document.getElementById('blog-single');
    singlePage.classList.remove('hidden-section');
    singlePage.classList.add('active-section');

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.closeBlogPost = function() {
    const singlePage = document.getElementById('blog-single');
    singlePage.classList.remove('active-section');
    singlePage.classList.add('hidden-section');

    const blogPage = document.getElementById('blog');
    blogPage.classList.remove('hidden-section');
    blogPage.classList.add('active-section');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.handleCommentSubmit = function(event) {
    event.preventDefault(); 
    
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = "Posting...";
    btn.style.opacity = "0.7";

    setTimeout(() => {
        alert("Thank you! Your feedback has been submitted successfully.");
        event.target.reset();
        btn.innerText = originalText;
        btn.style.opacity = "1";
    }, 1500);
};


/* =========================================
   6. INITIALIZATION & SCROLL ANIMATION
   ========================================= */

// Scroll Reveal Observer
const observerOptions = {
    threshold: 0.1, 
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Render initial blogs
    window.renderBlogs();

    // 3D Tilt Effect for Hero
    const heroSection = document.querySelector('.hero');
    const tiltContainer = document.getElementById('hero-tilt-container');

    if (heroSection && tiltContainer) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = y * -0.03; 
            const rotateY = x * 0.03;
            tiltContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            tiltContainer.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }

    // Initialize Scroll Animations
    setTimeout(() => {
        const elementsToAnimate = document.querySelectorAll('.service-card, .hero-text, .section-padding h2, .col-half');
        elementsToAnimate.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 0.8s ease-out";
            observer.observe(el);
        });
    }, 100);
});
document.addEventListener("DOMContentLoaded", function() {
    const adCard = document.getElementById('ad-card-overlay');
    
    // 1. Show the ad 1 second after site load
    setTimeout(() => {
        adCard.classList.add('active-ad');
        
        // 2. Hide the ad automatically after 5 seconds
        setTimeout(() => {
            closeAdCard();
        }, 5000); 
        
    }, 1000);
});

// Function to close ad manually or automatically
function closeAdCard() {
    const adCard = document.getElementById('ad-card-overlay');
    if(adCard) {
        adCard.classList.remove('active-ad');
    }
}
// contact form submission

