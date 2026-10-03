'use strict';
/* UI state only: never submits forms or changes ledger data. */
(() => {
  const sidebar = document.querySelector('.sidebar');
  const nav = document.querySelector('.sidebar-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!sidebar || !nav || !toggle) return;
  const mobile = matchMedia('(max-width: 820px)');
  const backdrop = document.querySelector('.nav-backdrop');
  const close = document.querySelector('.nav-close');
  const main = document.querySelector('.main');
  const bottom = document.querySelector('.mobile-nav');
  const fab = document.querySelector('.ai-fab');
  const aiPanel = document.querySelector('#aiPanel');
  const skipLink = document.querySelector('.skip-link');
  let previousFocus;
  const get = (key) => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
  const save = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) { /* Private browsing is supported. */ } };
  const isOpen = () => document.body.classList.contains('nav-open');
  function syncLabel() {
    const expanded = mobile.matches ? isOpen() : document.documentElement.dataset.nav !== 'compact';
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', mobile.matches ? '打开全部功能' : (expanded ? '收起导航' : '展开导航'));
    toggle.title = toggle.getAttribute('aria-label');
  }
  function setOpen(open, restoreFocus = true) {
    if (open) previousFocus = document.activeElement;
    document.body.classList.toggle('nav-open', open);
    backdrop.hidden = !open;
    [main, bottom, fab, aiPanel, skipLink].filter(Boolean).forEach(el => { el.inert = open; });
    if (open) {
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-modal', 'true');
      close.focus();
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-modal');
      if (restoreFocus && previousFocus?.isConnected) previousFocus.focus();
    }
    syncLabel();
  }
  toggle.addEventListener('click', () => {
    if (mobile.matches) return setOpen(!isOpen());
    const compact = document.documentElement.dataset.nav !== 'compact';
    document.documentElement.dataset.nav = compact ? 'compact' : 'expanded';
    try { localStorage.setItem('hl-nav-collapsed', compact ? '1' : '0'); } catch (_) { /* Optional preference. */ }
    syncLabel();
  });
  close.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => {
    if (!mobile.matches || !isOpen()) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key === 'Tab') {
      const items = [...sidebar.querySelectorAll('a[href],button,select,input:not([type=hidden])')].filter(el => !el.disabled && el.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  mobile.addEventListener('change', () => {
    const hadNavFocus = sidebar.contains(document.activeElement);
    setOpen(false, false);
    if (mobile.matches && hadNavFocus) toggle.focus();
    syncLabel();
  });
  // Settings switches panels in place; its legacy window scroll is outside
  // the workspace scroll container.
  if (document.body.dataset.page === 'settings') {
    document.querySelectorAll('.tabs a').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelector('.content').scrollTop = 0;
      });
    });
  }
  document.querySelectorAll('.cal-grid').forEach(grid => {
    const region = document.createElement('div');
    region.className = 'calendar-scroll';
    region.tabIndex = 0;
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', '月历，窄屏可左右滚动查看完整日期和金额');
    grid.before(region);
    region.append(grid);
  });
  document.querySelectorAll('.content .table').forEach(table => {
    let region = table.closest('.scroll-x');
    if (!region) {
      region = document.createElement('div');
      region.className = 'scroll-x';
      table.before(region);
      region.append(table);
    }
    region.tabIndex = 0;
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', '数据表格，窄屏可左右滚动查看全部列');
  });
  nav.querySelectorAll('.nav-item').forEach(link => {
    const label = link.querySelector('.nav-label')?.textContent.trim() || link.textContent.trim();
    link.title = label;
    link.setAttribute('aria-label', label);
    if (link.classList.contains('active')) link.setAttribute('aria-current', 'page');
  });
  nav.scrollTop = Number(get('hl-menu-scroll')) || 0;
  nav.addEventListener('scroll', () => save('hl-menu-scroll', String(nav.scrollTop)), { passive: true });
  const revealActive = () => {
    const active = nav.querySelector('.active');
    if (!active) return;
    const a = active.getBoundingClientRect(), n = nav.getBoundingClientRect();
    if (a.top < n.top + 8) nav.scrollTop += a.top - n.top - 8;
    if (a.bottom > n.bottom - 8) nav.scrollTop += a.bottom - n.bottom + 8;
  };
  revealActive();
  // Equal-size system action glyphs; leave user/category icons intact.
  const glyph = p => '<svg class="ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  document.querySelectorAll('.txn-act [title]').forEach(el => {
    el.setAttribute('aria-label', el.title);
    if (el.title === '编辑') el.innerHTML = glyph('<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15Z"/>');
    if (el.title === '删除') el.innerHTML = glyph('<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>');
  });
  syncLabel();
})();
