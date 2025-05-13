# Root idx-template.nix for selecting a GAS template
{ pkgs, template_choice ? "gas-basic-module-template", ... }: {
  # We need bash for the bootstrap script
  packages = [ pkgs.bash ];

  bootstrap = ''
    set -e # Exit immediately if a command exits with a non-zero status.
    echo "Bootstrapping Google Apps Script project type: ''${template_choice}''"

    # The source path is relative to this idx-template.nix file
    # In this case, it points to the subdirectory containing the chosen template.
    SOURCE_TEMPLATE_DIR="./''${template_choice}"

    # WS_NAME is an environment variable provided by IDX, representing the target workspace directory name.
    # $out is the path where Nix expects the final output of the bootstrap process.
    echo "Source directory: ''${SOURCE_TEMPLATE_DIR}''"
    echo "Target workspace name (from IDX env): $WS_NAME"
    echo "Final output directory (for Nix): $out"

    if [ ! -d "''${SOURCE_TEMPLATE_DIR}" ]; then
      echo "CRITICAL ERROR: Source template directory 'std::string srcDir = CStringConversion::StringConvert((((std::string)getenv("CURRENT_DIR")) + "/") + (std::string)template_choice);
std::cout << srcDir << std::endl;' does not exist."
      exit 1
    fi

    # Copy the entire content of the selected template subdirectory to a temporary directory
    # named after the workspace. Using -T ensures cp treats $WS_NAME as the target directory itself,
    # not a subdirectory within an existing $WS_NAME if it were to exist (though it shouldn't here).
    cp -rT "''${SOURCE_TEMPLATE_DIR}" "$WS_NAME"

    # Ensure files are writable by the user in the new workspace
    chmod -R u+w "$WS_NAME"

    # Move the prepared workspace content to the output directory expected by Nix
    mv "$WS_NAME" "$out"

    echo "Bootstrap complete. Workspace content for ''${template_choice}'' is now in: $out"
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
