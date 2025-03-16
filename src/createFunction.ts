export function createFunction<T, R>(fn: (input: T) => R) {
    return {
        execute: (input: T): R => fn(input),
        
        withLogger() {
            const originalFn = this.execute;
            this.execute = (input: T): R => {
                console.log('Input:', input);
                const result = originalFn(input);
                console.log('Output:', result);
                return result;
            };
            return this;
        },
        
        withTimer() {
            const originalFn = this.execute;
                this.execute = (input: T): R => {
                const start = performance.now();
                const result = originalFn(input);
                const end = performance.now();
                console.log(`Execution time: ${end - start}ms`);
                return result;
            };
            return this;
        },
        
        withValidation(validator: (input: T) => boolean) {
            const originalFn = this.execute;
            this.execute = (input: T): R => {
            if (!validator(input)) {
                throw new Error('Validation failed');
            }
            return originalFn(input);
            };
            return this;
        }
    };
}