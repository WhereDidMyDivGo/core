/**
 * Reactive variable system for FlowCSS
 * Handles dependency tracking and automatic updates
 */
export class FlowVariable extends EventTarget {
    constructor(name, initialValue) {
        super();
        this.name = name;
        this._value = undefined;
        this._dependencies = new Set();
        this._dependents = new Set();
        this._lastComputed = 0;
        this._dirty = true;
        this._listeners = new Set();
        if (initialValue !== undefined) {
            this.set(initialValue);
        }
    }
    /**
     * Get current value
     */
    get value() {
        return this._value;
    }
    /**
     * Get observable-like interface for backward compatibility
     */
    get value$() {
        return {
            subscribe: (callback) => this.subscribe(callback),
        };
    }
    /**
     * Subscribe to value changes
     */
    subscribe(callback) {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
    }
    /**
     * Set new value and trigger dependency updates
     */
    set(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            this._lastComputed = performance.now();
            this._dirty = false;
            this._notifyListeners();
            this._notifyDependents();
        }
    }
    /**
     * Notify all listeners of value change
     */
    _notifyListeners() {
        this._listeners.forEach((callback) => {
            try {
                callback(this._value);
            }
            catch (error) {
                console.error(`Error in FlowVariable listener for ${this.name}:`, error);
            }
        });
    }
    /**
     * Add dependency relationship
     */
    addDependency(variable) {
        this._dependencies.add(variable.name);
        variable._dependents.add(this);
    }
    /**
     * Remove dependency relationship
     */
    removeDependency(variable) {
        this._dependencies.delete(variable.name);
        variable._dependents.delete(this);
    }
    /**
     * Mark as dirty (needs recomputation)
     */
    markDirty() {
        if (!this._dirty) {
            this._dirty = true;
            this._notifyDependents();
        }
    }
    /**
     * Check if variable needs recomputation
     */
    get isDirty() {
        return this._dirty;
    }
    /**
     * Get dependency names
     */
    get dependencies() {
        return new Set(this._dependencies);
    }
    /**
     * Get last computation timestamp
     */
    get lastComputed() {
        return this._lastComputed;
    }
    /**
     * Compute value using provided function
     */
    compute(fn) {
        try {
            const result = fn();
            this.set(result);
        }
        catch (error) {
            console.error(`Error computing ${this.name}:`, error);
        }
    }
    /**
     * Notify all dependent variables that this changed
     */
    _notifyDependents() {
        this._dependents.forEach((dependent) => {
            dependent.markDirty();
        });
    }
    /**
     * Convert to FlowValue interface
     */
    toFlowValue() {
        return {
            value: this.value,
            dependencies: this.dependencies,
            dirty: this._dirty,
            lastComputed: this._lastComputed,
        };
    }
    /**
     * Dispose and cleanup
     */
    dispose() {
        this._listeners.clear();
        this._dependencies.clear();
        this._dependents.clear();
    }
}
//# sourceMappingURL=FlowVariable.js.map