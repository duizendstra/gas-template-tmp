# This file configures the development environment for Google IDX using Nix.
# Nix allows for declarative and reproducible environments.
# Learn more: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Specifies the Nixpkgs channel to use for fetching packages.
  # 'stable-24.11' provides packages from a specific stable release branch.
  # Alternatives include 'unstable' for the latest packages.
  channel = "stable-24.11";

  # Lists the system-level packages to install in the workspace environment.
  # You can find available packages using the Nix package search: https://search.nixos.org/packages
  packages = [
    # Installs 'google-clasp', the command-line tool for Google Apps Script.
    pkgs.google-clasp
    # Installs 'go-task', a task runner / build tool written in Go.
    pkgs.go-task
  ];

  # Defines environment variables that will be available within the workspace shell
  # and to processes started within the environment.
  env = {
    # Example: MY_VARIABLE = "some_value";
  };

  # Contains settings specific to the Google IDX platform.
  idx = {
    # Lists VS Code extensions to automatically install in the IDX editor.
    # Find extension IDs (format: "publisher.id") on https://open-vsx.org/
    extensions = [
      # Installs the official GitHub Pull Requests and Issues extension.
      "GitHub.vscode-pull-request-github"
      # Example: Add Vim keybindings with "vscodevim.vim"
    ];

    # Configures the preview feature in IDX, which allows running servers or applications
    # and displaying them within an IDX panel.
    previews = {
      # Controls whether the preview feature is enabled globally.
      enable = false; # Set to true to enable previews defined below.

      # Defines specific preview configurations. This section is ignored if 'enable' is false.
      # previews = {
      #   # Example preview configuration named 'web':
      #   web = {
      #     # Command to run to start the application for the preview.
      #     command = ["npm", "run", "dev"]; # e.g., start a web server
      #     # Specifies the type of preview manager (e.g., 'web' for web apps).
      #     manager = "web";
      #     # Environment variables specifically for this preview command.
      #     env = {
      #       # Passes the IDX-assigned port to the application via the PORT variable.
      #       PORT = "$PORT";
      #     };
      #   };
      # };
    };

    # Defines commands to run at different stages of the workspace lifecycle.
    workspace = {
      # Commands listed here run *only once* when the workspace is first created.
      # Useful for initial setup tasks like cloning repos or installing dependencies.
      onCreate = {
        # Example: Install Node.js dependencies using npm.
        # npm-install = "npm install";
        # Example: Automatically open specific files when the workspace is created.
        # default.openFiles = [ ".idx/dev.nix" "README.md" ];
      };

      # Commands listed here run *every time* the workspace starts or restarts.
      # Useful for starting background processes, watchers, or development servers.
      onStart = {
        # Example: Start a background process to watch files and rebuild.
        # watch-backend = "npm run watch-backend";
      };
    };
  };
}