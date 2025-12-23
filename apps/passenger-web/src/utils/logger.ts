/**
 * Custom logger for production-safe logging
 * Allows keeping logs for specific files/features in production
 */

const isDev = process.env.NODE_ENV === 'development';

// Files/features that should keep logs in production
const PRODUCTION_LOG_WHITELIST = [
  'payment',
  'checkout',
  'booking',
  'auth',
  'firebase',
  'loginmodal',
  // Add more as needed
];

/**
 * Check if logging is enabled for a specific context
 */
const isLogEnabled = (context?: string): boolean => {
  if (isDev) return true;
  if (!context) return false;
  return PRODUCTION_LOG_WHITELIST.some(item => 
    context.toLowerCase().includes(item)
  );
};

/**
 * Custom logger that respects production whitelist
 */
export const logger = {
  /**
   * Debug logs - only in development or whitelisted contexts
   */
  debug: (message: string, context?: string, ...args: any[]) => {
    if (isLogEnabled(context)) {
      console.log(`[DEBUG${context ? `:${context}` : ''}]`, message, ...args);
    }
  },

  /**
   * Info logs - kept in production for whitelisted contexts
   */
  info: (message: string, context?: string, ...args: any[]) => {
    if (isLogEnabled(context)) {
      console.info(`[INFO${context ? `:${context}` : ''}]`, message, ...args);
    }
  },

  /**
   * Warning logs - always kept in production
   */
  warn: (message: string, context?: string, ...args: any[]) => {
    console.warn(`[WARN${context ? `:${context}` : ''}]`, message, ...args);
  },

  /**
   * Error logs - always kept in production
   */
  error: (message: string, context?: string, ...args: any[]) => {
    console.error(`[ERROR${context ? `:${context}` : ''}]`, message, ...args);
  },

  /**
   * Force log - always logs regardless of environment
   */
  force: (message: string, context?: string, ...args: any[]) => {
    console.log(`[FORCE${context ? `:${context}` : ''}]`, message, ...args);
  },
};

/**
 * Create a scoped logger for a specific context
 */
export const createLogger = (context: string) => ({
  debug: (message: string, ...args: any[]) => logger.debug(message, context, ...args),
  info: (message: string, ...args: any[]) => logger.info(message, context, ...args),
  warn: (message: string, ...args: any[]) => logger.warn(message, context, ...args),
  error: (message: string, ...args: any[]) => logger.error(message, context, ...args),
  force: (message: string, ...args: any[]) => logger.force(message, context, ...args),
});

export default logger;
