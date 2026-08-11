# @luolapeikko/factory-logger

## Overview

Logger factory implementation for TypeScript. It allows you to create a logger with a specific configuration, including log levels, prefixes, and key-based logging.

## Example

```typescript
const logger = createLogger(console)
	.withKeys({
		constructor: "info",
		method: "debug",
		auth_error: "warn",
	})
	.withPrefix("MyApp:")
	.toLogger();
```

See more in [documentation](https://luolapeikko.github.io/logger-suite/)
