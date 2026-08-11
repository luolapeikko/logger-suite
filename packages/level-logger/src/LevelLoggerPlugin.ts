import type {LoggerPlugin, LogMethod, PluginResult} from '@luolapeikko/logger-type';
import type {LogLevelType} from '@luolapeikko/loglevel-type';

export type LevelLoggerPluginOptions = {
	/**
	 * The minimum log level to be logged (default: 'debug'). Messages with a lower level will be ignored.
	 */
	level: LogLevelType;
	disabled?: boolean | (() => boolean);
};

export class LevelLoggerPlugin implements LoggerPlugin {
	static readonly #levelSet: Set<LogLevelType> = new Set(['none', 'trace', 'debug', 'info', 'warn', 'error']);
	static #assertLevel(level: LogLevelType | undefined): asserts level is LogLevelType {
		if (!level || !LevelLoggerPlugin.#levelSet.has(level)) {
			throw new TypeError(
				`LevelLoggerPlugin: Invalid log level: ${JSON.stringify(level)}, expected one of [${Array.from(LevelLoggerPlugin.#levelSet).join(', ')}]`,
			);
		}
	}
	static #getNumberLevel(level: LogLevelType): 1 | 2 | 3 | 4 | 5 | 6 {
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
	#currentLevel: LogLevelType;
	#initial: LogLevelType;
	#disabled: boolean | (() => boolean);
	public constructor(options?: LevelLoggerPluginOptions) {
		LevelLoggerPlugin.#assertLevel(options?.level);
		this.#initial = options?.level ?? 'debug';
		this.#currentLevel = this.#initial;
		this.#disabled = options?.disabled ?? false;
	}
	public get level(): LogLevelType {
		return this.#currentLevel;
	}

	/**
	 * Set temporary log level for all LevelLogger methods. If level is undefined, it will reset to the initial level.
	 * @param level The log level to set for all methods, or undefined to reset to the initial level.
	 */
	public set level(value: LogLevelType | undefined) {
		if (value !== undefined) {
			LevelLoggerPlugin.#assertLevel(value);
		}
		this.#currentLevel = value ?? this.#initial;
	}

	public handle(level: LogMethod, message: any, ...args: any[]): PluginResult {
		if (typeof this.#disabled === 'function' ? this.#disabled() : this.#disabled) {
			return {nextLevel: level, nextArgs: [message, ...args]};
		}
		if (LevelLoggerPlugin.#getNumberLevel(this.#currentLevel) <= LevelLoggerPlugin.#getNumberLevel(level)) {
			return {nextLevel: level, nextArgs: [message, ...args]};
		}
		return {nextLevel: undefined, nextArgs: [message, ...args]};
	}
}
