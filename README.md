# Google Apps Script Modular Starter Templates for Firebase Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
<!-- Add other relevant badges here, e.g., for contributions, clasp version -->
<!-- Example: [![Clasp](https://img.shields.io/badge/clasp-^2.4.2-brightgreen.svg)](https://github.com/google/clasp) -->


This repository provides a collection of Google Apps Script (GAS) application templates designed to accelerate development using [Firebase Studio (Project IDX)](https://idx.dev/). Each template offers a well-structured starting point for different types of GAS projects, complete with Nix environments for reproducible setups in Firebase Studio.

<a href="https://studio.firebase.google.com/new?template=https%3A%2F%2Fgithub.com%2Fduizendstra%2Fgas-template-tmp">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://cdn.firebasestudio.dev/btn/open_dark_32.svg">
    <source
      media="(prefers-color-scheme: light)"
      srcset="https://cdn.firebasestudio.dev/btn/open_light_32.svg">
    <img
      height="32"
      alt="Open in Firebase Studio"
      src="https://cdn.firebasestudio.dev/btn/open_blue_32.svg">
  </picture>
</a>

## Vision

To provide a comprehensive set of high-quality, production-ready Google Apps Script starter templates that integrate seamlessly with Firebase Studio. These templates aim to enable developers to quickly bootstrap new GAS applications, incorporating best practices for modularity, maintainability, and integration with Google Workspace services.

## Available Templates

Currently, the following template is available:

1.  **Basic Modular Apps Script (`gas-basic-module-template`)**
    *   **Description:** A foundational template for Google Apps Script projects. It emphasizes a modular structure using a pattern similar to Crockford's module pattern (IIFE returning an object of public methods). Includes stubs for error handling, time utilities, web app interaction, and trigger-based execution. Designed for local development with `clasp`.
    *   **Location:** [`./gas-basic-module-template/`](./gas-basic-module-template/)
    *   **Quick Start:** See the [Basic Modular Apps Script README](./gas-basic-module-template/README.md) for detailed setup and usage instructions.

*(More templates are planned, and contributions are welcome! See the [Roadmap](ROADMAP.md) if available, or open an issue with suggestions.)*

## How to Use with Firebase Studio

These templates are designed to be used with Firebase Studio's "Create a new workspace from a template" feature or by directly importing this repository.

1.  **Using the "Open in Firebase Studio" button above is the recommended method.**
2.  Alternatively, in Firebase Studio:
    *   Choose to create a new workspace.
    *   Select "Import a repository."
    *   Provide the URL to this GitHub repository: `https://github.com/duizendstra/gas-template-tmp`
3.  Firebase Studio will detect the `idx-template.json` and `idx-template.nix` files. It will then guide you through selecting one of the available templates defined in `idx-template.json`.

The root `idx-template.nix` handles the bootstrapping process. It copies the selected template's files (e.g., everything from the `gas-basic-module-template` directory) into your new Firebase Studio workspace. The Nix environment specified by the root `.idx/dev.nix` in *this* repository configures the environment if you open this entire collection repository in IDX (e.g., for contributing to the templates). The individual templates (like `gas-basic-module-template`) will also have their own `.idx/dev.nix` to define the specific environment for *using* that template.

## Contributing

Contributions are highly welcome! Whether it's proposing a new template, improving an existing one, enhancing documentation, or refining the Nix environments, your help is appreciated.

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details on how to get started.

## Code of Conduct

We aim to foster an open and welcoming environment. All contributors are expected to:
*   **Act professionally and respectfully.**
*   **Be kind, considerate, and welcoming to others.**
*   Harassment or exclusionary behavior will not be tolerated.

*(Consider creating a more detailed CODE_OF_CONDUCT.md file if your project grows.)*

## Roadmap

Curious about what's next? We plan to expand this collection with more specialized Google Apps Script templates.
*   [ ] Template for Google Sheets Add-on with custom functions and sidebar.
*   [ ] Template for Google Docs Add-on interacting with document content.
*   [ ] Template for a standalone script interacting with Google Drive and Gmail.
*   [ ] Advanced modular template with examples of using Script Properties and caching.

*(This is a basic roadmap. You can expand this into a separate ROADMAP.md file for more detail.)*

## License

This project and its templates are licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
