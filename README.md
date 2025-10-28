# Portafolio — Alejandro Gómez

Sitio web estático que reúne mi experiencia en estrategia, innovación y tecnología. Incluye una página principal, un visor de proyectos interactivo y un mapa de habilidades con visualizaciones generadas dinámicamente a partir de mi registro personal.

> **Aviso importante**
>
> Todo el código, datos y materiales contenidos en este repositorio son de uso privado. Cualquier reproducción, redistribución o utilización requiere mi aprobación expresa a través de mis canales oficiales.

## Estructura del proyecto

```
.
├── index.html                 # Página principal del portafolio
├── css/styles.css             # Sistema de diseño y estilos compartidos
├── scripts/skills-data.js     # Normalización y carga de datos de skills
├── skills/
│   ├── index.html             # Vista con filtros y tablero de habilidades
│   └── skills.js              # Render de tarjetas, tabla y treemap (D3)
├── proyectos/index.html       # Explorador interactivo de casos por año
├── Files/
│   ├── skills_details.json    # Dataset publicado para la sección de skills
│   └── CVNestor...pdf         # CV descargable desde el sitio
├── DetallePortafolio.xlsx     # Fuente maestra de proyectos (uso local)
├── DetallePortafolio.json     # Conversión JSON utilizada en producción
├── convertidor.py             # Script para convertir el Excel de proyectos a JSON
└── testing/                   # Pruebas automatizadas (Node.js + jsdom)
```

## Requisitos

- Navegador moderno para visualizar el sitio (puedes abrir los HTML directamente o servirlos con cualquier servidor estático).
- [Node.js 20+](https://nodejs.org/) para ejecutar las pruebas automatizadas.
- Python 3.10+ con `pandas` si necesitas regenerar `DetallePortafolio.json` desde el Excel.

## Desarrollo y pruebas

### Servir el sitio localmente

Puedes abrir `index.html` directamente en tu navegador o levantar un servidor estático. Con Node.js instalado:

```bash
npx serve .
```

### Regenerar los datos de proyectos

El archivo `DetallePortafolio.json` se obtiene a partir de `DetallePortafolio.xlsx`. Para volver a generarlo:

```bash
python -m venv .venv
source .venv/bin/activate  # En Windows usa .venv\Scripts\activate
pip install pandas openpyxl
python convertidor.py
```

> El Excel contiene información sensible; mantenlo fuera de control de versiones públicas.

### Ejecutar las pruebas automatizadas

Instala las dependencias necesarias (actualmente solo `jsdom`) y usa `node --test`:

```bash
npm install
node --test
```

Las pruebas cubren la normalización de datos (`scripts/skills-data.js`) y el renderizado del tablero de skills (`skills/skills.js`) usando JSDOM.

## Despliegue

El sitio está preparado para funcionar como contenido estático (por ejemplo, GitHub Pages). Asegúrate de subir el contenido de la carpeta raíz, manteniendo la estructura de directorios.

## Contacto y permisos

Para cualquier consulta o solicitud de uso del código y los datos, contáctame únicamente a través de mis canales oficiales (WhatsApp, LinkedIn o correo electrónico enlazados en el sitio).

