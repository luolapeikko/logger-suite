# @luolapeikko/level-logger

## Overview

Logger that wraps another logger and filters log messages based on a minimum log level.

## Example

```typescript
const logger = new LevelLogger(console, "info");
logger.debug("hello"); // will not be logged
logger.level = "warn"; // set minimum log level to warn
logger.level; // returns 'warn'
```

See more in [documentation](https://luolapeikko.github.io/logger-suite/)
