# @luolapeikko/logger-type

## Overview

Generic logger interface definition for TypeScript (works with console, winston, and log4js).

## Example

```typescript
import type { ILoggerLike } from '@luolapeikko/logger-like';
function demo(logger: ILoggerLike) {
	logger.info("hello");
}
demo(console);
```

See more in [documentation](https://luolapeikko.github.io/logger-suite/)
