import type {ILoggerLike} from '@luolapeikko/logger-type';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {PrefixLogger} from '../src';

const loggerSpy = vi.fn();
const logger: ILoggerLike = {
	debug: loggerSpy,
	error: loggerSpy,
	info: loggerSpy,
	trace: loggerSpy,
	warn: loggerSpy,
};

describe('PrefixLogger', function () {
	beforeEach(function () {
		loggerSpy.mockClear();
	});
	it('should get correct prefix to trace', function () {
		const serviceLogger = new PrefixLogger({prefix: 'service:'}, logger);
		serviceLogger.trace('trace');
		expect(loggerSpy).toHaveBeenCalled();
		expect(loggerSpy.mock.calls[0]).to.be.eql(['service:', 'trace']);
	});
	it('should get correct prefix to debug', function () {
		const serviceLogger = new PrefixLogger({prefix: 'service:'}, logger);
		serviceLogger.debug('debug');
		expect(loggerSpy).toHaveBeenCalled();
		expect(loggerSpy.mock.calls[0]).to.be.eql(['service:', 'debug']);
	});
	it('should get correct prefix to info', function () {
		const serviceLogger = new PrefixLogger({prefix: 'service:'}, logger);
		serviceLogger.info('info');
		expect(loggerSpy).toHaveBeenCalled();
		expect(loggerSpy.mock.calls[0]).to.be.eql(['service:', 'info']);
	});
	it('should get correct prefix to warn', function () {
		const serviceLogger = new PrefixLogger({prefix: 'service:'}, logger);
		serviceLogger.warn('warn');
		expect(loggerSpy).toHaveBeenCalled();
		expect(loggerSpy.mock.calls[0]).to.be.eql(['service:', 'warn']);
	});
	it('should get correct prefix to error', function () {
		const serviceLogger = new PrefixLogger({prefix: 'service:'}, logger);
		serviceLogger.error('error');
		expect(loggerSpy).toHaveBeenCalled();
		expect(loggerSpy.mock.calls[0]).to.be.eql(['service:', 'error']);
	});
});
