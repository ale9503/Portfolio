# Executive Portfolio 2026 - Data Driven Architecture

This repository hosts a high-performance **Digital Executive Brief** designed to reflect leadership, transformational delivery, and data-driven impact. It eschews traditional complex frameworks (like React or Next.js) in favor of a lightning-fast, Vanilla JS & JSON data architecture, rendering a dynamic profile capable of instantaneous translation and cross-platform responsive behavior.

## 🏗️ Architecture & Core Philosophy

The core architectural decision was to create a **strict separation of concerns** between the UI (Bento Grid) and the Content/Metrics. 
- **HTML & CSS Grid:** Manages the structural layout (`index.html`, `skills/index.html`, `proyectos/index.html`).
- **`app.js` & `skills.js`:** The JS controllers responsible for parsing DOM elements with the `data-i18n` attribute and dynamically injecting content depending on the active locale.
- **Language Payloads (`/data/data.es.json` & `data.en.json`):** These files are the **single source of truth** for all strategic metrics, text paragraphs, and radar chart configurations. 

## 📊 Dynamic Radar Ecosystem & Skills Engine

A defining feature is the **Strategic Skills Radar**, which moves away from hard-coded self-evaluations towards an empirical, data-driven approach.

1. **`Files/skills_details.json`:** Contains the raw output of 97 learning milestones, courses, and technical tools. 
2. **Strict Multi-Category Tagging:** A Python regex classification script (`strict_reclassify.py`) was used to scan all 97 rows and tag each skill natively with one (or multiple) of the following 7 core Executive pillars:
   - Producto & Innovación
   - Estrategia & Valor del Negocio
   - Datos & Analítica
   - Liderazgo & Cultura
   - Automatización & Procesos
   - Riesgo & Cumplimiento
   - Delivery & Proyectos Ágiles
3. **Dynamic Canvas Projection:** Instead of reading flat percentages from the `data.XX.json` files, `skills.js` fetches the 97 rows, aggregates the frequencies of the aforementioned 7 pillars in milliseconds, normalizes the array computationally, and draws the vertices on the Chart.js canvas. Overlapping skills directly stretch multiple vertices.

## 🎨 Bento UI & Constraints
The interface was updated to a **2026 Corporate Bento Standard**:
- **Typography:** `Inter` for clean data labels and `Space Grotesk` / `Outfit` for striking headlines.
- **Color Palette:** Professional contrasts utilizing `Corporate Blue (#0A2540)` and `Pearl Grey (#F8F9FA)`.
- **Formatting Rules:**
  - Multiple tags (like Tools and Categories) are strictly separated by a semicolon (`str.join('; ')`).
  - Radar charts are locked structurally (`min: 0, max: 100`) via JS options to prevent visual deformation across language toggles.
  - Detail table columns have constrained widths (`max-width: 400px` for Tools) to protect the responsive grid structure.

## 🚀 Deployment & Updates
This platform is CI/CD ready via GitHub Pages. 
To update metrics, texts, or add new projects, engineers or recruiters should strictly edit:
- `data/data.es.json` & `data/data.en.json` for textual updates.
- `Files/skills_details.json` for expanding the skills dataset.

*Built autonomously by Gemini 2.5 Pro Agent in the Software Factory.*
