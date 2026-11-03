/* =========================================================
   腊梅.cn — 交互脚本（原生 JS，无外部依赖）
   功能：移动端导航、滚动渐显、图库灯箱
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. 移动端导航 ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // 点击导航项后自动收起（移动端）
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 720px)').matches) {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // 视口放大到桌面尺寸时重置状态
    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 721px)').matches && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. 滚动渐显（IntersectionObserver） ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target); // 只触发一次
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // 不支持时直接显示
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 3. 图库灯箱 ---------- */
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var lb = document.getElementById('lightbox');
    var lbImg = lb ? lb.querySelector('img') : null;
    var lbCap = lb ? lb.querySelector('.cap') : null;
    var lbClose = lb ? lb.querySelector('.close') : null;

    function openLightbox(src, alt) {
      if (!lb || !lbImg) { return; }
      lbImg.src = src;
      lbImg.alt = alt || '';
      if (lbCap) { lbCap.textContent = alt || ''; }
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      if (!lb) { return; }
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    gallery.querySelectorAll('figure img, a[data-zoom]').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        openLightbox(img.currentSrc || img.src, img.alt || '');
      });
    });

    if (lbClose) { lbClose.addEventListener('click', closeLightbox); }
    if (lb) {
      lb.addEventListener('click', function (e) {
        if (e.target === lb) { closeLightbox(); }
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb && lb.classList.contains('open')) { closeLightbox(); }
    });
  }

  /* ---------- 4. 年份自动填充 ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
