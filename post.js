// JavaScript for individual blog post page
// Uses BLOG_POSTS from posts-data.js and a slug in the URL query string.

document.addEventListener('DOMContentLoaded', function () {
  const slug = getSlugFromUrl();
  const post = Array.isArray(window.BLOG_POSTS)
    ? window.BLOG_POSTS.find(function (p) { return p.slug === slug; })
    : null;

  if (!post) {
    renderNotFound();
  } else {
    renderPost(post);
    renderRelatedPosts(post);
  }

  setupDropdown();
  setupNewsletterForm();
});

function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function renderPost(post) {
  const titleEl = document.getElementById('post-title');
  const categoryEl = document.getElementById('post-category');
  const dateEl = document.getElementById('post-date');
  const readTimeEl = document.getElementById('post-read-time');
  const featuredImgEl = document.getElementById('post-featured-image');
  const contentEl = document.getElementById('post-content');

  // Update document title if there's a <title> tag
  const fullTitle = (post.title || 'Blog Post') + ' – Intentionally At Home Life';
  document.title = fullTitle;

  if (titleEl) titleEl.textContent = post.title || '';
  if (categoryEl) categoryEl.textContent = post.category || '';

  if (dateEl) {
    dateEl.innerHTML = '<i class="far fa-calendar"></i> ' + formatDate(post.date);
  }

  if (readTimeEl) {
    readTimeEl.innerHTML = '<i class="far fa-clock"></i> ' + (post.readTime || '');
  }

  if (featuredImgEl) {
    if (post.heroImage) {
      featuredImgEl.src = post.heroImage;
      featuredImgEl.alt = post.title || '';
      featuredImgEl.style.display = 'block';
    } else {
      featuredImgEl.style.display = 'none';
    }
  }

  if (contentEl) {
    contentEl.innerHTML = post.content || '';
  }
}

function renderNotFound() {
  const contentEl = document.getElementById('post-content');
  if (contentEl) {
    contentEl.innerHTML =
      '<div style="text-align:center; padding:3rem;">' +
      '<h1 style="margin-bottom:1rem;">Post not found</h1>' +
      '<p>Sorry, we couldn\\'t find the post you were looking for.</p>' +
      '<p><a href="index.html" class="back-link">← Back to the blog</a></p>' +
      '</div>';
  }
}

// Related posts based on category
function renderRelatedPosts(currentPost) {
  const container = document.getElementById('related-posts');
  if (!container || !Array.isArray(window.BLOG_POSTS)) return;

  const related = window.BLOG_POSTS
    .filter(function (post) {
      return post.slug !== currentPost.slug && post.category === currentPost.category;
    })
    .slice(0, 3);

  container.innerHTML = '';

  if (!related.length) {
    container.innerHTML =
      '<p style="text-align:center; color:#666;">More posts are coming soon.</p>';
    return;
  }

  related.forEach(function (post) {
    container.appendChild(createRelatedCard(post));
  });
}

function createRelatedCard(post) {
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
    '<h3 class="post-card-title">' +
    escapeHtml(post.title || '') +
    '</h3>' +
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

// Dropdown toggle for categories (same behavior as home page)
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
