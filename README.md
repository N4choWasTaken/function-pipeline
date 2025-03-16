# Function Pipeline

A lightweight, type-safe implementation of the builder pattern for creating functional transformation pipelines in TypeScript.

## Overview

This project demonstrates how to use the builder pattern to create composable, enhanceable functions for data processing pipelines. The implementation follows functional programming principles like immutability and separation of concerns.

## Features

- ✅ Type-safe function composition with TypeScript
- ✅ Builder pattern for enhancing functions with middleware
- ✅ Cross-cutting concerns (logging, validation, timing) separated from core logic
- ✅ Immutable data transformation pipeline
- ✅ Clean code principles with single-responsibility functions

## Project Structure

```
function-pipeline/
├── src/
│   ├── createFunction.ts  # Core function builder implementation
│   └── index.ts           # Main pipeline implementation
├── package.json
└── tsconfig.json
```

## How It Works

The core concept is a `createFunction` utility that wraps any function with additional capabilities:

```typescript
const addTimestamp = createFunction<RawEvent, EventWithProcessingTimestamp>((event) => {
  return {
    ...event,
    processedAt: Date.now()
  };
});

// Enhance the function with middleware using the builder pattern
const enhancedFunction = addTimestamp
  .withLogger()    // Logs input and output
  .withTimer();    // Times execution

// Execute the enhanced function
const result = enhancedFunction.execute(rawEvent);
```

## Data Transformation Pipeline

This example implements an event processing pipeline that:

1. Takes a raw event (like a login event)
2. Adds processing metadata (timestamp)
3. Sanitizes sensitive information (passwords, tokens)
4. Normalizes contextual data (region, timezone)

Each step is implemented as a separate function that can be enhanced with middleware like logging, validation, and timing.
