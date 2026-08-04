// ======================================
// CONFIGURATION & STATE
// ======================================
let allPosts = [];

// DOM Elements
const blogApp = document.getElementById('blogApp');
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');

// ======================================
// MOBILE MENU & STICKY HEADER
// ======================================
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Back to top & Header Scroll behavior
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Keep header scrolled state on blog
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        // We keep it scrolled by default on blog.html for layout consistency,
        // but this ensures scroll responsiveness.
        header.classList.add('scrolled');
    }

    // Back to top button visibility
    if (backToTop) {
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// Smooth Scroll to Top
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ======================================
// ROUTING SYSTEM (SPA)
// ======================================

// Initialize Blog App
async function initBlog() {
    try {
        showLoading(true);
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error('Não foi possível carregar as postagens.');
        allPosts = await response.json();
        
        // Listen to navigation events (Back/Forward browser buttons)
        window.addEventListener('popstate', handleRouting);
        
        // Initial route handling
        handleRouting();
    } catch (error) {
        console.error(error);
        renderError('Ocorreu um erro ao carregar o blog. Por favor, tente novamente mais tarde.');
    }
}

// Handle routing based on URL search query (?post=slug)
function handleRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');

    if (postSlug) {
        const post = allPosts.find(p => p.slug === postSlug);
        if (post) {
            renderArticle(post);
        } else {
            renderNotFound();
        }
    } else {
        renderPostList(allPosts);
    }
    
    // Smooth scroll to top on navigation change
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// Navigate programmatically without reload
function navigateTo(url) {
    window.history.pushState(null, '', url);
    handleRouting();
}

// Intercept links to keep SPA navigation
function bindDynamicLinks() {
    document.querySelectorAll('[data-link]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const href = el.getAttribute('href');
            navigateTo(href);
        });
    });
}

// ======================================
// RENDER VIEWS
// ======================================

