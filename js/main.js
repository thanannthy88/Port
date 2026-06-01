function projectCard(project) {
  return `
    <article class="project-card">
      <div class="card-top">
        <span class="tag">${project.category}</span>
      </div>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="chips">
        ${project.tools.map(tool => `<span>${tool}</span>`).join("")}
      </div>
      <a class="btn small" href="project.html?id=${project.id}">View Project</a>
    </article>
  `;
}

function renderFeaturedProjects() {
  const container = document.getElementById("featured-projects");
  if (!container) return;
  container.innerHTML = projects
    .filter(project => project.featured)
    .slice(0, 3)
    .map(projectCard)
    .join("");
}

function renderFilters(activeCategory = "All") {
  const filterContainer = document.getElementById("category-filters");
  if (!filterContainer) return;

  const categories = ["All", ...new Set(projects.map(project => project.category))];
  filterContainer.innerHTML = categories
    .map(category => `<button class="filter-btn ${category === activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`)
    .join("");

  filterContainer.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => renderProjectList(button.dataset.category));
  });
}

function renderProjectList(activeCategory = "All") {
  const list = document.getElementById("project-list");
  if (!list) return;

  const searchValue = document.getElementById("search-input")?.value.toLowerCase() || "";

  const filtered = projects.filter(project => {
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    const searchableText = [
      project.title,
      project.category,
      project.summary,
      ...project.tools,
      ...project.skills
    ].join(" ").toLowerCase();
    return matchesCategory && searchableText.includes(searchValue);
  });

  list.innerHTML = filtered.length
    ? filtered.map(projectCard).join("")
    : `<p class="empty">No projects found. Try another search.</p>`;

  renderFilters(activeCategory);
}

function renderProjectDetail() {
  const detail = document.getElementById("project-detail");
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  const project = projects.find(item => item.id === projectId);

  if (!project) {
    detail.innerHTML = `<h1>Project not found</h1><p>Please return to the projects page.</p>`;
    return;
  }

  document.title = `${project.title} | Thanann Thy`;
  detail.innerHTML = `
    <div class="detail-header">
      <span class="tag">${project.category}</span>
      <h1>${project.title}</h1>
      <p>${project.summary}</p>
    </div>

    <div class="detail-grid">
      <section class="detail-panel">
        <h2>Tools Used</h2>
        <div class="chips">${project.tools.map(tool => `<span>${tool}</span>`).join("")}</div>
      </section>
      <section class="detail-panel">
        <h2>Skills Demonstrated</h2>
        <div class="chips">${project.skills.map(skill => `<span>${skill}</span>`).join("")}</div>
      </section>
    </div>

    <section class="detail-panel">
      <h2>Key Findings</h2>
      <ul>
        ${project.keyFindings.map(finding => `<li>${finding}</li>`).join("")}
      </ul>
    </section>

    <section class="detail-panel">
      <div class="pdf-header">
        <h2>PDF Report</h2>
        <a class="btn small" href="${project.pdf}" target="_blank" rel="noopener">Open PDF</a>
      </div>
      <iframe class="pdf-viewer" src="${project.pdf}" title="${project.title} PDF"></iframe>
      <p class="note">Replace the sample PDF path with your actual report file inside the pdfs folder.</p>
    </section>
  `;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;
  searchInput.addEventListener("input", () => renderProjectList("All"));
}

function setYear() {
  document.querySelectorAll("#year").forEach(item => {
    item.textContent = new Date().getFullYear();
  });
}

renderFeaturedProjects();
renderProjectList();
renderProjectDetail();
setupSearch();
setYear();
