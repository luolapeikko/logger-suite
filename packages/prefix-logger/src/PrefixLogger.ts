import type {ILoggerLike, LogMethod, PluginResult} from '@luolapeikko/logger-type';
import {PrefixLoggerPlugin, type PrefixLoggerPluginOptions} from './PrefixLoggerPlugin';

/**
 * [PrefixLogger](https://luolapeikko.github.io/logger-suite/classes/_luolapeikko_prefix-logger.PrefixLogger.html) is a logger that add prefix to each log message.
 * @example
 * const logger = new PrefixLogger('ServiceXyz:', console);
 * logger.info('is running');
 * // output: ServiceXyz: is running
 * @since v0.0.1
 * @see [PrefixLogger](https://luolapeikko.github.io/logger-suite/classes/_luolapeikko_prefix-logger.PrefixLogger.html)
 */
export class PrefixLogger implements ILoggerLike {
	/**
	 * Logger instance that implements {@link ILoggerLike} interface. (console, winston, log4js, etc.)
	 */
	public logger: ILoggerLike | undefined;
	#plugin: PrefixLoggerPlugin;
	public constructor(options: PrefixLoggerPluginOptions, logger?: ILoggerLike) {
		this.#plugin = new PrefixLoggerPlugin(options);
		this.logger = logger;
	}

	public debug(message: any, ...args: any[]): void {
		this.#emit('debug', message, ...args);
	}
	public info(message: any, ...args: any[]): void {
		this.#emit('info', message, ...args);
	}
	public warn(message: any, ...args: any[]): void {
		this.#emit('warn', message, ...args);
	}
	public error(message: any, ...args: any[]): void {
		this.#emit('error', message, ...args);
	}
	public trace(message: any, ...args: any[]): void {
		this.#emit('trace', message, ...args);
	}

	#emit(level: LogMethod, message: any, ...args: any[]): void {
		const result = this.#plugin.handle(level, message, ...args);
		this.#logging(result);
	}
	#logging({nextLevel, nextArgs}: PluginResult): void {
		switch (nextLevel) {
			case 'debug':
				this.logger?.debug(...nextArgs);
				break;
			case 'info':
				this.logger?.info(...nextArgs);
				break;
			case 'warn':
				this.logger?.warn(...nextArgs);
				break;
			case 'error':
				this.logger?.error(...nextArgs);
				break;
			case 'trace':
				this.logger?.trace?.(...nextArgs);
				break;
		}
	}
}
