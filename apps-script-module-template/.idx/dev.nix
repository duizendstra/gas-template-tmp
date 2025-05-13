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
    pkgs.go
    pkgs.nodejs
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

    # Workspace lifecycle hooks.
    workspace = {
      # Runs when a workspace is first created with this file.
      onCreate = {
        # Open these files by default when the workspace is created.
        # The last file in the list will be focused.
        default.openFiles = [
          "README.md"
        ];
        
        # Script to install contextvibes CLI into ./bin
        installContextVibesCli = ''
          echo "Attempting to install contextvibes CLI into ./bin ..."

          if ! command -v go &> /dev/null
          then
              echo "Go command could not be found, skipping contextvibes installation."
              # Exit gracefully or 'exit 1' if critical
              # For now, we'll assume Go is present due to pkgs.go
          else
            LOCAL_BIN_DIR="$(pwd)/bin"
            mkdir -p "$LOCAL_BIN_DIR"
            echo "Target directory for contextvibes: $LOCAL_BIN_DIR"

            export GOBIN="$LOCAL_BIN_DIR"
            echo "Running: GOBIN=$GOBIN go install github.com/contextvibes/cli/cmd/contextvibes@v0.0.6"

            if go install github.com/contextvibes/cli/cmd/contextvibes@latest; then
              echo "Successfully installed contextvibes to $LOCAL_BIN_DIR/contextvibes"
              echo "You can run it using: $LOCAL_BIN_DIR/contextvibes"
              echo "Consider adding '$LOCAL_BIN_DIR' to your PATH for convenience (see README)."
              chmod +x "$LOCAL_BIN_DIR/contextvibes" || echo "Note: chmod +x on contextvibes failed."
            else
              echo "ERROR: Failed to install contextvibes."
            fi
            unset GOBIN
          fi
        '';
      };

      # Runs every time a workspace is started (or restarted).
      onStart = {
      };
    };
  };
}