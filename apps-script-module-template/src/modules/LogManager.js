/* global LOG_LEVEL */

/**
 * Logging manager for Google Apps Script.
 * @param {Object} params - Configuration parameters for the log manager.
 * @param {string} params.logLevel - Log level (e.g., 'INFO', 'WARNING', 'ERROR'), defaults to 'INFO'.
 * @returns {Object} An object containing logging methods.
 */
const gasLogManager = (params = {}) => {
  const { logLevel = 'INFO' } = params;

  // Define log levels and their priorities
  const levels = {
    'LOG': 1,
    'INFO': 2,
    'WARNING': 3,
    'ERROR': 4
  };

  /**
   * Determines if a message should be logged based on its level.
   * @param {string} level - The level of the log.
   * @returns {boolean} True if should log, false otherwise.
   */
  const shouldLog = (level) => levels[level] >= levels[logLevel];

  /**
   * Logs a general message.
   * @param {string} message - The message to log.
   */
  const log = (message) => {
    if (shouldLog('LOG')) {
      // If the log level is 'LOG' and the message is too long, split it up
      if (logLevel === 'LOG' && message.length > 5000) {
        let start = 0;
        while (start < message.length) {
          const end = Math.min(start + 5000, message.length); // Calculate the end index
          const chunk = message.substring(start, end);
          console.log(chunk);
          start += 5000;
        }
      } else {
        console.log(message);
      }
    }
  }

  /**
   * Logs an informational message.
   * @param {string} message - The message to log.
   */
  const info = (message) => {
    if (shouldLog('INFO')) {
      console.info(message);
    }
  };

  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   */
  const warn = (message) => {
    if (shouldLog('WARNING')) {
      console.warn(message);
    }
  };

  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   */
  const error = (message) => {
    if (shouldLog('ERROR')) {
      console.error(message);
    }
  };

  // Return the logging methods, freezing the object to prevent modification
  return Object.freeze({
    log,
    info,
    warn,
    error,
  });
};