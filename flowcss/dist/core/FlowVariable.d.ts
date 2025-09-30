import { FlowValue } from "../types";
/**
 * Reactive variable system for FlowCSS
 * Handles dependency tracking and automatic updates
 */
export declare class FlowVariable extends EventTarget {
    readonly name: string;
    private _value;
    private _dependencies;
    private _dependents;
    private _lastComputed;
    private _dirty;
    private _listeners;
    constructor(name: string, initialValue?: any);
    /**
     * Get current value
     */
    get value(): any;
    /**
     * Get observable-like interface for backward compatibility
     */
    get value$(): {
        subscribe: (callback: (value: any) => void) => () => void;
    };
    /**
     * Subscribe to value changes
     */
    subscribe(callback: (value: any) => void): () => void;
    /**
     * Set new value and trigger dependency updates
     */
    set(newValue: any): void;
    /**
     * Notify all listeners of value change
     */
    private _notifyListeners;
    /**
     * Add dependency relationship
     */
    addDependency(variable: FlowVariable): void;
    /**
     * Remove dependency relationship
     */
    removeDependency(variable: FlowVariable): void;
    /**
     * Mark as dirty (needs recomputation)
     */
    markDirty(): void;
    /**
     * Check if variable needs recomputation
     */
    get isDirty(): boolean;
    /**
     * Get dependency names
     */
    get dependencies(): Set<string>;
    /**
     * Get last computation timestamp
     */
    get lastComputed(): number;
    /**
     * Compute value using provided function
     */
    compute(fn: () => any): void;
    /**
     * Notify all dependent variables that this changed
     */
    private _notifyDependents;
    /**
     * Convert to FlowValue interface
     */
    toFlowValue(): FlowValue;
    /**
     * Dispose and cleanup
     */
    dispose(): void;
}
//# sourceMappingURL=FlowVariable.d.ts.map