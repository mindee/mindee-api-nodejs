interface LoggerLevels {
  [index: string]: number;
}

interface LoggerInterface {
  debug(level: any[]): void;
  info(level: any[]): void;
  warn(level: any[]): void;
  error(level: any[]): void;
}

export const LOG_LEVELS: LoggerLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger implements LoggerInterface {
  level: number;

  constructor(public levelToSet: string = "warn") {
    if (!(levelToSet in LOG_LEVELS)) {
      this.level = LOG_LEVELS["debug"];
    }
    this.level = LOG_LEVELS[levelToSet];
  }

  debug(...args: any[]) {
    if (this.level <= LOG_LEVELS["debug"]) console.debug(args);
  }

  info(...args: any[]) {
    if (this.level <= LOG_LEVELS["info"]) console.info(args);
  }

  warn(...args: any[]) {
    if (this.level <= LOG_LEVELS["warn"]) console.warn(args);
  }

  error(...args: any[]) {
    if (this.level <= LOG_LEVELS["error"]) console.error(args);
  }
}

export const logger = new Logger();
