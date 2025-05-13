/* global HtmlService, Logger, gasErrorManager, gasTimeManager, gasGreeterManager, gasLogManager */

/**
 * Serves the HTML for the web application.
 * @param {GoogleAppsScript.Events.DoGet} e The event parameter for a GET request.
 * @return {GoogleAppsScript.HTML.HtmlOutput} The HTML output for the web application.
 */
function doGet(e) {
  // Use gasLogManager if available and configured, otherwise fallback to Logger
  const currentLogManager = (typeof gasLogManager !== 'undefined') ? gasLogManager({}).logManager : Logger;
  currentLogManager.log("WebApp: doGet called");

  try {
    return HtmlService.createHtmlOutputFromFile('index') // Assumes index.html is at the same level
      .setTitle('Simple Hello App')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
  } catch (error) {
    currentLogManager.log(`WebApp: Error in doGet - ${error.toString()}`);
    return HtmlService.createHtmlOutput(
      `<h1>Error</h1><p>Could not load the application interface. Please try again later.</p><p><small>Details: ${error.message}</small></p>`
    ).setTitle("Application Interface Error");
  }
}

/**
 * Handles the request from the client-side JavaScript to generate a greeting.
 * @param {string} name The name to greet, received from the client.
 * @return {object} An object with status and message.
 */
function handleHelloRequest(name) {
  // Determine the logger to use (gasLogManager or fallback to Logger)
  const baseLogger = (typeof gasLogManager !== 'undefined') ? gasLogManager({}).logManager : Logger;
  baseLogger.log(`WebApp: handleHelloRequest received name: '${name}'`);

  try {
    // --- Initialize Managers ---
    const errorMgr = gasErrorManager({ logErrors: true, logManager: baseLogger });
    const timeMgr = gasTimeManager({ availableTime: 5000, logManager: baseLogger }); // 5 seconds budget

    const greeterMgr = gasGreeterManager({
      timeManager: timeMgr,
      errorManager: errorMgr,
      logManager: baseLogger
    }, {
      estimatedTimePerGreetingMs: 100,
      defaultGreeting: "Hi from Apps Script"
    });

    // --- Use the GreeterManager ---
    const namesToGreet = [name || "User"]; // Fallback for empty name
    const greetingResult = greeterMgr.greetAll(namesToGreet);

    // --- Process Result ---
    if (greetingResult.status === "success" && greetingResult.greetings.length > 0) {
      const message = greetingResult.greetings[0];
      baseLogger.log(`WebApp: Successfully generated greeting - "${message}"`);
      return { status: 'success', message: message };
    } else if (greetingResult.status.startsWith("partial") && greetingResult.greetings.length > 0) {
      const message = greetingResult.greetings[0];
      const issues = greetingResult.errors.join('; ');
      baseLogger.log(`WebApp: Partially successful greeting - "${message}". Issues: ${issues}`);
      return { status: 'success', message: `${message} (Note: Some processing issues: ${issues})` };
    } else {
      const errorMessage = `Failed to generate greeting. Status: ${greetingResult.status}. Details: ${greetingResult.errors.join('; ')}`;
      baseLogger.log(`WebApp: Error from GreeterManager - ${errorMessage}`);
      return { status: 'error', message: errorMessage };
    }

  } catch (e) {
    baseLogger.log(`WebApp: CRITICAL error in handleHelloRequest - Message: ${e.message}, Code: ${e.errorCode || 'N/A'}, Stack: ${e.stack}`);
    return {
      status: 'error',
      message: `Server error: ${e.message} ${e.errorCode ? `(Code: ${e.errorCode})` : '(No error code)'}`
    };
  }
}