function showLoading(show) {
    const loader = document.getElementById('loadingState');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// Render Blog List View
function renderPostList(posts) {
    showLoading(false);
    
    if (posts.length === 0) {
        blogApp.innerHTML = `
            <div class="blog-header">
                <span class="section-tag"><i class="fas fa-newspaper"></i> Blog Profissional</span>
                <h1 class="section-title">Blog & <span class="accent">Artigos</span></h1>
                <div class="title-line"></div>
                <p class="section-subtitle">Dicas, informativos e análises técnicas sobre Segurança do Trabalho e Meio Ambiente.</p>
            </div>
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <p>Nenhum artigo encontrado.</p>
            </div>
        `;
        return;
    }

    // Sort: latest post index 0
    const featuredPost = posts[0];
    const gridPosts = posts.slice(1);

    let htmlContent = `
        <div class="blog-header">
            <span class="section-tag"><i class="fas fa-newspaper"></i> Blog Profissional</span>
            <h1 class="section-title">Blog & <span class="accent">Artigos</span></h1>
            <div class="title-line"></div>
            <p class="section-subtitle">Informativos técnicos, novidades sobre legislação de SST e proteção ambiental.</p>
        </div>

        <!-- Post em Destaque -->
        <article class="featured-article animate-card-load">
            <div class="featured-image-wrapper">
                <span class="featured-badge">Último Post</span>
                <img src="${featuredPost.image}" alt="${featuredPost.title}" class="featured-image" loading="eager">
            </div>
            <div class="featured-content">
                <div class="post-meta">
                    <span class="post-category">${featuredPost.category}</span>
                    <span><i class="far fa-calendar"></i> ${featuredPost.date}</span>
                    <span><i class="far fa-clock"></i> ${featuredPost.readingTime}</span>
                </div>
                <h2><a href="blog.html?post=${featuredPost.slug}" data-link>${featuredPost.title}</a></h2>
                <p class="featured-excerpt">${featuredPost.excerpt}</p>
                <div>
                    <a href="blog.html?post=${featuredPost.slug}" class="btn btn-primary" data-link>
                        Ler Artigo <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </article>
    `;

    if (gridPosts.length > 0) {
        htmlContent += `
            <h2 class="articles-section-title">Outras Publicações</h2>
            <div class="articles-grid">
        `;

        gridPosts.forEach((post, index) => {
            const delay = index * 100; // staggered animation delay
            htmlContent += `
                <article class="article-card animate-card-load" style="animation-delay: ${delay}ms">
                    <div class="card-image-wrapper">
                        <img src="${post.image}" alt="${post.title}" class="card-image" loading="lazy">
                    </div>
                    <div class="card-content">
                        <div class="post-meta">
                            <span class="post-category">${post.category}</span>
                            <span><i class="far fa-calendar"></i> ${post.date}</span>
                        </div>
                        <h3><a href="blog.html?post=${post.slug}" data-link>${post.title}</a></h3>
                        <p class="card-excerpt">${post.excerpt}</p>
                        <div>
                            <a href="blog.html?post=${post.slug}" class="read-more-link" data-link>
                                Ler Artigo <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        });

        htmlContent += `</div>`;
    }

    blogApp.innerHTML = htmlContent;
    document.title = "Blog — Wlisses Silva | Segurança do Trabalho e Meio Ambiente";
    
    // Bind dynamic SPA links
    bindDynamicLinks();
}

// Render Single Article Reading View
function renderArticle(post) {
    showLoading(false);
    
    blogApp.innerHTML = `
        <div class="reading-view">
            <div class="back-btn-container">
                <button onclick="navigateTo('blog.html')" class="back-btn" id="backToBlogBtn">
                    <i class="fas fa-arrow-left"></i> Voltar para o Blog
                </button>
            </div>
            
            <article>
                <header class="article-header">
                    <div class="post-meta">
                        <span class="post-category">${post.category}</span>
                        <span><i class="far fa-calendar"></i> ${post.date}</span>
                        <span><i class="far fa-clock"></i> ${post.readingTime}</span>
                    </div>
                    <h1>${post.title}</h1>
                </header>

                <img src="${post.image}" alt="${post.title}" class="article-banner-image">

                <div class="article-body">
                    ${post.content}
                </div>
            </article>

            <!-- Autor Card -->
            <div class="author-box">
                <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                <div class="author-info">
                    <h4>${post.author.name}</h4>
                    <p>${post.author.role}</p>
                    <p class="author-bio">Profissional dedicado à promoção de ambientes de trabalho saudáveis, seguros e em conformidade legal nas regiões de Arapiraca, Girau do Ponciano e Alagoas.</p>
                </div>
            </div>
        </div>
    `;

    document.title = `${post.title} — Blog | Wlisses Silva`;
    
    // Bind the back button click manually to leverage SPA navigation
    const backBtn = document.getElementById('backToBlogBtn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('blog.html');
        });
    }
}

// Render 404 View
function renderNotFound() {
    showLoading(false);
    blogApp.innerHTML = `
        <div style="text-align: center; padding: 80px 24px; color: var(--text-secondary);">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--accent); margin-bottom: 20px;"></i>
            <h1 style="color: var(--text-primary); margin-bottom: 12px; font-family: var(--font-heading);">Artigo Não Encontrado</h1>
            <p style="margin-bottom: 30px;">O artigo que você está procurando não existe ou foi removido.</p>
            <button onclick="navigateTo('blog.html')" class="btn btn-primary">
                <i class="fas fa-home"></i> Voltar ao Blog
            </button>
        </div>
    `;
}

// Render Global Error View
function renderError(message) {
    showLoading(false);
    blogApp.innerHTML = `
        <div style="text-align: center; padding: 80px 24px; color: var(--text-secondary);">
            <i class="fas fa-circle-exclamation" style="font-size: 3rem; color: var(--accent); margin-bottom: 20px;"></i>
            <h1 style="color: var(--text-primary); margin-bottom: 12px; font-family: var(--font-heading);">Ops! Algo deu errado</h1>
            <p style="margin-bottom: 30px;">${message}</p>
            <a href="index.html" class="btn btn-primary">Voltar à Página Inicial</a>
        </div>
    `;
}

// ======================================
// APP RUN
// ======================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
} else {
    initBlog();
}
