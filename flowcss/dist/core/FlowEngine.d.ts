import { FlowVariable } from "./FlowVariable";
import { FlowContext, ExecutionConfig } from "../types";
/**
 * Main FlowCSS engine that orchestrates all components
 */
export declare class FlowEngine {
    private _variables;
    private _context;
    private _executionEngine;
    private _parser;
    private _domBridge;
    private _cache;
    private _isRunning;
    private _animationFrame?;
    constructor(config?: Partial<ExecutionConfig>);
    /**
     * Create or get a variable
     */
    variable(name: string, initialValue?: any): FlowVariable;
    /**
     * Parse and execute flow expression
     */
    flow(expression: string): FlowVariable;
    /**
     * Apply styles to DOM element
     */
    style(element: HTMLElement, styles: Record<string, FlowVariable | any>): void;
    /**
     * Start the execution loop
     */
    start(): void;
    /**
     * Stop the execution loop
     */
    stop(): void;
    /**
     * Get current context
     */
    get context(): FlowContext;
    /**
     * Main execution tick
     */
    private _tick;
    /**
     * Update execution context
     */
    private _updateContext;
    /**
     * Set up built-in variables
     */
    private _setupBuiltinVariables;
    /**
     * Set up event listeners for context updates
     */
    private _setupEventListeners;
    /**
     * Dispose and cleanup
     */
    dispose(): void;
}
//# sourceMappingURL=FlowEngine.d.ts.map