import { ComputationTask, ExecutionConfig } from '../types';
/**
 * Multi-threaded execution engine with progressive frame-based computation
 */
export declare class ExecutionEngine {
    private _config;
    private _workers;
    private _taskQueue;
    private _activeChunks;
    private _frameStartTime;
    constructor(config?: Partial<ExecutionConfig>);
    /**
     * Schedule a computation task
     */
    schedule(task: ComputationTask): void;
    /**
     * Execute computations for current frame
     */
    executeFrame(frameStartTime: number): void;
    /**
     * Execute a simple (non-chunked) task
     */
    private _executeSimpleTask;
    /**
     * Execute a chunked task progressively
     */
    private _executeChunkedTask;
    /**
     * Break complex computation into smaller chunks
     */
    private _chunkComputation;
    /**
     * Evaluate a flow expression
     */
    private _evaluateExpression;
    /**
     * Evaluate a chunk of an expression
     */
    private _evaluateExpressionChunk;
    /**
     * Evaluate mathematical operations
     */
    private _evaluateOperation;
    /**
     * Evaluate conditional expressions
     */
    private _evaluateCondition;
    /**
     * Get remaining time in current frame
     */
    private _getRemainingFrameTime;
    /**
     * Initialize web workers for multi-threaded execution
     */
    private _initializeWorkers;
    /**
     * Notify task completion
     */
    private _notifyCompletion;
    /**
     * Dispose and cleanup
     */
    dispose(): void;
}
//# sourceMappingURL=ExecutionEngine.d.ts.map