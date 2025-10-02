/**
 * Logger utility with configurable log levels
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

export class Logger {
  private level: LogLevel;
  private prefix: string;

  constructor(level: LogLevel = 'info', prefix = '[SmartBG]') {
    this.level = level;
    this.prefix = prefix;
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Check if level is enabled
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  /**
   * Format message with timestamp and prefix
   */
  private format(level: string, ...args: unknown[]): unknown[] {
    const timestamp = new Date().toISOString().split('T')[1]?.split('.')[0] ?? '';
    return [`${this.prefix} [${timestamp}] [${level.toUpperCase()}]`, ...args];
  }

  /**
   * Debug log
   */
  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.log(...this.format('debug', ...args));
    }
  }

  /**
   * Info log
   */
  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.log(...this.format('info', ...args));
    }
  }

  /**
   * Warning log
   */
  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.format('warn', ...args));
    }
  }

  /**
   * Error log
   */
  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.format('error', ...args));
    }
  }

  /**
   * Group logs
   */
  group(label: string): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.group(`${this.prefix} ${label}`);
    }
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }

  /**
   * Table log
   */
  table(data: unknown): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.table(data);
    }
  }

  /**
   * Time log
   */
  time(label: string): void {
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.time(`${this.prefix} ${label}`);
    }
  }

  /**
   * Time end log
   */
  timeEnd(label: string): void {
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.timeEnd(`${this.prefix} ${label}`);
    }
  }
}

// Create default logger instance
export const logger = new Logger();
