import type {ILoggerLike} from '@luolapeikko/logger-type';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createLogger} from '../src';

const traceSpy = vi.fn();
const debugSpy = vi.fn();
const infoSpy = vi.fn();
const warnSpy = vi.fn();
const errorSpy = vi.fn();

const logger: ILoggerLike = {
	debug: debugSpy,
	error: errorSpy,
	info: infoSpy,
	trace: traceSpy,
	warn: warnSpy,
};

describe('FactoryLogger', function () {
	beforeEach(function () {
		traceSpy.mockClear();
		debugSpy.mockClear();
		infoSpy.mockClear();
		warnSpy.mockClear();
		errorSpy.mockClear();
	});

	it('should test prefix logger', function () {
		const serviceLogger = createLogger(logger).withPrefix({prefix: 'service:'}).toLogger();
		serviceLogger.info('info');
		expect(infoSpy).toHaveBeenCalledTimes(1);
		expect(infoSpy.mock.calls[0]).to.be.eql(['service:', 'info']);
	});

	it('should test level logger', function () {
		const serviceLogger = createLogger(logger).withLevel({level: 'error'}).toLogger();
		serviceLogger.trace('trace');
		serviceLogger.debug('debug');
		serviceLogger.info('info');
		serviceLogger.warn('warn');
		serviceLogger.error('error');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalledTimes(1);
	});

	it('should test key logger', function () {
		const serviceLogger = createLogger(logger)
			.withKeys({keyMap: {key1: 'info', key2: 'error'}})
			.toLogger();
		serviceLogger.key('key1', 'message1');
		serviceLogger.key('key2', 'message2');
		expect(infoSpy).toHaveBeenCalledTimes(1);
		expect(errorSpy).toHaveBeenCalledTimes(1);
		expect(infoSpy.mock.calls[0]).to.be.eql(['message1']);
		expect(errorSpy.mock.calls[0]).to.be.eql(['message2']);
	});

	it('should skip key logging when key level is none', function () {
		const serviceLogger = createLogger(logger)
			.withKeys({keyMap: {quiet: 'none', loud: 'warn'}})
			.toLogger();
		serviceLogger.key('quiet', 'message1');
		serviceLogger.key('loud', 'message2');
		expect(traceSpy).not.toHaveBeenCalled();
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy.mock.calls[0]).to.be.eql(['message2']);
	});

	it('should throw when key() is called without withKeys()', function () {
		const serviceLogger = createLogger(logger).toLogger();
		expect(() => serviceLogger.key('missing', 'message')).to.throw(TypeError, 'withKeys(...) must be called before key(...)');
	});

	it('should dispatch debug and trace directly without plugins', function () {
		const serviceLogger = createLogger(logger).toLogger();
		serviceLogger.debug('debug');
		serviceLogger.trace('trace');
		expect(debugSpy).toHaveBeenCalledTimes(1);
		expect(traceSpy).toHaveBeenCalledTimes(1);
		expect(debugSpy.mock.calls[0]).to.be.eql(['debug']);
		expect(traceSpy.mock.calls[0]).to.be.eql(['trace']);
	});

	it('should support lazy logger factory input', function () {
		const serviceLogger = createLogger(() => logger).toLogger();
		serviceLogger.info('lazy');
		expect(infoSpy).toHaveBeenCalledTimes(1);
		expect(infoSpy.mock.calls[0]).to.be.eql(['lazy']);
	});

	it('should test if first plugin blocks the log', function () {
		const serviceLogger = createLogger(logger).withLevel({level: 'error'}).withKeys({keyMap: {}}).toLogger();
		serviceLogger.info('info');
		expect(infoSpy).toHaveBeenCalledTimes(0);
	});

	it('should update logger instance via setLogger()', function () {
		const anotherInfoSpy = vi.fn();
		const otherLogger: ILoggerLike = {
			debug: vi.fn(),
			error: vi.fn(),
			info: anotherInfoSpy,
			trace: vi.fn(),
			warn: vi.fn(),
		};
		const serviceLogger = createLogger(logger).toLogger();
		serviceLogger.setLogger(otherLogger);
		serviceLogger.info('switch-target');
		expect(infoSpy).not.toHaveBeenCalled();
		expect(anotherInfoSpy).toHaveBeenCalledTimes(1);
		expect(anotherInfoSpy.mock.calls[0]).to.be.eql(['switch-target']);
	});

	it('should set and reset level using level()', function () {
		const serviceLogger = createLogger(logger).withLevel({level: 'warn'}).toLogger();
		serviceLogger.info('hidden');
		expect(infoSpy).not.toHaveBeenCalled();

		serviceLogger.level('info');
		serviceLogger.info('visible');
		expect(infoSpy).toHaveBeenCalledTimes(1);
		expect(infoSpy.mock.calls[0]).to.be.eql(['visible']);

		serviceLogger.level(undefined);
		serviceLogger.info('hidden-again');
		expect(infoSpy).toHaveBeenCalledTimes(1);
	});

	it('should throw when level() is called without withLevel()', function () {
		const serviceLogger = createLogger(logger).toLogger();
		expect(() => serviceLogger.level('info')).to.throw(TypeError, 'withLevel(...) must be called before setAllLevels(...)');
	});

	it('should set and reset all key levels using setAllLevel()', function () {
		const serviceLogger = createLogger(logger)
			.withKeys({keyMap: {a: 'none', b: 'warn'}})
			.toLogger();

		serviceLogger.setAllLevel('error');
		serviceLogger.key('a', 'a-error');
		serviceLogger.key('b', 'b-error');
		expect(errorSpy).toHaveBeenCalledTimes(2);
		expect(errorSpy.mock.calls[0]).to.be.eql(['a-error']);
		expect(errorSpy.mock.calls[1]).to.be.eql(['b-error']);

		serviceLogger.setAllLevel(undefined);
		serviceLogger.key('a', 'a-none');
		serviceLogger.key('b', 'b-warn');
		expect(errorSpy).toHaveBeenCalledTimes(2);
		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy.mock.calls[0]).to.be.eql(['b-warn']);
	});

	it('should throw when setAllLevel() is called without withKeys()', function () {
		const serviceLogger = createLogger(logger).toLogger();
		expect(() => serviceLogger.setAllLevel('error')).to.throw(TypeError, 'withKeys(...) must be called before setAllLevels(...)');
	});
});
