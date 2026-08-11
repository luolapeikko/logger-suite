import type {ILoggerLike, LogMethod, PluginResult} from '@luolapeikko/logger-type';
import type {LogLevelType} from '@luolapeikko/loglevel-type';
import {type KeyLoggerMapInfer, KeyLoggerPlugin} from './KeyLoggerPlugin';

/**
 * [KeyLogger](https://luolapeikko.github.io/logger-suite/classes/_luolapeikko_key-logger.KeyLogger.html) is a logger that extends normal logger and uses a object key mapping to determine the log level for each unique key.
 * It allows log level configuration for different log keys.
 * @template LogMapType Object type with [LogLevelType]{@link LogLevelType} values
 * @example
 * const defaultLogMap = {
 *   test: 'info',
 *   input: 'debug',
 * } as const;
 * const logger = new KeyLogger(defaultLogMap, console);
 * logger.key("test", "goes to info");
 * logger.key("input", "goes to debug");
 * logger.info("this is an info message");
 * @since v0.0.1
 * @see [KeyLogger](https://luolapeikko.github.io/logger-suite/classes/_luolapeikko_key-logger.KeyLogger.html)
 */
export class KeyLogger<LogMapType extends Record<string, LogLevelType>> implements ILoggerLike {
	#plugin: KeyLoggerPlugin<LogMapType>;
	/**
	 * Logger instance that implements {@link ILoggerLike} interface. (console, winston, log4js, etc.)
	 */
	public logger: ILoggerLike | undefined;
	/**
	 * Creates a new KeyLogger instance with the given default log key mapping and optional logger.
	 * @param keyMap default log key mapping object with {@link LogLevelType} values.
	 * @param logger  Logger instance that implements {@link ILoggerLike} interface. (console, winston, log4js, etc.)
	 * @since v0.0.1
	 */
	public constructor(keyMap: LogMapType, logger?: ILoggerLike) {
		this.logger = logger;
		this.#plugin = new KeyLoggerPlugin({keyMap});
	}

	public get logMap(): KeyLoggerMapInfer<LogMapType> {
		return this.#plugin.logMap;
	}

	public set logMap(value: Partial<KeyLoggerMapInfer<LogMapType>>) {
		this.#plugin.logMap = value;
	}

	/**
	 * Set temporary log key mapping to all keys or reset to default mapping if level is undefined.
	 * @param {LogLevelType | undefined} level - log level to set for all keys or undefined to reset to default mapping
	 */
	public setAllLevel(level: LogLevelType | undefined): void {
		this.#plugin.setAllLevel(level);
	}

	public key(key: keyof LogMapType, message: any, ...args: any[]): void {
		if (!this.logger) {
			return;
		}
		const result = this.#plugin.key(key, message, ...args);
		if (result) {
			this.#logging(result);
		}
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
