const LOGGER_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  constructor(level) {
    if (!(level in LOGGER_LEVELS)) level = "debug";
    this.level = LOGGER_LEVELS[level];
  }

  debug(...args) {
    if (this.level <= LOGGER_LEVELS["debug"]) console.debug(args);
  }

  info(...args) {
    if (this.level <= LOGGER_LEVELS["info"]) console.info(args);
  }

  warn(...args) {
    if (this.level <= LOGGER_LEVELS["warn"]) console.warn(args);
  }

  error(...args) {
    if (this.level <= LOGGER_LEVELS["error"]) console.error(args);
  }
}

module.exports = Logger;
