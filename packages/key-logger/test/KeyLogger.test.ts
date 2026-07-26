import type {ILoggerLike} from '@luolapeikko/logger-type';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {KeyLogger} from '../src';

const traceSpy = vi.fn();
const infoSpy = vi.fn();
const warnSpy = vi.fn();
const errorSpy = vi.fn();
const debugSpy = vi.fn();

const spyLogger: ILoggerLike = {
	debug: debugSpy,
	error: errorSpy,
	info: infoSpy,
	trace: traceSpy,
	warn: warnSpy,
};

const logMap = {
	none: 'none',
	trace: 'trace',
	debug: 'debug',
	info: 'info',
	warn: 'warn',
	error: 'error',
} as const;

let logger: KeyLogger<typeof logMap>;

describe('LevelLogger', function () {
	beforeEach(function () {
		traceSpy.mockClear();
		infoSpy.mockClear();
		warnSpy.mockClear();
		errorSpy.mockClear();
		debugSpy.mockClear();
		logger = new KeyLogger(logMap, spyLogger);
	});
	it('should test trace level', function () {
		logger.key('trace', 'goes to trace');
		expect(traceSpy).toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
		expect(traceSpy).toHaveBeenCalledWith('goes to trace');
	});
	it('should test debug level', function () {
		logger.key('debug', 'goes to debug');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
		expect(debugSpy).toHaveBeenCalledWith('goes to debug');
	});
	it('should test info level', function () {
		logger.key('info', 'goes to info');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
		expect(infoSpy).toHaveBeenCalledWith('goes to info');
	});
	it('should test warn level', function () {
		logger.key('warn', 'goes to warn');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith('goes to warn');
	});
	it('should test error level', function () {
		logger.key('error', 'goes to error');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalledWith('goes to error');
	});
	it('should test none level', function () {
		logger.key('none', 'goes to none');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
	});
	it('should map none() to error level', function () {
		logger.logMap = {none: 'error'};
		logger.setAllLevel('error');
		logger.key('none', 'goes to error');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalledWith('goes to error');
		logger.setAllLevel(undefined);
	});
	it('should throw if key does not exists or undefined', function () {
		logger.logMap = {none: undefined} as any;
		expect(() => logger.key('none', 'goes to error')).to.throw(
			Error,
			'KeyLogger: Invalid log level: undefined, expected one of [none, trace, debug, info, warn, error]',
		);
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
	});
	it('should throw if key is not valid', function () {
		logger.logMap = {none: 'not-valid'} as any;
		expect(() => logger.key('none', 'goes to error')).to.throw(
			Error,
			'KeyLogger: Invalid log level: "not-valid", expected one of [none, trace, debug, info, warn, error]',
		);
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
	});
	it('should not log if logger is undefined', function () {
		logger.logger = undefined;
		logger.key('error', 'goes to error');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
	});
	it('test empty logging', function () {
		logger = new KeyLogger(logMap);
		logger.key('error', 'goes to error');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
	});
	it('test default logger methods', function () {
		logger = new KeyLogger(logMap, spyLogger);
		logger.debug('goes to debug');
		logger.info('goes to info');
		logger.warn('goes to warn');
		logger.error('goes to error');
		logger.trace('goes to trace');
		expect(traceSpy).toHaveBeenCalled();
		expect(debugSpy).toHaveBeenCalled();
		expect(infoSpy).toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalled();
	});
	it('should get logMap', function () {
		expect(logger.logMap).to.be.eql(logMap);
	});
});
