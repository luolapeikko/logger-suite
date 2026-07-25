/**
 * [LogLevelType](https://luolapeikko.github.io/logger-suite/types/_luolapeikko_loglevel-type.LogLevelType.html) is a type definition for log levels used in logging libraries.
 * It defines the possible log levels that can be used to categorize log messages.
 * @example
 * import type { LogLevelType } from '@luolapeikko/loglevel-type';
 * const level: LogLevelType = 'info';
 * @since v0.0.1
 * @see [LogLevelType](https://luolapeikko.github.io/logger-suite/types/_luolapeikko_loglevel-type.LogLevelType.html)
 */
export type LogLevelType = 'none' | 'trace' | 'debug' | 'info' | 'warn' | 'error';
