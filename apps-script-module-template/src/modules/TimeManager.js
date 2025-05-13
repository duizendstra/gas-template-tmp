/**
 * Creates a time manager to track and manage available time for operations,
 * often useful in environments with execution time limits like Google Apps Script.
 * @param {Object} [params] - Optional parameters.
 * @param {number} [params.availableTime=290000] - Available time in milliseconds (default is 4 minutes 50 seconds, providing a buffer for typical 5/6 min limits).
 * @param {Object} [params.logManager=console] - Logger for debugging (e.g., console or Logger service in GAS).
 * @returns {Object} The time manager object.
 */
const gasTimeManager = (params = {}) => {
  // Default with a small safety margin from 300000 (5 mins)
  let {
    availableTime = 290000,
    logManager = console
  } = params;

  logManager.log(`timeManager initialized with availableTime: ${availableTime} ms`);

  let startTime = Date.now();

  /**
   * Calculates the current time status.
   * @returns {{elapsedTime: number, remainingTime: number}}
   * @private
   */
  const _getTimeStatus = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = availableTime - elapsedTime;
      return { elapsedTime, remainingTime };
  };

  /**
   * Checks if there is enough time left to perform an operation.
   * Note: operationTime should be an *estimate* and include a safety margin.
   * @param {number} operationTime - The estimated time required for the operation in milliseconds. Must be positive.
   * @returns {boolean} True if there is enough time left, false otherwise.
   */
  const hasEnoughTime = (operationTime) => {
    if (operationTime <= 0) {
        logManager.log(`Warning: hasEnoughTime called with non-positive operationTime: ${operationTime} ms`);
        // Decide behaviour: return true (zero time needed) or false (invalid input)?
        // Returning true seems safer if 0 means 'negligible time'.
        return _getTimeStatus().remainingTime >= 0;
    }
    logManager.log(`timeManager.hasEnoughTime(${operationTime} ms)`);
    const { elapsedTime, remainingTime } = _getTimeStatus();
    logManager.log(`Elapsed time: ${elapsedTime} ms, Remaining time: ${remainingTime} ms`);
    return remainingTime >= operationTime;
  };

  /**
   * Updates the total available time limit. The already elapsed time is maintained.
   * @param {number} newAvailableTime - The new total available time in milliseconds.
   */
  const updateAvailableTime = (newAvailableTime) => {
    logManager.log(`timeManager.updateAvailableTime(${newAvailableTime} ms)`);
    availableTime = newAvailableTime;
    // Log the status with the new available time
    logTimeStatus();
  };

  /**
   * Logs the current time status, including elapsed, remaining, and total available time.
   */
  const logTimeStatus = () => {
    const { elapsedTime, remainingTime } = _getTimeStatus();
    logManager.log(`Time Status - Elapsed: ${elapsedTime} ms, Remaining: ${remainingTime} ms, Total Available: ${availableTime} ms`);
  };

  /**
   * Resets the timer's start point to the current time.
   * This effectively discards the previously elapsed time count and starts timing anew
   * against the currently set 'availableTime'. Useful when starting a distinct operational
   * phase that needs its own time budget check.
   */
  const resetStartTime = () => {
    logManager.log("timeManager.resetStartTime()");
    startTime = Date.now();
    logTimeStatus(); // Log status after reset
  };

  return {
    hasEnoughTime,
    updateAvailableTime,
    logTimeStatus,
    resetStartTime // Renamed from flushTime
    // Optionally expose getTimeStatus if direct access to numbers is needed
    // getTimeStatus: _getTimeStatus
  };
};