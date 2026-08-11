import {KeyLoggerPlugin, type KeyLoggerPluginOptions} from '@luolapeikko/key-logger';
import {LevelLoggerPlugin, type LevelLoggerPluginOptions} from '@luolapeikko/level-logger';
import type {ILoggerLike, LogMethod, PluginResult} from '@luolapeikko/logger-type';
import type {LogLevelType} from '@luolapeikko/loglevel-type';
import {PrefixLoggerPlugin, type PrefixLoggerPluginOptions} from '@luolapeikko/prefix-logger';

type LogMapRecord = Record<string, LogLevelType>;

export type LoggerFactoryChain<LogMapType extends LogMapRecord = LogMapRecord> = ILoggerLike & {
	key(key: keyof LogMapType, message: any, ...args: any[]): void;
	withPrefix(options: PrefixLoggerPluginOptions): LoggerFactoryChain<LogMapType>;
	withLevel(options: LevelLoggerPluginOptions): LoggerFactoryChain<LogMapType>;
	withKeys<NextLogMapType extends LogMapRecord>(options: KeyLoggerPluginOptions<NextLogMapType>): LoggerFactoryChain<NextLogMapType>;
	toLogger(): Omit<LoggerFactory<LogMapType>, 'withPrefix' | 'withLevel' | 'withKeys' | 'asChain'>;
};

class LoggerFactory<LogMapType extends LogMapRecord = LogMapRecord> implements ILoggerLike {
	#logger: ILoggerLike | undefined;
	readonly #plugin: {
		level: LevelLoggerPlugin | undefined;
		prefix: PrefixLoggerPlugin | undefined;
		key: KeyLoggerPlugin<LogMapType> | undefined;
	} = {
		level: undefined,
		prefix: undefined,
		key: undefined,
	};

	public constructor(logger?: ILoggerLike | (() => ILoggerLike)) {
		this.setLogger(logger);
	}

	public setLogger(logger?: ILoggerLike | (() => ILoggerLike)): void {
		this.#logger = typeof logger === 'function' ? logger() : logger;
	}

	public withPrefix(options: PrefixLoggerPluginOptions): LoggerFactory<LogMapType> {
		this.#plugin.prefix = new PrefixLoggerPlugin(options);
		return this;
	}

	public withLevel(options: LevelLoggerPluginOptions): LoggerFactory<LogMapType> {
		this.#plugin.level = new LevelLoggerPlugin(options);
		return this;
	}

	public withKeys<NextLogMapType extends LogMapType>(options: KeyLoggerPluginOptions<NextLogMapType>): LoggerFactory<NextLogMapType> {
		this.#plugin.key = new KeyLoggerPlugin<LogMapType>(options);
		return this as unknown as LoggerFactory<NextLogMapType>;
	}

	public key(key: keyof LogMapType, message: any, ...args: any[]): void {
		if (!this.#plugin.key) {
			throw new TypeError('withKeys(...) must be called before key(...)');
		}
		const result = this.#plugin.key.key(key, message, ...args);
		if (!result) {
			return;
		}
		this.#dispatchPipeline(result);
	}

	/**
	 * Set temporary log key mapping to all KeyLogger keys or reset to default mapping if level is undefined.
	 * @param {LogLevelType | undefined} level - log level to set for all keys or undefined to reset to default mapping
	 */
	public setAllLevel(level: LogLevelType | undefined): void {
		if (!this.#plugin.key) {
			throw new TypeError('withKeys(...) must be called before setAllLevels(...)');
		}
		this.#plugin.key.setAllLevel(level);
	}

	/**
	 * Set temporary log level for all LevelLogger methods. If level is undefined, it will reset to the initial level.
	 * @param {LogLevelType | undefined} level The log level to set for all methods, or undefined to reset to the initial level.
	 */
	public level(level: LogLevelType | undefined): void {
		if (!this.#plugin.level) {
			throw new TypeError('withLevel(...) must be called before setAllLevels(...)');
		}
		this.#plugin.level.level = level;
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

	public toLogger(): Omit<LoggerFactory<LogMapType>, 'withPrefix' | 'withLevel' | 'withKeys' | 'asChain'> {
		return this;
	}

	public asChain(): LoggerFactoryChain<LogMapType> {
		return this as unknown as LoggerFactoryChain<LogMapType>;
	}

	#emit(level: LogMethod, message: any, ...args: any[]): void {
		this.#dispatchPipeline({nextLevel: level, nextArgs: [message, ...args]});
	}

	#dispatchPipeline(seed: PluginResult): void {
		let result = seed;
		for (const plugin of Object.values(this.#plugin)) {
			if (!plugin) {
				continue;
			}
			if (!result.nextLevel) {
				return;
			}
			result = plugin.handle(result.nextLevel, ...result.nextArgs);
		}
		this.#dispatchToLogger(result);
	}

	#dispatchToLogger({nextLevel, nextArgs}: PluginResult): void {
		switch (nextLevel) {
			case 'debug':
				this.#logger?.debug(...nextArgs);
				break;
			case 'info':
				this.#logger?.info(...nextArgs);
				break;
			case 'warn':
				this.#logger?.warn(...nextArgs);
				break;
			case 'error':
				this.#logger?.error(...nextArgs);
				break;
			case 'trace':
				this.#logger?.trace?.(...nextArgs);
				break;
		}
	}
}

/**
 * Creates a logger factory that can be configured with prefixes, log levels, and key-based logging.
 * @example
 * const logger = createLogger(console)
 *   .withKeys({
 *      constructor: "info",
 *      method: "debug",
 *      auth_error: "warn",
 *   })
 *   .withPrefix("MyApp:")
 *   .toLogger();
 * logger.key("constructor", "This is an info message");
 * logger.info('This is an info message');
 * @param logger
 * @returns
 */
export function createLogger(logger?: ILoggerLike | (() => ILoggerLike)): LoggerFactoryChain {
	return new LoggerFactory(logger).asChain();
}
