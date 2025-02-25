interface LoggerOptions {
  module: string;
}

type LogData = Record<string, unknown>;

class Logger {
  private module: string;

  constructor(options: LoggerOptions) {
    this.module = options.module;
  }

  private shouldLog(): boolean {
    return process.env.NODE_ENV !== "production";
  }

  private formatMessage(level: string, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.module}] ${message}${
      data ? ` ${JSON.stringify(data, null, 2)}` : ""
    }`;
  }

  info(message: string, data?: LogData) {
    if (this.shouldLog())
      console.info(this.formatMessage("INFO", message, data));
  }

  warn(message: string, data?: LogData) {
    if (this.shouldLog())
      console.warn(this.formatMessage("WARN", message, data));
  }

  error(message: string, data?: LogData) {
    if (this.shouldLog())
      console.error(this.formatMessage("ERROR", message, data));
  }

  debug(message: string, data?: LogData) {
    if (this.shouldLog())
      console.debug(this.formatMessage("DEBUG", message, data));
  }
}

export function createLogger(module: string) {
  return new Logger({ module });
} 