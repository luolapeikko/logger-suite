import type {ILoggerLike} from '@luolapeikko/logger-type';
import type {LogLevelType} from '@luolapeikko/loglevel-type';

/**
 * [LevelLogger](https://luolapeikko.github.io/logger-suite/classes/_luolapeikko_level-logger.LevelLogger.html) is a class implementation which can set minimum log levels.
 * @example
 * const logger = new LevelLogger(console, 'info');
 * logger.debug('hello'); // will not be logged
 * logger.level = 'warn'; // set minimum log level to warn
 * logger.level; // returns 'warn'
 * @since v0.0.1
 * @see [LevelLogger](https://luolapeikko.github.io/logger-suite/classes/_luolapeikko_level-logger.LevelLogger.html)
 */
export class LevelLogger implements ILoggerLike {
	static readonly #levelSet: Set<LogLevelType> = new Set(['none', 'trace', 'debug', 'info', 'warn', 'error']);
	static #assertLevel(level: LogLevelType | undefined): asserts level is LogLevelType {
		if (!level || !LevelLogger.#levelSet.has(level)) {
			throw new TypeError(`LevelLogger: Invalid log level: ${JSON.stringify(level)}, expected one of [${Array.from(LevelLogger.#levelSet).join(', ')}]`);
		}
	}
	#level: LogLevelType;
	#initial: LogLevelType;
	/**
	 * Logger instance that implements {@link ILoggerLike} interface. (console, winston, log4js, etc.)
	 */
	public logger: ILoggerLike | undefined;
	public constructor(logger?: ILoggerLike, level: LogLevelType = 'debug') {
		LevelLogger.#assertLevel(level);
		this.#level = level;
		this.#initial = level;
		this.logger = logger;
	}

	public get level(): LogLevelType {
		return this.#level;
	}

	public set level(value: LogLevelType | undefined) {
		if (value !== undefined) {
			LevelLogger.#assertLevel(value);
		}
		this.#level = value ?? this.#initial;
	}

	public trace(message: any, ...args: any[]): void {
		if (this.#getNumberLevel(this.#level) <= 1) {
			this.logger?.trace?.(message, ...args);
		}
	}

	public debug(message: any, ...args: any[]): void {
		if (this.#getNumberLevel(this.#level) <= 2) {
			this.logger?.debug(message, ...args);
		}
	}

	public info(message: any, ...args: any[]): void {
		if (this.#getNumberLevel(this.#level) <= 3) {
			this.logger?.info(message, ...args);
		}
	}

	public warn(message: any, ...args: any[]): void {
		if (this.#getNumberLevel(this.#level) <= 4) {
			this.logger?.warn(message, ...args);
		}
	}

	public error(message: any, ...args: any[]): void {
		if (this.#getNumberLevel(this.#level) <= 5) {
			this.logger?.error(message, ...args);
		}
	}

	#getNumberLevel(level: LogLevelType): 1 | 2 | 3 | 4 | 5 | 6 {
		switch (level) {
			case 'trace':
				return 1;
			case 'debug':
				return 2;
			case 'info':
				return 3;
			case 'warn':
				return 4;
			case 'error':
				return 5;
			case 'none':
				return 6;
		}
	}
}
