import type {ILoggerLike, LogMethod, PluginResult} from '@luolapeikko/logger-type';
import type {LogLevelType} from '@luolapeikko/loglevel-type';
import {LevelLoggerPlugin, type LevelLoggerPluginOptions} from './LevelLoggerPlugin';

/**
 * [LevelLogger](https://luolapeikko.github.io/logger-suite/classes/_luolapeikko_level-logger.LevelLogger.html) is a class implementation which can set minimum log levels.
 * @example
 * const logger = new LevelLogger({level: 'info'}, console);
 * logger.debug('hello'); // will not be logged
 * logger.level = 'warn'; // set minimum log level to warn
 * logger.level; // returns 'warn'
 * @since v0.0.1
 * @see [LevelLogger](https://luolapeikko.github.io/logger-suite/classes/_luolapeikko_level-logger.LevelLogger.html)
 */
export class LevelLogger implements ILoggerLike {
	#plugin: LevelLoggerPlugin;
	/**
	 * Logger instance that implements {@link ILoggerLike} interface. (console, winston, log4js, etc.)
	 */
	public logger: ILoggerLike | undefined;
	public constructor(options: LevelLoggerPluginOptions = {level: 'debug'}, logger?: ILoggerLike) {
		this.#plugin = new LevelLoggerPlugin(options);
		this.logger = logger;
	}

	public get level(): LogLevelType {
		return this.#plugin.level;
	}

	/**
	 * Set temporary log level for all LevelLogger methods. If level is undefined, it will reset to the initial level.
	 * @param level The log level to set for all methods, or undefined to reset to the initial level.
	 */
	public set level(value: LogLevelType | undefined) {
		this.#plugin.level = value;
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
