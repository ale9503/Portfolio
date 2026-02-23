/**
 * Executive Portfolio i18n & Data Architecture Script
 * Handles JSON fetching and DOM population based on language setting.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Determine language from HTML lang attribute, default to 'es'
    const lang = document.documentElement.lang || 'es';
    loadData(lang);
    
    // Bind language switchers if they exist
    const langSwitchers = document.querySelectorAll('.language-switch a');
    langSwitchers.forEach(el => {
        el.addEventListener('click', (e) => {
            // For true i18n SPA we could prevent default and reload JSON, 
            // but currently the HTML redirects to index.en.html.
            // Keeping vanilla structure.
        });
    });
});

async function loadData(lang) {
    try {
        const response = await fetch(`/data/data.${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data for language: ${lang}`);
        }
        
        const data = await response.json();
        
        populateDOM(data);
        renderProjects(data.projects, data.ui);
        renderPillars(data.pillars);
        
        // Dispatch custom event in case components (like Radar Chart) need to re-render
        document.dispatchEvent(new CustomEvent('dataLoaded', { detail: { data, lang } }));
        
    } catch (error) {
        console.error("Error loading portfolio data:", error);
    }
}

/**
 * Parses simple keys from JSON (e.g. data-i18n="hero.title")
 */
function populateDOM(data) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const path = el.getAttribute('data-i18n');
        const value = getNestedValue(data, path);
        if (value !== undefined) {
             // If value is an array, we handle it if the element is an unordered list (ul)
             if (Array.isArray(value) && el.tagName === 'UL') {
                 el.innerHTML = '';
                 value.forEach(item => {
                     const li = document.createElement('li');
                     // Simple bolding of metric digits if needed, or straight text
                     li.innerHTML = item; 
                     el.appendChild(li);
                 });
             } else {
                 if (el.tagName === 'A' && !path.includes('ui.')) {
                     // Normally a text element
                 }
                 el.innerHTML = value;
             }
        }
    });

    // Handle special UI attributes
    const uiElements = document.querySelectorAll('[data-i18n-attr]');
    uiElements.forEach(el => {
        const attrJSON = el.getAttribute('data-i18n-attr'); // e.g., 'placeholder:ui.search'
        const parts = attrJSON.split(':');
        if (parts.length === 2) {
            const attrName = parts[0];
            const dataPath = parts[1];
            const value = getNestedValue(data, dataPath);
            if (value !== undefined) {
                el.setAttribute(attrName, value);
            }
        }
    });
    
    // Set Download CV href
    const cvDownloadBtn = document.querySelector('[data-id="download-cv"]');
    if (cvDownloadBtn) {
        cvDownloadBtn.href = "/../Cerebro_MCP/CV_EN.pdf"; // Note: production build might need a dedicated public folder delivery for this, mapping locally.
    }
}

/**
 * Renders the Bento Grid Business Cases
 */
function renderProjects(projects, ui) {
    const container = document.getElementById('projects-grid');
    if (!container) return; // Not on this page
    
    container.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'bento-card bento-card--project';
        card.innerHTML = `
            <div class="bento-card__header">
                <h3 class="bento-card__title">${project.title}</h3>
                <span class="bento-card__role">${ui.role}: <strong>${project.role}</strong></span>
            </div>
            
            <div class="bento-card__body">
                <div class="bento-card__impact-highlight">
                    <h4>${ui.impact}</h4>
                    <p>${project.impact}</p>
                </div>
                <div class="bento-card__details">
                    <div class="detail-section">
                        <h5>${ui.context}</h5>
                        <p>${project.context}</p>
                    </div>
                    <div class="detail-section">
                        <h5>${ui.action}</h5>
                        <p>${project.action}</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Renders Pillars (Authority)
 */
function renderPillars(pillarsData) {
    const container = document.getElementById('pillars-grid');
    if (!container) return; 
    
    container.innerHTML = '';
    
    pillarsData.items.forEach(pillar => {
        const card = document.createElement('div');
        card.className = 'bento-card bento-card--pillar';
        card.innerHTML = `
            <h4 class="bento-card__title">${pillar.name}</h4>
            <p>${pillar.description}</p>
        `;
        container.appendChild(card);
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
