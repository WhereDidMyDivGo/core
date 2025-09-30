import { FlowEngine } from '../core/FlowEngine';
import { FlowVariable } from '../core/FlowVariable';

// Global FlowCSS engine instance
let globalEngine: FlowEngine | null = null;

/**
 * Initialize or get the global FlowCSS engine
 */
function getEngine(): FlowEngine {
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
export function flow(expression: string): FlowVariable {
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
export function style(element: HTMLElement, styles: Record<string, FlowVariable | any>): void {
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
export function variable(name: string, initialValue?: any): FlowVariable {
  const engine = getEngine();
  return engine.variable(name, initialValue);
}

/**
 * Advanced flow with custom configuration
 */
export function flowAdvanced(expression: string, config: {
  priority?: number;
  cache?: boolean;
  maxComplexity?: number;
}): FlowVariable {
  // TODO: Implement advanced configuration
  return flow(expression);
}

/**
 * Batch style updates for performance
 */
export function batchStyle(updates: Array<{
  element: HTMLElement;
  styles: Record<string, FlowVariable | any>;
}>): void {
  const engine = getEngine();
  
  // Apply all styles in one batch
  updates.forEach(({ element, styles }) => {
    engine.style(element, styles);
  });
}

/**
 * Create a scoped FlowCSS context
 */
export function createScope(config?: any): {
  flow: typeof flow;
  style: typeof style;
  variable: typeof variable;
  dispose: () => void;
} {
  const scopedEngine = new FlowEngine(config);
  scopedEngine.start();
  
  return {
    flow: (expression: string) => scopedEngine.flow(expression),
    style: (element: HTMLElement, styles: Record<string, FlowVariable | any>) => 
      scopedEngine.style(element, styles),
    variable: (name: string, initialValue?: any) => 
      scopedEngine.variable(name, initialValue),
    dispose: () => scopedEngine.dispose()
  };
}

/**
 * Dispose global engine and cleanup
 */
export function dispose(): void {
  if (globalEngine) {
    globalEngine.dispose();
    globalEngine = null;
  }
}

// Export convenience math functions
export const math = {
  sin: (x: number) => Math.sin(x),
  cos: (x: number) => Math.cos(x),
  tan: (x: number) => Math.tan(x),
  abs: (x: number) => Math.abs(x),
  sqrt: (x: number) => Math.sqrt(x),
  pow: (x: number, y: number) => Math.pow(x, y),
  min: (...args: number[]) => Math.min(...args),
  max: (...args: number[]) => Math.max(...args),
  clamp: (value: number, min: number, max: number) => Math.min(Math.max(value, min), max),
  lerp: (a: number, b: number, t: number) => a + (b - a) * t,
  map: (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => 
    outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin))
};