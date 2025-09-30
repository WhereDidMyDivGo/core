/**
 * Core types for FlowCSS system
 */

export interface FlowValue {
  value: any;
  dependencies: Set<string>;
  dirty: boolean;
  lastComputed: number;
}

export interface FlowExpression {
  type: 'variable' | 'operation' | 'condition' | 'loop' | 'function';
  value: any;
  dependencies: string[];
  complexity: number; // For execution scheduling
}

export interface ComputationTask {
  id: string;
  expression: FlowExpression;
  priority: number;
  chunks?: ComputationChunk[];
}

export interface ComputationChunk {
  id: string;
  computation: () => any;
  dependencies: string[];
  estimatedMs: number;
}

export interface FlowContext {
  variables: Map<string, FlowValue>;
  time: number;
  mouse: { x: number; y: number };
  viewport: { width: number; height: number };
  frameCount: number;
}

export interface StyleApplication {
  element: HTMLElement;
  property: string;
  value: any;
  lastApplied: number;
}

export interface ExecutionConfig {
  maxFrameTime: number; // ms per frame
  workerCount: number;
  enableGPU: boolean;
  cacheSize: number;
}