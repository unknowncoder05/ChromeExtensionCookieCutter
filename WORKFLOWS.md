# Chrome Extension Template Workflows

1. Generate the project with cookiecutter.
2. Run `npm install`.
3. Run `npm run validate` to check required extension files and manifest structure.
4. Run `npm run build` to copy the extension into `dist/`.
5. Load `dist/` through `chrome://extensions` in Developer mode.
6. Customize permissions, host permissions, UI, background events, content-script matches, and settings storage as the product requires.
