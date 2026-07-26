# @luolapeikko/prefix-logger

## Overview

A logger that adds a prefix to each log message.

## Example

```typescript
const logger = new PrefixLogger("ServiceXyz:", console);
logger.info("is running");
// output: ServiceXyz: is running
```

See more in [documentation](https://luolapeikko.github.io/logger-suite/)
