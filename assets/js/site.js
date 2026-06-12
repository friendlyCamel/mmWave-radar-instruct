(function () {
  const content = document.querySelector('.content');
  const toc = document.getElementById('toc');
  const toggle = document.querySelector('.toc-toggle');
  if (!content || !toc) return;

  const headings = Array.from(content.querySelectorAll('h2, h3, h4'));
  const usedIds = new Set();

  function slugify(text) {
    const base = text.trim()
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'section';
    let id = base;
    let i = 2;
    while (usedIds.has(id) || document.getElementById(id)) {
      id = `${base}-${i++}`;
    }
    usedIds.add(id);
    return id;
  }

  headings.forEach((heading) => {
    if (!heading.id) heading.id = slugify(heading.textContent || '');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent || '';
    link.className = `toc-${heading.tagName.toLowerCase()}`;
    toc.appendChild(link);
  });

  const links = Array.from(toc.querySelectorAll('a'));
  const byId = new Map(links.map((link) => [decodeURIComponent(link.hash.slice(1)), link]));

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.remove('active'));
    const active = byId.get(visible.target.id);
    if (active) active.classList.add('active');
  }, {
    rootMargin: '-80px 0px -70% 0px',
    threshold: [0, 1]
  });

  headings.forEach((heading) => observer.observe(heading));

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('toc-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    toc.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        document.body.classList.remove('toc-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
