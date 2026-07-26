import type {ILoggerLike} from '@luolapeikko/logger-type';

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
	public readonly prefix: string;
	/**
	 * Logger instance that implements {@link ILoggerLike} interface. (console, winston, log4js, etc.)
	 */
	public logger: ILoggerLike | undefined;
	public constructor(prefix: string, logger?: ILoggerLike) {
		this.prefix = prefix;
		this.logger = logger;
	}

	public debug(message: any, ...args: any[]): void {
		this.logger?.debug(this.prefix, message, ...args);
	}
	public info(message: any, ...args: any[]): void {
		this.logger?.info(this.prefix, message, ...args);
	}
	public warn(message: any, ...args: any[]): void {
		this.logger?.warn(this.prefix, message, ...args);
	}
	public error(message: any, ...args: any[]): void {
		this.logger?.error(this.prefix, message, ...args);
	}
	public trace(message: any, ...args: any[]): void {
		this.logger?.trace?.(this.prefix, message, ...args);
	}
}
