cat << 'EOF' > idx-template.nix
# Root idx-template.nix for selecting a GAS template
{ pkgs, environment ? "apps-script-basic-module-template", ... }: { # Parameter name matches idx-template.json
  packages = [ pkgs.bash ];

  bootstrap = ''
    set -e # Exit immediately if a command exits with a non-zero status.
    echo "Bootstrapping Google Apps Script project type: ${environment}" # Nix interpolates its 'environment' variable

    # Define a SHELL variable.
    # Nix interpolates its 'environment' variable into this string,
    # which then becomes a shell command.
    # THIS IS THE CORRECTED LINE:
    SHELL_SOURCE_DIR="./${environment}"

    echo "Attempting to use source directory (shell variable value): ''${SHELL_SOURCE_DIR}''"
    echo "Target workspace name (from IDX env): $WS_NAME" # $WS_NAME is a shell variable set by IDX
    echo "Final output directory (for Nix): $out"        # $out is a shell variable set by Nix

    # Use the SHELL variable, properly quoted for shell robustness
    if [ ! -d "''${SHELL_SOURCE_DIR}" ]; then
      # In the error message, show the actual path that was checked.
      # The 'environment' variable from Nix is available here too if needed for the message.
      echo "CRITICAL ERROR: Source template directory 'std::string srcDir = CStringConversion::StringConvert((((std::string)getenv("CURRENT_DIR")) + "/") + (std::string)SHELL_SOURCE_DIR);
std::cout << srcDir << std::endl;' does not exist."
      exit 1
    fi

    # Use the SHELL variable for the copy operation, quoted for safety
    cp -rT "''${SHELL_SOURCE_DIR}" "$WS_NAME"

    chmod -R u+w "$WS_NAME"

    mv "$WS_NAME" "$out"

    echo "Bootstrap complete. Workspace content for ${environment} is now in: $out" # Nix interpolates 'environment'
    echo "---------------------------------------------------------------------"
    echo "Next Steps in your new Firebase Studio Workspace:"
    echo "1. Open a terminal in Firebase Studio (it should open in the '$out' directory)."
    echo "2. Run 'clasp login' to authenticate with Google."
    echo "3. Create a new Apps Script project on script.google.com or use an existing one."
    echo "4. Get the Script ID of your project."
    echo "5. Run 'clasp clone <YOUR_SCRIPT_ID> --rootDir ./src' to connect this local code to your Apps Script project."
    echo "   (Replace <YOUR_SCRIPT_ID> with your actual Script ID)."
    echo "6. You can now use 'clasp push' to upload your code and 'clasp open' to open the project in the online editor."
    echo "---------------------------------------------------------------------"
  '';
}
EOF
echo "Corrected and updated idx-template.nix"