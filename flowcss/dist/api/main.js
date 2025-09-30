import { FlowEngine } from '../core/FlowEngine';
// Global FlowCSS engine instance
let globalEngine = null;
/**
 * Initialize or get the global FlowCSS engine
 */
function getEngine() {
    if (!globalEngine) {
        globalEngine = new FlowEngine({
            maxFrameTime: 16, // 60fps
            workerCount: navigator.hardwareConcurrency || 4,
            enableGPU: true,
            cacheSize: 1000
        });
        globalEngine.start();
    }
    return globalEngine;
}
/**
 * Main flow function - creates reactive computations
 *
 * @example
 * ```js
 * const x = flow('100 * sin(time * 0.01)');
 * const y = flow('50 + mouseY * 0.1');
 * ```
 */
export function flow(expression) {
    const engine = getEngine();
    return engine.flow(expression);
}
/**
 * Style function - applies reactive styles to DOM elements
 *
 * @example
 * ```js
 * const el = document.querySelector('.button');
 * style(el, {
 *   width: flow('100 + sin(time) * 20'),
 *   backgroundColor: flow('hsl(' + time * 0.1 + ', 70%, 50%)')
 * });
 * ```
 */
export function style(element, styles) {
    const engine = getEngine();
    engine.style(element, styles);
}
/**
 * Create a variable that can be used in expressions
 *
 * @example
 * ```js
 * const speed = variable('speed', 1.0);
 * const x = flow('time * speed');
 * ```
 */
export function variable(name, initialValue) {
    const engine = getEngine();
    return engine.variable(name, initialValue);
}
/**
 * Advanced flow with custom configuration
 */
export function flowAdvanced(expression, config) {
    // TODO: Implement advanced configuration
    return flow(expression);
}
/**
 * Batch style updates for performance
 */
export function batchStyle(updates) {
    const engine = getEngine();
    // Apply all styles in one batch
    updates.forEach(({ element, styles }) => {
        engine.style(element, styles);
    });
}
/**
 * Create a scoped FlowCSS context
 */
export function createScope(config) {
    const scopedEngine = new FlowEngine(config);
    scopedEngine.start();
    return {
        flow: (expression) => scopedEngine.flow(expression),
        style: (element, styles) => scopedEngine.style(element, styles),
        variable: (name, initialValue) => scopedEngine.variable(name, initialValue),
        dispose: () => scopedEngine.dispose()
    };
}
/**
 * Dispose global engine and cleanup
 */
export function dispose() {
    if (globalEngine) {
        globalEngine.dispose();
        globalEngine = null;
    }
}
// Export convenience math functions
export const math = {
    sin: (x) => Math.sin(x),
    cos: (x) => Math.cos(x),
    tan: (x) => Math.tan(x),
    abs: (x) => Math.abs(x),
    sqrt: (x) => Math.sqrt(x),
    pow: (x, y) => Math.pow(x, y),
    min: (...args) => Math.min(...args),
    max: (...args) => Math.max(...args),
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),
    lerp: (a, b, t) => a + (b - a) * t,
    map: (value, inMin, inMax, outMin, outMax) => outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin))
};
//# sourceMappingURL=main.js.map