import type {LoggerPlugin, LogMethod, PluginResult} from '@luolapeikko/logger-type';

export type PrefixLoggerPluginOptions = {
	/**
	 * The prefix string to be added to the log message.
	 */
	prefix: string;
	disabled?: boolean | (() => boolean);
};

export class PrefixLoggerPlugin implements LoggerPlugin {
	public readonly prefix: string;
	#disabled: boolean | (() => boolean);
	public constructor(options: PrefixLoggerPluginOptions) {
		this.prefix = options.prefix;
		this.#disabled = options.disabled ?? false;
	}
	public handle(level: LogMethod, message: any, ...args: any[]): PluginResult {
		if (typeof this.#disabled === 'function' ? this.#disabled() : this.#disabled) {
			return {nextLevel: level, nextArgs: [message, ...args]};
		}
		return {nextLevel: level, nextArgs: [this.prefix, message, ...args]};
	}
}
