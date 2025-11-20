// Main JavaScript for Intentionally At Home Life
// Uses a static BLOG_POSTS array from posts-data.js (no backend).

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', function () {
  renderPosts();
  setupFilters();
  setupDropdown();
  setupNewsletterForm();
});

// Render posts to the grid on the homepage
function renderPosts() {
  const grid = document.getElementById('posts-grid');
  const loading = document.getElementById('loading');
  const noPosts = document.getElementById('no-posts');

  if (!grid) return;

  if (loading) loading.style.display = 'none';
  grid.innerHTML = '';

  const posts = getFilteredPosts();

  if (!posts || posts.length === 0) {
    if (noPosts) noPosts.style.display = 'block';
    return;
  }

  if (noPosts) noPosts.style.display = 'none';

  const sorted = posts.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  sorted.forEach(function (post) {
    grid.appendChild(createPostCard(post));
  });
}

function getFilteredPosts() {
  if (!Array.isArray(window.BLOG_POSTS)) return [];
  if (currentCategory === 'all') return window.BLOG_POSTS;
  return window.BLOG_POSTS.filter(function (post) {
    return post.category === currentCategory;
  });
}

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';

  const slug = encodeURIComponent(post.slug);
  const linkHref = 'post.html?slug=' + slug;

  const heroImageHtml = post.heroImage
    ? '<div class="post-card-image-wrap"><img src="' +
      post.heroImage +
      '" alt="' +
      escapeHtml(post.title) +
      '" class="post-card-image"></div>'
    : '';

  const readTimeText = post.readTime ? ' · ' + post.readTime : '';

  article.innerHTML =
    '<a href="' +
    linkHref +
    '" class="post-card-link">' +
    heroImageHtml +
    '<div class="post-card-content">' +
    '<span class="post-card-category">' +
    escapeHtml(post.category || '') +
    '</span>' +
    '<h2 class="post-card-title">' +
    escapeHtml(post.title || '') +
    '</h2>' +
    '<p class="post-card-meta">' +
    formatDate(post.date) +
    readTimeText +
    '</p>' +
    (post.excerpt
      ? '<p class="post-card-excerpt">' + escapeHtml(post.excerpt) + '</p>'
      : '') +
    '</div>' +
    '</a>';

  return article;
}

// Setup filter buttons and category links
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const category = btn.getAttribute('data-category') || 'all';
      currentCategory = category;
      updateFilterButtonState(filterButtons, category);
      renderPosts();
    });
  });

  // Dropdown links
  const dropdownLinks = document.querySelectorAll('.dropdown-menu a[data-category]');
  dropdownLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const category = link.getAttribute('data-category') || 'all';
      currentCategory = category;
      updateFilterButtonState(filterButtons, category);
      renderPosts();
    });
  });

  // Footer category links
  const footerLinks = document.querySelectorAll('.footer-section a[data-category]');
  footerLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const category = link.getAttribute('data-category') || 'all';
      currentCategory = category;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateFilterButtonState(filterButtons, category);
      renderPosts();
    });
  });
}

function updateFilterButtonState(buttons, activeCategory) {
  buttons.forEach(function (btn) {
    const btnCategory = btn.getAttribute('data-category') || 'all';
    if (btnCategory === activeCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Dropdown toggle for categories (works on mobile + desktop)
function setupDropdown() {
  const categoryToggle = document.querySelector('.category-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (!categoryToggle || !dropdownMenu) return;

  categoryToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = !dropdownMenu.classList.contains('open');
    dropdownMenu.classList.toggle('open', isOpen);
    dropdownMenu.style.display = isOpen ? 'block' : 'none';
  });

  document.addEventListener('click', function (e) {
    if (!dropdownMenu.contains(e.target) && !categoryToggle.contains(e.target)) {
      dropdownMenu.classList.remove('open');
      dropdownMenu.style.display = 'none';
    }
  });
}

// Newsletter form handling
function setupNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    alert("Thank you for subscribing! We'll be in touch soon.");
    newsletterForm.reset();
  });
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
