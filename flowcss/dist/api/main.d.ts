import { FlowVariable } from '../core/FlowVariable';
/**
 * Main flow function - creates reactive computations
 *
 * @example
 * ```js
 * const x = flow('100 * sin(time * 0.01)');
 * const y = flow('50 + mouseY * 0.1');
 * ```
 */
export declare function flow(expression: string): FlowVariable;
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
export declare function style(element: HTMLElement, styles: Record<string, FlowVariable | any>): void;
/**
 * Create a variable that can be used in expressions
 *
 * @example
 * ```js
 * const speed = variable('speed', 1.0);
 * const x = flow('time * speed');
 * ```
 */
export declare function variable(name: string, initialValue?: any): FlowVariable;
/**
 * Advanced flow with custom configuration
 */
export declare function flowAdvanced(expression: string, config: {
    priority?: number;
    cache?: boolean;
    maxComplexity?: number;
}): FlowVariable;
/**
 * Batch style updates for performance
 */
export declare function batchStyle(updates: Array<{
    element: HTMLElement;
    styles: Record<string, FlowVariable | any>;
}>): void;
/**
 * Create a scoped FlowCSS context
 */
export declare function createScope(config?: any): {
    flow: typeof flow;
    style: typeof style;
    variable: typeof variable;
    dispose: () => void;
};
/**
 * Dispose global engine and cleanup
 */
export declare function dispose(): void;
export declare const math: {
    sin: (x: number) => number;
    cos: (x: number) => number;
    tan: (x: number) => number;
    abs: (x: number) => number;
    sqrt: (x: number) => number;
    pow: (x: number, y: number) => number;
    min: (...args: number[]) => number;
    max: (...args: number[]) => number;
    clamp: (value: number, min: number, max: number) => number;
    lerp: (a: number, b: number, t: number) => number;
    map: (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => number;
};
//# sourceMappingURL=main.d.ts.map