// src/modules/GreeterManager.js

/* global console, Utilities */ // Default logger and Utilities for sleep

/**
 * @module GreeterManager
 * Manages greeting operations, integrating with time, error, and logging managers.
 *
 * @param {Object} dependencies - An object containing instances of required manager modules.
 * @param {Object} dependencies.timeManager - An instance of gasTimeManager.
 * @param {Object} dependencies.errorManager - An instance of gasErrorManager.
 * @param {Object} [dependencies.logManager=console] - A logging utility (e.g., console or Logger).
 * @param {Object} [config={}] - Configuration for the GreeterManager.
 * @param {number} [config.estimatedTimePerGreetingMs=50] - Estimated time in ms to process one greeting.
 * @param {string} [config.defaultGreeting="Hello"] - The default greeting phrase.
 * @returns {Object} An object with methods for greeting management.
 */
const gasGreeterManager = (dependencies, config = {}) => {
    
  if (!dependencies || !dependencies.timeManager || !dependencies.errorManager) {
    throw new Error("GreeterManager requires 'timeManager' and 'errorManager' in dependencies.");
  }

  const {
    timeManager,
    errorManager,
    logManager = console
  } = dependencies;

  const {
    estimatedTimePerGreetingMs = 50,
    defaultGreeting = "Hello"
  } = config;

  logManager.log("gasGreeterManager initialized.");

  /**
   * Greets a list of names, one by one, respecting time limits.
   * Uses Array.every() to allow early exit if time runs out.
   *
   * @param {string[]} names - An array of names to greet.
   * @returns {Object} An object containing a status, a list of generated greetings, and any errors.
   *                   { status: "success"|"partial_time_limit"|"partial_with_errors", greetings: string[], errors: string[] }
   */
  const greetAll = (names) => {
    if (!Array.isArray(names)) {
      errorManager.throwError({
        message: "Input 'names' must be an array.",
        errorCode: "GM_INVALID_INPUT_TYPE",
        additionalProperties: { providedType: typeof names }
      });
    }

    logManager.log(`greetAll received ${names.length} names.`);
    timeManager.logTimeStatus();

    const greetings = [];
    const errorsEncountered = [];
    let processingHaltedByTime = false;
    let itemsProcessedBeforeHalt = 0;

    // Array.every() will stop if the callback returns false.
    names.every((name, index) => {
      itemsProcessedBeforeHalt = index; // Track how many items we *attempted* before a potential halt

      if (!timeManager.hasEnoughTime(estimatedTimePerGreetingMs)) {
        const warningMessage = `Time limit reached. Stopping after attempting to process ${index} of ${names.length} names.`;
        logManager.log(`WARNING: ${warningMessage}`);
        errorsEncountered.push(warningMessage);
        processingHaltedByTime = true;
        return false; // Stop iterating with .every()
      }

      try {
        if (typeof name !== 'string' || name.trim() === '') {
          logManager.log(`Skipping invalid name at index ${index}: '${name}'`);
          errorsEncountered.push(`Invalid name at index ${index}: '${name}'`);
          return true; // Continue to the next name
        }

        Utilities.sleep(10); // Simulate work

        const greeting = `${defaultGreeting}, ${name}! Welcome.`;
        greetings.push(greeting);
        logManager.log(`Greeted: ${name}`);

        if (name === "ErrorTrigger") {
          errorManager.throwError({
            message: `Simulated processing error for name: ${name}`,
            errorCode: "GM_SIMULATED_ERROR",
            additionalProperties: { name }
          });
        }
        return true; // Continue to the next name

      } catch (e) {
        logManager.log(`ERROR greeting '${name}': ${e.message} (Code: ${e.errorCode || 'N/A'})`);
        errorsEncountered.push(`Failed to greet '${name}': ${e.message}`);
        return true; // Continue to the next name even if one item fails (unless time runs out)
      }
    });
    
    // If .every() stopped early due to time, itemsProcessedBeforeHalt will be the index it stopped AT.
    // If it completed all, itemsProcessedBeforeHalt will be names.length - 1.
    // We need to adjust if it was halted by time for the status message.
    if (processingHaltedByTime) {
        logManager.log(`Processing was halted by time limit at index ${itemsProcessedBeforeHalt}.`);
    }


    timeManager.logTimeStatus();

    let status;
    if (processingHaltedByTime) {
      status = "partial_time_limit";
    } else if (errorsEncountered.length > 0) {
      status = "partial_with_errors"; // All items attempted, but some had errors
    } else {
      status = "success"; // All items attempted and no errors
    }

    logManager.log(`greetAll finished. Status: ${status}. Greetings: ${greetings.length}. Errors: ${errorsEncountered.length}.`);
    return {
      status: status,
      greetings: greetings,
      errors: errorsEncountered
    };
  };

  return Object.freeze({
    greetAll
  });
};