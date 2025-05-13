# Basic Modular Apps Script Template (Hello App)

This template provides a foundational structure for a Google Apps Script web application using a modular approach (Crockford-style modules). It includes a simple "Hello App" demonstrating client-server interaction.

## Features

*   **Modular Design:** Code is organized into reusable modules located in `src/modules/`.
    *   `ErrorManager.js`: For custom error handling.
    *   `TimeManager.js`: To manage script execution time (useful for longer operations).
    *   `GreeterManager.js`: Example business logic module.
    *   `LogManager.js`: A basic logging wrapper.
*   **Web Application:**
    *   `index.html`: Simple HTML frontend.
    *   `webapp.js`: Server-side logic (`doGet` and `handleHelloRequest`).
*   **Clasp Ready:** Configured for local development with the [Google Clasp CLI](https://github.com/google/clasp).
*   **Firebase Studio / IDX:** Designed to be easily used within Firebase Studio. The `.idx/dev.nix` file sets up a development environment with `clasp` and other common tools.

## Prerequisites

*   [Node.js and npm](https://nodejs.org/) (for installing `clasp` globally if not using IDX's environment).
*   [Google Clasp CLI](https://github.com/google/clasp): Install globally with `npm install -g @google/clasp`. (Included in the `.idx/dev.nix` environment).
*   A Google Account.

## Setup

1.  **Clone this Template (if not already in a workspace):**
    If you're using this template via the Firebase Studio template collection, this step is already done. Otherwise:
    ```bash
    # git clone ... or copy this template directory
    # cd gas-basic-module-template # Or your template directory name
    ```

2.  **Authenticate Clasp:**
    Open a terminal in this directory and run:
    ```bash
    clasp login
    ```
    Follow the prompts to log in with your Google account.

3.  **Create or Identify an Apps Script Project:**
    *   Go to [script.google.com](https://script.google.com) and create a new project, or use an existing one.
    *   Note its **Script ID** (found in Project Settings or the URL).

4.  **Configure `.clasp.json`:**
    *   Rename `.clasp.json.example` to `.clasp.json`.
    *   Edit `.clasp.json` and replace `"YOUR_SCRIPT_ID_HERE"` with your actual Script ID.
    *   The `"rootDir": "."` setting tells `clasp` that this directory is the root of your Apps Script project files to be pushed.
    *   Optionally, set your GCP `projectId` if you are using Stackdriver logging with a specific GCP project.

5.  **Push Initial Code:**
    ```bash
    clasp push -f
    ```
    The `-f` flag forces `clasp` to overwrite the manifest file (`appsscript.json`) in your online project with the local one.

## Development

*   Edit files locally (e.g., `webapp.js`, `index.html`, modules in `src/modules/`).
*   Use `clasp push` to upload your changes to the linked Apps Script project.
*   Use `clasp open` to open the project in the Google Apps Script online editor.
*   Use `Logger.log("message")` in your `.js` files for server-side logging. View logs in the Apps Script editor (View > Executions).

## Deploying the Web App

1.  **Ensure `appsscript.json` is configured:**
    The `webapp` section in `appsscript.json` should be set up correctly (see the provided file).

2.  **Create a Deployment:**
    *   **Via Clasp (Recommended):**
        ```bash
        clasp deploy -d "Initial deployment of Hello App"
        ```
        This command will create a new versioned deployment and output the Deployment ID and the Web App URL (ending in `/exec`).
    *   **Via Apps Script Editor:**
        *   Run `clasp open`.
        *   In the editor, click "Deploy" > "New deployment".
        *   Select **Type**: "Web app".
        *   Enter a **Description** (e.g., "Hello App v1").
        *   Configure **Execute as** and **Who has access** (these should ideally match your `appsscript.json` settings).
        *   Click "Deploy".
        *   Copy the **Web app URL** (the one ending in `/exec`).

3.  **Access the Web App:**
    Open the `/exec` URL obtained from the deployment step in your browser.

## Modules Overview

*   **`src/modules/ErrorManager.js`**: Provides a `throwError` function to create and throw standardized, enriched error objects.
*   **`src/modules/TimeManager.js`**: Helps manage script execution time, useful for operations that might approach Apps Script quotas. Includes `hasEnoughTime()`.
*   **`src/modules/GreeterManager.js`**: An example module demonstrating how to use other managers (Time, Error, Log) to perform a task (greeting names).
*   **`src/modules/LogManager.js`**: A simple wrapper around `Logger` or `console` for consistent logging.

This template provides a starting point. Feel free to adapt and expand upon it!
