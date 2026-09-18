const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  const closeNavigation = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('nav-open', !open);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeNavigation();
    }
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNavigation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 52.0625rem)').matches) closeNavigation();
  });
}

const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();

const galleryFilters = document.querySelector('.gallery-filters');
const galleryItems = [...document.querySelectorAll('[data-gallery-category]')];
const galleryStatus = document.querySelector('[data-gallery-status]');

if (galleryFilters && galleryItems.length) {
  galleryFilters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gallery-filter]');
    if (!button) return;

    const filter = button.dataset.galleryFilter;
    const filterLabel = button.textContent.trim();
    let visibleCount = 0;

    galleryFilters.querySelectorAll('[data-gallery-filter]').forEach((filterButton) => {
      filterButton.setAttribute('aria-pressed', String(filterButton === button));
    });

    galleryItems.forEach((item) => {
      const visible = filter === 'all' || item.dataset.galleryCategory === filter;
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (galleryStatus) {
      const category = filter === 'all' ? '' : ` in ${filterLabel}`;
      galleryStatus.textContent = `Showing ${visibleCount} project photo${visibleCount === 1 ? '' : 's'}${category}.`;
    }
  });
}

const estimateForm = document.querySelector('[data-estimate-form]');

if (estimateForm) {
  const formStatus = estimateForm.querySelector('[data-form-status]');
  const submitButton = estimateForm.querySelector('[data-submit-button]');
  const defaultButtonText = submitButton.textContent;

  const showFormStatus = (message, state) => {
    formStatus.textContent = message;
    formStatus.dataset.state = state;
    formStatus.focus();
  };

  estimateForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const endpoint = estimateForm.action;

    if (endpoint.includes('/FORM_ID')) {
      showFormStatus('This form is not connected yet. Please add the Formspree form ID before accepting requests.', 'error');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    formStatus.textContent = '';
    delete formStatus.dataset.state;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(estimateForm),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');

      estimateForm.reset();
      showFormStatus("Thank you. Your estimate request has been received. Yucra's Home Improvement will follow up with you soon.", 'success');
    } catch {
      showFormStatus('We could not send your request. Please review your information and try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonText;
    }
  });
}
