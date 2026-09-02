# Samuel Olawole Portfolio

This portfolio is a static one-page developer portfolio for Samuel Olawole.

## Project structure

- `index.html` — page layout and sections
- `styles.css` — all visual styling and responsive behavior
- `script.js` — project rendering, theme toggle, and navigation logic
- `data/projects.js` — project, skill, and focus-area data
- `avatar.jpg` — profile image used in the hero section

## Adding a project

Add a new object in `data/projects.js` using the template below:

```js
{
  title: "PROJECT NAME",
  description: "PROJECT DESCRIPTION",
  image: "",
  technologies: ["React", "Python"],
  liveUrl: "",
  githubUrl: "",
  caseStudyUrl: "",
  featured: false
}
```

- If `image` is empty, a polished fallback is shown automatically.
- If `liveUrl` or `githubUrl` is missing, the matching button is hidden.
- If `featured` is set to `true`, that project becomes the main featured project.

## Local preview

Open `index.html` directly in a browser, or run:

```bash
cd "C:\Users\Admin\Documents\GitHub\Portfolio"
python -m http.server 8000
```

Then visit http://127.0.0.1:8000
