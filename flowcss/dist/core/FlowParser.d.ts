import { FlowExpression } from "../types";
export declare class FlowParser {
    private _operators;
    private _functions;
    /**
     * Parse flow expression string into executable expression
     */
    parse(expression: string): FlowExpression;
    /**
     * Check if expression is an assignment
     */
    private _isAssignment;
    /**
     * Check if expression is conditional
     */
    private _isConditional;
    /**
     * Check if expression is a loop
     */
    private _isLoop;
    /**
     * Parse assignment expression (x = value)
     */
    private _parseAssignment;
    /**
     * Parse conditional expression (if condition { ... })
     */
    private _parseConditional;
    /**
     * Parse loop expression
     */
    private _parseLoop;
    /**
     * Parse mathematical expression
     */
    private _parseMathExpression;
    /**
     * Tokenize expression
     */
    private _tokenize;
    /**
     * Parse tokens into AST
     */
    private _parseTokens;
    /**
     * Find main operator in token array
     */
    private _findMainOperator;
    /**
     * Parse function arguments
     */
    private _parseArguments;
    /**
     * Extract variable dependencies from expression
     */
    private _extractDependencies;
    /**
     * Calculate expression complexity
     */
    private _calculateComplexity;
}
//# sourceMappingURL=FlowParser.d.ts.map