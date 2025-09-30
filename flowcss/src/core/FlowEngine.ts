import { FlowVariable } from "./FlowVariable";
import { ExecutionEngine } from "./ExecutionEngine";
import { FlowParser } from "./FlowParser";
import { DOMBridge } from "./DOMBridge";
import { CacheManager } from "./CacheManager";
import { FlowContext, ExecutionConfig } from "../types";

/**
 * Main FlowCSS engine that orchestrates all components
 */
export class FlowEngine {
  private _variables = new Map<string, FlowVariable>();
  private _context: FlowContext;
  private _executionEngine: ExecutionEngine;
  private _parser: FlowParser;
  private _domBridge: DOMBridge;
  private _cache: CacheManager;
  private _isRunning = false;
  private _animationFrame?: number;

  constructor(config: Partial<ExecutionConfig> = {}) {
    // Initialize context
    this._context = {
      variables: new Map(),
      time: 0,
      mouse: { x: 0, y: 0 },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      frameCount: 0,
    };

    // Initialize components
    this._executionEngine = new ExecutionEngine(config);
    this._parser = new FlowParser();
    this._domBridge = new DOMBridge();
    this._cache = new CacheManager(config.cacheSize || 1000);

    // Set up built-in variables
    this._setupBuiltinVariables();
    this._setupEventListeners();
  }

  /**
   * Create or get a variable
   */
  variable(name: string, initialValue?: any): FlowVariable {
    if (!this._variables.has(name)) {
      const variable = new FlowVariable(name, initialValue);
      this._variables.set(name, variable);
      this._context.variables.set(name, variable.toFlowValue());
    }
    return this._variables.get(name)!;
  }

  /**
   * Parse and execute flow expression
   */
  flow(expression: string): FlowVariable {
    const parsed = this._parser.parse(expression);
    const resultVar = this.variable(`_result_${Date.now()}`);

    // Schedule execution
    this._executionEngine.schedule({
      id: `flow_${Date.now()}`,
      expression: parsed,
      priority: 1,
    });

    return resultVar;
  }

  /**
   * Apply styles to DOM element
   */
  style(element: HTMLElement, styles: Record<string, FlowVariable | any>): void {
    this._domBridge.apply(element, styles);
  }

  /**
   * Start the execution loop
   */
  start(): void {
    if (this._isRunning) return;

    this._isRunning = true;
    this._tick();
  }

  /**
   * Stop the execution loop
   */
  stop(): void {
    this._isRunning = false;
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }
  }

  /**
   * Get current context
   */
  get context(): FlowContext {
    return { ...this._context };
  }

  /**
   * Main execution tick
   */
  private _tick = (): void => {
    if (!this._isRunning) return;

    const frameStart = performance.now();

    // Update context
    this._updateContext();

    // Execute pending computations
    this._executionEngine.executeFrame(frameStart);

    // Apply DOM updates
    this._domBridge.flush();

    // Schedule next frame
    this._animationFrame = requestAnimationFrame(this._tick);
  };

  /**
   * Update execution context
   */
  private _updateContext(): void {
    this._context.time = performance.now();
    this._context.frameCount++;
    this._context.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Update built-in variables
    this.variable("time").set(this._context.time);
    this.variable("frameCount").set(this._context.frameCount);
  }

  /**
   * Set up built-in variables
   */
  private _setupBuiltinVariables(): void {
    // Time variables
    this.variable("time", 0);
    this.variable("frameCount", 0);

    // Math constants
    this.variable("PI", Math.PI);
    this.variable("E", Math.E);
    this.variable("GOLDEN_RATIO", 1.618033988749895);

    // Viewport
    this.variable("viewportWidth", window.innerWidth);
    this.variable("viewportHeight", window.innerHeight);

    // Mouse
    this.variable("mouseX", 0);
    this.variable("mouseY", 0);
  }

  /**
   * Set up event listeners for context updates
   */
  private _setupEventListeners(): void {
    // Mouse tracking
    document.addEventListener("mousemove", (e) => {
      this._context.mouse.x = e.clientX;
      this._context.mouse.y = e.clientY;
      this.variable("mouseX").set(e.clientX);
      this.variable("mouseY").set(e.clientY);
    });

    // Viewport tracking
    window.addEventListener("resize", () => {
      this._context.viewport.width = window.innerWidth;
      this._context.viewport.height = window.innerHeight;
      this.variable("viewportWidth").set(window.innerWidth);
      this.variable("viewportHeight").set(window.innerHeight);
    });
  }

  /**
   * Dispose and cleanup
   */
  dispose(): void {
    this.stop();
    this._variables.forEach((variable) => variable.dispose());
    this._variables.clear();
    this._executionEngine.dispose();
    this._cache.clear();
  }
}
