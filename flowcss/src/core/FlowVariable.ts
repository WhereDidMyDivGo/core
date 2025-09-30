import { FlowValue } from "../types";

/**
 * Reactive variable system for FlowCSS
 * Handles dependency tracking and automatic updates
 */
export class FlowVariable extends EventTarget {
  private _value: any = undefined;
  private _dependencies = new Set<string>();
  private _dependents = new Set<FlowVariable>();
  private _lastComputed = 0;
  private _dirty = true;
  private _listeners = new Set<(value: any) => void>();

  constructor(public readonly name: string, initialValue?: any) {
    super();
    if (initialValue !== undefined) {
      this.set(initialValue);
    }
  }

  /**
   * Get current value
   */
  get value(): any {
    return this._value;
  }

  /**
   * Get observable-like interface for backward compatibility
   */
  get value$(): { subscribe: (callback: (value: any) => void) => () => void } {
    return {
      subscribe: (callback: (value: any) => void) => this.subscribe(callback),
    };
  }

  /**
   * Subscribe to value changes
   */
  subscribe(callback: (value: any) => void): () => void {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  /**
   * Set new value and trigger dependency updates
   */
  set(newValue: any): void {
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
  private _notifyListeners(): void {
    this._listeners.forEach((callback) => {
      try {
        callback(this._value);
      } catch (error) {
        console.error(`Error in FlowVariable listener for ${this.name}:`, error);
      }
    });
  }

  /**
   * Add dependency relationship
   */
  addDependency(variable: FlowVariable): void {
    this._dependencies.add(variable.name);
    variable._dependents.add(this);
  }

  /**
   * Remove dependency relationship
   */
  removeDependency(variable: FlowVariable): void {
    this._dependencies.delete(variable.name);
    variable._dependents.delete(this);
  }

  /**
   * Mark as dirty (needs recomputation)
   */
  markDirty(): void {
    if (!this._dirty) {
      this._dirty = true;
      this._notifyDependents();
    }
  }

  /**
   * Check if variable needs recomputation
   */
  get isDirty(): boolean {
    return this._dirty;
  }

  /**
   * Get dependency names
   */
  get dependencies(): Set<string> {
    return new Set(this._dependencies);
  }

  /**
   * Get last computation timestamp
   */
  get lastComputed(): number {
    return this._lastComputed;
  }

  /**
   * Compute value using provided function
   */
  compute(fn: () => any): void {
    try {
      const result = fn();
      this.set(result);
    } catch (error) {
      console.error(`Error computing ${this.name}:`, error);
    }
  }

  /**
   * Notify all dependent variables that this changed
   */
  private _notifyDependents(): void {
    this._dependents.forEach((dependent) => {
      dependent.markDirty();
    });
  }

  /**
   * Convert to FlowValue interface
   */
  toFlowValue(): FlowValue {
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
  dispose(): void {
    this._listeners.clear();
    this._dependencies.clear();
    this._dependents.clear();
  }
}
