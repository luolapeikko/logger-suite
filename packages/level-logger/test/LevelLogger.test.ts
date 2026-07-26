import type {ILoggerLike} from '@luolapeikko/logger-type';
import type {LogLevelType} from '@luolapeikko/loglevel-type';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {LevelLogger} from '../src';

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

const logger = new LevelLogger(spyLogger);

function setToAll(message: string, ...args: any[]) {
	logger.trace(message, ...args);
	logger.info(message, ...args);
	logger.debug(message, ...args);
	logger.warn(message, ...args);
	logger.error(message, ...args);
}

describe('LevelLogger', function () {
	beforeEach(function () {
		traceSpy.mockClear();
		infoSpy.mockClear();
		warnSpy.mockClear();
		errorSpy.mockClear();
		debugSpy.mockClear();
	});
	it('should be trace level', function () {
		logger.level = 'trace';
		setToAll('demo', 'test');
		expect(traceSpy).toHaveBeenCalled();
		expect(debugSpy).toHaveBeenCalled();
		expect(infoSpy).toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalled();
		expect(logger.level).to.be.equal('trace');
		expect(debugSpy.mock.calls[0]?.length).to.be.equal(2);
	});
	it('should be default = debug', function () {
		logger.level = undefined;
		setToAll('demo');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).toHaveBeenCalled();
		expect(infoSpy).toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalled();
		expect(logger.level).to.be.equal('debug');
	});
	it('should be info level', function () {
		logger.level = 'info';
		setToAll('demo');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalled();
		expect(logger.level).to.be.equal('info');
	});
	it('should be warn level', function () {
		logger.level = 'warn';
		setToAll('demo');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalled();
		expect(logger.level).to.be.equal('warn');
	});
	it('should be error level', function () {
		logger.level = 'error';
		setToAll('demo');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalled();
		expect(logger.level).to.be.equal('error');
	});
	it('should not log at none level', function () {
		logger.level = 'none';
		setToAll('demo');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
		expect(logger.level).to.be.equal('none');
	});
	it('should fail to add wrong initial level to logger', function () {
		expect(() => new LevelLogger(spyLogger, -1 as unknown as LogLevelType)).to.throw(
			TypeError,
			'Invalid log level: -1, expected one of [none, trace, debug, info, warn, error]',
		);
	});
	it('should fail to set wrong level to logger', function () {
		expect(() => {
			logger.level = -1 as unknown as LogLevelType;
		}).to.throw(TypeError, 'Invalid log level: -1, expected one of [none, trace, debug, info, warn, error]');
	});
	it('should not log with empty logger', function () {
		logger.logger = undefined;
		setToAll('demo');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
	});
});
