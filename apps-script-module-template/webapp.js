// src/webapp.js

/* global HtmlService, Logger, gasErrorManager, gasTimeManager, gasGreeterManager */

/**
 * Serves the HTML for the web application.
 * @param {GoogleAppsScript.Events.DoGet} e The event parameter for a GET request.
 * @return {GoogleAppsScript.HTML.HtmlOutput} The HTML output for the web application.
 */
function doGet(e) {
    Logger.log("doGet called for Hello App");
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Simple Hello App')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
  }
  
  /**
   * Handles the request from the client-side to generate a greeting.
   *
   * @param {string} name The name to greet.
   * @return {object} An object with status and message/data.
   *                  e.g., { status: 'success', message: 'Hello, Name!' } or
   *                        { status: 'error', message: 'Error details' }
   */
  function handleHelloRequest(name) {
    Logger.log(`handleHelloRequest received name: '${name}'`);
  
    try {
      // Initialize managers for this request
      // Use Logger for server-side logging within modules
      const errorMgr = gasErrorManager({ logErrors: true, logManager: Logger });
      // Give a short time budget for a simple web app request
      const timeMgr = gasTimeManager({ availableTime: 5000, logManager: Logger }); // 5 seconds
  
      const greeterMgr = gasGreeterManager({
        timeManager: timeMgr,
        errorManager: errorMgr,
        logManager: Logger
      }, {
        estimatedTimePerGreetingMs: 100, // Estimate for one greeting
        defaultGreeting: "Hi there"
      });
  
      // Use the GreeterManager to greet the single name
      // greetAll expects an array of names
      const result = greeterMgr.greetAll([name || "Mysterious User"]); // Handle empty name
  
      if (result.status === "success" && result.greetings.length > 0) {
        Logger.log(`Successfully greeted: ${result.greetings[0]}`);
        return { status: 'success', message: result.greetings[0] };
      } else if (result.status.startsWith("partial") && result.greetings.length > 0) {
        // If it was partial but we got at least one greeting (for the single name)
        Logger.log(`Partially successful greeting (likely due to internal item error, not time for one item): ${result.greetings[0]}. Errors: ${result.errors.join('; ')}`);
        return { status: 'success', message: `${result.greetings[0]} (Note: Some issues occurred: ${result.errors.join('; ')})` };
      } else {
        // Handle cases where greetAll might not produce a greeting (e.g., time limit hit before first item)
        // or other error statuses from GreeterManager
        const errorMessage = `Failed to generate greeting. Status: ${result.status}. Errors: ${result.errors.join('; ')}`;
        Logger.log(`Error in handleHelloRequest: ${errorMessage}`);
        return { status: 'error', message: errorMessage };
      }
  
    } catch (e) {
      // This catches errors thrown by errorManager.throwError or other unexpected errors
      Logger.log(`Critical error in handleHelloRequest: ${e.message} (Code: ${e.errorCode || 'N/A'})\nStack: ${e.stack}`);
      return {
        status: 'error',
        message: `Server error: ${e.message} ${e.errorCode ? `(Code: ${e.errorCode})` : ''}`
      };
    }
  }