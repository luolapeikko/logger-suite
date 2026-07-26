import type {ILoggerLike} from '@luolapeikko/logger-type';
import type {LogLevelType} from '@luolapeikko/loglevel-type';

/**
 * KeyLoggerMapInfer is a type for inferring log key mapping from default log key object.
 * @template T Object type with [LogLevelType]{@link LogLevelType} values
 * @since v0.0.1
 */
export type KeyLoggerMapInfer<T extends Record<string, LogLevelType> = Record<string, LogLevelType>> = Record<keyof T, LogLevelType>;

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
	static readonly #levelSet: Set<LogLevelType> = new Set(['none', 'trace', 'debug', 'info', 'warn', 'error']);
	static #assertLevel(level: LogLevelType | undefined): asserts level is LogLevelType {
		if (!level || !KeyLogger.#levelSet.has(level)) {
			throw new TypeError(`KeyLogger: Invalid log level: ${JSON.stringify(level)}, expected one of [${Array.from(KeyLogger.#levelSet).join(', ')}]`);
		}
	}
	#logMap: Map<keyof LogMapType, LogLevelType>;
	#defaultLogMap: Readonly<KeyLoggerMapInfer<LogMapType>>;
	/**
	 * Logger instance that implements {@link ILoggerLike} interface. (console, winston, log4js, etc.)
	 */
	public logger: ILoggerLike | undefined;
	/**
	 * Creates a new KeyLogger instance with the given default log key mapping and optional logger.
	 * @param defaultMap default log key mapping object with {@link LogLevelType} values.
	 * @param logger  Logger instance that implements {@link ILoggerLike} interface. (console, winston, log4js, etc.)
	 * @since v0.0.1
	 */
	public constructor(defaultMap: LogMapType, logger?: ILoggerLike) {
		this.logger = logger;
		this.#defaultLogMap = Object.freeze(Object.assign({}, defaultMap)); // clone and freeze the default map.
		this.#logMap = new Map(Object.entries(defaultMap) as [keyof LogMapType, LogLevelType][]);
	}

	public get logMap(): KeyLoggerMapInfer<LogMapType> {
		return Object.fromEntries(this.#logMap) as KeyLoggerMapInfer<LogMapType>;
	}

	public set logMap(value: Partial<KeyLoggerMapInfer<LogMapType>>) {
		this.#logMap = new Map(Object.entries({...this.#defaultLogMap, ...value}) as [keyof LogMapType, LogLevelType][]);
	}

	/**
	 * Set temporary log key mapping to all keys or reset to default mapping if level is undefined.
	 * @param {LogLevelType | undefined} level - log level to set for all keys or undefined to reset to default mapping
	 */
	public setAllLevel(level: LogLevelType | undefined): void {
		if (!level) {
			this.#logMap = new Map(Object.entries(this.#defaultLogMap) as [keyof LogMapType, LogLevelType][]);
		} else {
			for (const key of this.#logMap.keys()) {
				this.#logMap.set(key, level);
			}
		}
	}

	public key(key: keyof LogMapType, message: any, ...args: any[]): void {
		if (!this.logger) {
			return;
		}
		const level = this.#logMap.get(key);
		KeyLogger.#assertLevel(level);
		switch (level) {
			case 'trace':
				this.logger.trace?.(message, ...args);
				break;
			case 'debug':
				this.logger.debug(message, ...args);
				break;
			case 'info':
				this.logger.info(message, ...args);
				break;
			case 'warn':
				this.logger.warn(message, ...args);
				break;
			case 'error':
				this.logger.error(message, ...args);
				break;
			case 'none':
				// Do nothing
				break;
		}
	}

	public debug(message: any, ...args: any[]): void {
		this.logger?.debug(message, ...args);
	}
	public info(message: any, ...args: any[]): void {
		this.logger?.info(message, ...args);
	}
	public warn(message: any, ...args: any[]): void {
		this.logger?.warn(message, ...args);
	}
	public error(message: any, ...args: any[]): void {
		this.logger?.error(message, ...args);
	}
	public trace(message: any, ...args: any[]): void {
		this.logger?.trace?.(message, ...args);
	}
}
