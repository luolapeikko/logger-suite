import type {LoggerPlugin, LogMethod, PluginResult} from '@luolapeikko/logger-type';
import type {LogLevelType} from '@luolapeikko/loglevel-type';

/**
 * KeyLoggerMapInfer is a type for inferring log key mapping from default log key object.
 * @template T Object type with [LogLevelType]{@link LogLevelType} values
 * @since v0.0.1
 */
export type KeyLoggerMapInfer<T extends Record<string, LogLevelType> = Record<string, LogLevelType>> = Record<keyof T, LogLevelType>;

export type KeyLoggerPluginOptions<LogMapType extends Record<string, LogLevelType>> = {
	/**
	 * The default log key mapping object. Each key should have a corresponding [LogLevelType]{@link LogLevelType} value.
	 */
	keyMap: LogMapType;
	disabled?: boolean | (() => boolean);
};

export class KeyLoggerPlugin<LogMapType extends Record<string, LogLevelType>> implements LoggerPlugin {
	static readonly #levelSet: Set<LogLevelType> = new Set(['none', 'trace', 'debug', 'info', 'warn', 'error']);
	static #assertLevel(level: LogLevelType | undefined): asserts level is LogLevelType {
		if (!level || !KeyLoggerPlugin.#levelSet.has(level)) {
			throw new TypeError(`KeyLogger: Invalid log level: ${JSON.stringify(level)}, expected one of [${Array.from(KeyLoggerPlugin.#levelSet).join(', ')}]`);
		}
	}
	#logMap: Map<keyof LogMapType, LogLevelType>;
	#defaultLogMap: Readonly<KeyLoggerMapInfer<LogMapType>>;
	#disabled: boolean | (() => boolean);
	public constructor(options: KeyLoggerPluginOptions<LogMapType>) {
		this.#defaultLogMap = Object.freeze(Object.assign({}, options.keyMap)); // clone and freeze the default map.
		this.#logMap = new Map(Object.entries(options.keyMap) as [keyof LogMapType, LogLevelType][]);
		this.#disabled = options.disabled ?? false;
	}

	public handle(level: LogMethod, message: any, ...args: any[]): PluginResult {
		return {nextLevel: level, nextArgs: [message, ...args]};
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
	public key(key: keyof LogMapType, message: any, ...args: any[]): PluginResult | undefined {
		if (typeof this.#disabled === 'function' ? this.#disabled() : this.#disabled) {
			return undefined;
		}
		const level = this.#logMap.get(key);
		KeyLoggerPlugin.#assertLevel(level);
		switch (level) {
			case 'none':
				return undefined;
			default:
				return this.handle(level, message, ...args);
		}
	}
}
