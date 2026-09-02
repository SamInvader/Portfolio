const projectData = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
const skillGroups = window.portfolioSkills || {};
const focusAreas = Array.isArray(window.portfolioFocusAreas) ? window.portfolioFocusAreas : [];

const isValidUrl = (value) => {
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  if (!trimmed || /^(null|undefined|none|n\/a|#|your[_ -]?link[_ -]?here)$/i.test(trimmed)) {
    return false;
  }

  const isExplicitRelativeUrl = /^(\.\.\/|\.\/|\/)/.test(trimmed);
  const hasHttpProtocol = /^https?:\/\//i.test(trimmed);
  if (!isExplicitRelativeUrl && !hasHttpProtocol) return false;

  try {
    const parsedUrl = new URL(trimmed, document.baseURI);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const projectImageMarkup = (project, variant = 'card') => {
  const image = project.image && project.image.trim();
  const wrapperClass = variant === 'featured' ? 'featured-project__visual' : 'project-card__visual';

  if (!image) {
    return `
      <div class="${wrapperClass}">
        <div class="project-fallback">Project Preview</div>
      </div>
    `;
  }

  return `
    <div class="${wrapperClass}">
      <img src="${image}" alt="${project.title} project preview" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\'project-fallback\'>Project Preview</div>';" />
    </div>
  `;
};

const renderTechTags = (technologies = []) =>
  technologies
    .map((tech) => `<span class="tech-tag">${tech}</span>`)
    .join('');

const renderActionButton = (label, url, variant = 'secondary') => {
  if (!isValidUrl(url)) return '';
  return `<a class="button button--${variant}" href="${url}" target="_blank" rel="noreferrer">${label}</a>`;
};

const renderFeaturedProject = (project) => {
  const tech = renderTechTags(project.technologies || []);
  const buttons = [
    renderActionButton('Live Demo', project.liveUrl, 'primary'),
    renderActionButton('Source Code', project.githubUrl, 'secondary'),
    renderActionButton('Case Study', project.caseStudyUrl, 'ghost')
  ].filter(Boolean).join('');

  return `
    <article class="featured-project">
      ${projectImageMarkup(project, 'featured')}
      <div class="featured-project__body">
        <span class="project-eyebrow">Featured Project</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-list">${tech}</div>
        <div class="project-actions">${buttons}</div>
      </div>
    </article>
  `;
};

const renderProjectCard = (project) => {
  const tech = renderTechTags(project.technologies || []);
  const buttons = [
    renderActionButton('Live Demo', project.liveUrl, 'primary'),
    renderActionButton('Source Code', project.githubUrl, 'secondary')
  ].filter(Boolean).join('');

  return `
    <article class="project-card">
      ${projectImageMarkup(project, 'card')}
      <div class="project-card__body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-list">${tech}</div>
        <div class="project-actions">${buttons}</div>
      </div>
    </article>
  `;
};

const renderProjects = () => {
  const container = document.getElementById('projects-container');
  if (!container) return;

  if (!projectData.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Projects are being prepared.</h3>
        <p>
          A collection of software projects is currently being refined and will appear here soon.
        </p>
      </div>
    `;
    return;
  }

  const featuredProject = projectData.find((project) => project.featured) || projectData[0];
  const secondaryProjects = projectData.filter((project) => project !== featuredProject);

  const featuredMarkup = featuredProject ? renderFeaturedProject(featuredProject) : '';
  const secondaryMarkup = secondaryProjects.length
    ? `<div class="project-grid">${secondaryProjects.map(renderProjectCard).join('')}</div>`
    : '';

  container.innerHTML = `
    <div class="projects-shell">
      ${featuredMarkup}
      ${secondaryMarkup}
    </div>
  `;
};

const renderFocusAreas = () => {
  const container = document.getElementById('focus-grid');
  if (!container) return;

  container.innerHTML = (focusAreas || [])
    .map(
      (area) => `
        <article class="focus-card">
          <h3>${area.title}</h3>
          <p>${area.description}</p>
        </article>
      `
    )
    .join('');
};

const renderSkills = () => {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  const groups = Object.entries(skillGroups || {});

  container.innerHTML = groups
    .map(
      ([groupName, items]) => `
        <article class="skill-card">
          <h3>${groupName.charAt(0).toUpperCase() + groupName.slice(1)}</h3>
          <ul>
            ${(items || []).map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </article>
      `
    )
    .join('');
};

const initializeTheme = () => {
  const root = document.documentElement;
  const toggleButton = document.querySelector('.theme-toggle');
  const icon = document.querySelector('.theme-toggle__icon');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀' : '☾';
    }
  };

  const initialTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }
};

const initializeNavigation = () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.getElementById('nav-panel');
  const navLinks = [...document.querySelectorAll('.nav-link')];

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      const isOpen = navPanel.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');

      if (navPanel && navPanel.classList.contains('is-open')) {
        navPanel.classList.remove('is-open');
      }
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((item) => {
            const isActive = item.getAttribute('href') === `#${id}`;
            item.classList.toggle('active', isActive);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
};

const initializePortfolio = () => {
  renderProjects();
  renderFocusAreas();
  renderSkills();
  initializeTheme();
  initializeNavigation();
};

document.addEventListener('DOMContentLoaded', initializePortfolio);
