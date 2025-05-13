/**
 * Creates an error manager for generating and throwing customized errors.
 * @param {Object} [params={}] - Configuration parameters for the ErrorManager.
 * @param {boolean} [params.logErrors=false] - Flag to enable or disable error logging.
 * @param {Object} [params.logManager=console] - Custom logger for logging errors.
 * @returns {Object} An object with methods for error management.
 */
const gasErrorManager = (params = {}) => {
    const {
      logErrors = false,
      logManager = console
    } = params;
  
    logManager.log(`gasErrorManager(${JSON.stringify(params)})`);
  
    /**
     * Throws a customized error with additional properties. Optionally logs it to the console based on the config.
     * @param {Object} params - Parameters for the error.
     * @param {string} [params.message="No message provided"] - The error message.
     * @param {string} [params.errorCode="1001"] - A unique code identifying the error type.
     * @param {Object} [params.additionalProperties={}] - Additional properties to be added to the error.
     * @throws {Error} Throws a customized error.
     */
    const throwError = (params = {}) => {
      const { 
        message = "No message provided", 
        errorCode = "1001", 
        additionalProperties = {} 
      } = params;
  
      const error = new Error(message);
      error.errorCode = errorCode;
      error.errorId = `error-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
      // Add any other additional properties
      for (const [key, value] of Object.entries(additionalProperties)) {
        error[key] = value;
      }
  
      // Log the error using logManager if logErrors is true
      if (logErrors) {
        logManager.error(error);
      }
  
      throw error;
    };
  
    return Object.freeze({
      throwError
    });
  };