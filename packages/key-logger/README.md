# @luolapeikko/key-logger

## Overview

KeyLogger is a logger that has standard log level methods (trace, debug, info, warn, error) and object mapping of log keys to log levels. It allows you to log messages with a specific key.

## Example

```typescript
const defaultLogMap = {
	test: "info",
	input: "debug",
} as const;
const logger = new KeyLogger(defaultLogMap, console);
logger.key("test", "goes to info");
logger.key("input", "goes to debug");
logger.info("this is an info message");
```

See more in [documentation](https://luolapeikko.github.io/logger-suite/)
