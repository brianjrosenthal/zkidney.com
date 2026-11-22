/*
 * zkidney.com site chrome.
 *
 * Draws the shared header (logo + navigation) on every page. Everything lives
 * inside a shadow root attached to an element that sits outside <body>, and
 * this file defines no global variables, so it cannot collide with the
 * calculators' own JavaScript, element ids, or CSS.
 *
 * To change the navigation, edit NAV below. Paths are relative to the site root.
 */
(function () {
  'use strict';

  var NAV = [
    { label: 'HOME', href: '' },
    { label: 'AUTHOR', href: 'cv/' },
    { label: 'TC', href: 'http://renalworld.com/calc', external: true }
  ];
  var LOGO_HREF = 'http://touchcalc.com';
  var BRAND = { label: 'TOUCHCALC.COM', href: 'bmi/' };

  // Site root, worked out from this script's own URL (…/assets/site.js).
  var script = document.currentScript;
  var root = script ? script.src.replace(/assets\/site\.js(\?.*)?$/, '') : '/';

  function abs(href) {
    return /^[a-z]+:/i.test(href) ? href : root + href;
  }

  function samePage(href) {
    var a = document.createElement('a');
    a.href = href;
    var strip = function (p) { return p.replace(/index\.html$/, '').replace(/\/$/, ''); };
    return a.host === location.host && strip(a.pathname) === strip(location.pathname);
  }

  var CSS = [
    ':host{all:initial}',
    '.bar{all:initial;position:absolute;top:0;left:0;width:100%;height:56px;box-sizing:border-box;',
    'background:#2b302f;color:#fff;display:flex;align-items:center;justify-content:space-between;',
    'padding:0 24px;font-family:Poppins,"Helvetica Neue",Helvetica,Arial,sans-serif;z-index:1000}',
    '.brand{display:flex;align-items:center;gap:8px;min-width:0}',
    '.logo{display:block;width:40px;height:27px;overflow:hidden;flex:none;background:#fff}',
    '.logo img{display:block;width:40px;height:auto;margin-top:-7px;border:0}',
    '.name{color:#fff;text-decoration:none;font-size:17px;font-weight:600;letter-spacing:.01em;white-space:nowrap}',
    'nav{display:flex;gap:10px;flex:none}',
    'nav a{display:block;background:#000;color:#fff;text-decoration:none;font-size:16px;font-weight:600;',
    'letter-spacing:.06em;line-height:1;padding:11px 10px;white-space:nowrap}',
    'nav a:hover,nav a:focus-visible,.name:hover{color:#c9d36a}',
    'nav a[aria-current]{color:#8a9432}',
    '@media (max-width:560px){.bar{padding:0 10px}.name{display:none}nav{gap:6px}nav a{font-size:14px;padding:10px 8px}}',
    '.prose{all:initial;display:block;box-sizing:border-box;max-width:760px;margin:0 auto;padding:16px;',
    'font-family:Poppins,"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#2b302f}',
    '.prose h2{font-size:32px;font-weight:600;letter-spacing:-.02em;text-align:center;margin:0 0 4px}',
    '.prose h5{font-size:16px;font-weight:400;font-family:Helvetica,Arial,sans-serif;text-align:center;margin:0}',
    '.prose p{margin:0 0 1em;font-weight:600}'
  ].join('');

  var FONTS = [[400, 'normal', '400'], [600, 'normal', '600'], [700, 'normal', '700'], [600, 'italic', '600i']]
    .map(function (f) {
      return '@font-face{font-family:Poppins;font-style:' + f[1] + ';font-weight:' + f[0] +
        ';font-display:swap;src:url(' + root + 'assets/fonts/poppins-' + f[2] + '.woff2) format("woff2")}';
    }).join('');

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    (children || []).forEach(function (c) {
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function host() {
    var h = document.createElement('zk-chrome');
    // Inline !important so page-wide rules such as "* { margin: 4px }" in a
    // calculator's own stylesheet cannot move or restyle the host element.
    h.style.cssText = 'all:initial!important;display:block!important';
    return h;
  }

  function mount(h, content) {
    var shadow = h.attachShadow({ mode: 'open' });
    shadow.appendChild(el('style', {}, [CSS]));
    shadow.appendChild(content);
  }

  function buildHeader() {
    var nav = el('nav', { 'aria-label': 'Site' }, NAV.map(function (item) {
      var attrs = { href: abs(item.href) };
      if (item.external) attrs.rel = 'noopener';
      else if (samePage(attrs.href)) attrs['aria-current'] = 'page';
      return el('a', attrs, [item.label]);
    }));
    var bar = el('div', { 'class': 'bar' }, [
      el('div', { 'class': 'brand' }, [
        el('a', { 'class': 'logo', href: LOGO_HREF, rel: 'noopener', 'aria-label': 'touchcalc.com' }, [
          el('img', { src: root + 'assets/img/logo.png', alt: '', width: '40', height: '41' })
        ]),
        el('a', { 'class': 'name', href: abs(BRAND.href) }, [BRAND.label])
      ]),
      nav
    ]);
    var h = host();
    mount(h, bar);
    // Attached to <html>, not <body>, so the calculators' view of
    // document.body is exactly what it was inside the old iframe.
    document.documentElement.appendChild(h);
  }

  // Optional page text that Wix showed above/below a calculator. It is kept in
  // <template data-zk="before|after"> elements in the page head.
  function buildProse() {
    var templates = document.querySelectorAll('template[data-zk]');
    Array.prototype.forEach.call(templates, function (t) {
      var box = el('div', { 'class': 'prose' });
      box.appendChild(t.content.cloneNode(true));
      var h = host();
      mount(h, box);
      if (t.getAttribute('data-zk') === 'before') document.body.insertBefore(h, document.body.firstChild);
      else document.body.appendChild(h);
    });
  }

  function init() {
    document.head.appendChild(el('style', {}, [FONTS]));
    buildHeader();
    buildProse();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
