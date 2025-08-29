/**
 * Load items from JSON into a given container
 * @param {Array} items - JSON array of items
 * @param {string} containerId - id of the container where cards will be appended
 * @param {string} lang - preferred language, fallback to 'en'
 */
async function loadSection(items, containerId, lang = "en", rdirect = true, className = "preview-card card") {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (const item of items) {
    if (!item.html) continue;
    const url = item.html[lang] || item.html["en"];
    if (!url) continue;

    const card = document.createElement("div");
    card.className = className;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const htmlContent = await resp.text();
      card.innerHTML = htmlContent;
      if (rdirect) {
        card.addEventListener('click', (e) => {
          const tag = e.target.tagName.toLowerCase();
          if (tag === 'a' || tag === 'button') return;

          window.location.href = url;
        });
      }
    } catch (e) {
      console.error("Failed to load", url, e);
      card.innerHTML = "<p>Failed to load content.</p>";
    }
    container.appendChild(card);
  }
}

async function loadNavbar(root = "/data/home/langs.json", relPages = "/data/pages", elemID = "navbar") {
  fetch(root)
  .then(r => r.json())
  .then(json => {
    const container = document.getElementById(elemID);
    const lang = navigator.language.slice(0, 2);
    console.log(navigator.language, lang);
    console.log(json);
    ["Home", "News", "Projects", /*"Updates", "Releases",*/ "Team", /*"Official Channels"*/].forEach(elem => {
      const label = json[elem.toLowerCase()]?.[lang] || elem + " naa";
      console.log(label);
      console.log(elem.toLowerCase());
      container.innerHTML += `<a href="${relPages}/${elem.toLowerCase()}.html">${label}</a>`;
    });
  });
}