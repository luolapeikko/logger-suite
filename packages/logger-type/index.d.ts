/**
 * [ILoggerLike](https://luolapeikko.github.io/logger-suite/interfaces/_luolapeikko_logger-type.ILoggerLike.html) is a common logger interface which should work with console, winston, and log4js.
 * @example
 * import type { ILoggerLike } from '@luolapeikko/logger-type';
 * function demo(logger: ILoggerLike) {
 *	 logger.info('hello');
 * }
 * demo(console);
 * @since v0.0.1
 * @see [ILoggerLike](https://luolapeikko.github.io/logger-suite/interfaces/_luolapeikko_logger-type.ILoggerLike.html)
 */
export interface ILoggerLike {
	trace?(message: any, ...args: any[]): void;
	debug(message: any, ...args: any[]): void;
	info(message: any, ...args: any[]): void;
	warn(message: any, ...args: any[]): void;
	error(message: any, ...args: any[]): void;
}
/**
 * Generic logger arguments
 * @since v0.0.4
 */
export type LogArgs = [message: any, ...args: any[]];
/**
 * Log method type
 * @since v0.0.5
 */
export type LogMethod = 'debug' | 'info' | 'warn' | 'error' | 'trace';
export type PluginResult = {nextLevel: LogMethod | undefined; nextArgs: LogArgs};
/**
 * [LoggerPlugin](https://luolapeikko.github.io/logger-suite/interfaces/_luolapeikko_logger-type.LoggerPlugin.html) is a plugin interface for loggers that allows you to modify log messages before they are logged.
 * @since v0.0.6
 * @see [LoggerPlugin](https://luolapeikko.github.io/logger-suite/interfaces/_luolapeikko_logger-type.LoggerPlugin.html)
 */
export interface LoggerPlugin {
	handle(level: LogMethod, ...args: LogArgs): PluginResult;
}
