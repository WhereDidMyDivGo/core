import { FlowExpression } from "../types";

/**
 * Parser for FlowCSS syntax
 * Converts flow expressions into executable AST
 */
interface OperatorInfo {
  precedence: number;
  associativity: string;
}

export class FlowParser {
  private _operators: Record<string, OperatorInfo> = {
    "+": { precedence: 1, associativity: "left" },
    "-": { precedence: 1, associativity: "left" },
    "*": { precedence: 2, associativity: "left" },
    "/": { precedence: 2, associativity: "left" },
    "^": { precedence: 3, associativity: "right" },
    "=": { precedence: 0, associativity: "right" },
  };

  private _functions = new Set(["sin", "cos", "tan", "sqrt", "abs", "floor", "ceil", "round", "min", "max", "clamp", "lerp", "atan2", "pow", "exp", "log"]);

  /**
   * Parse flow expression string into executable expression
   */
  parse(expression: string): FlowExpression {
    const trimmed = expression.trim();

    // Handle different expression types
    if (this._isAssignment(trimmed)) {
      return this._parseAssignment(trimmed);
    } else if (this._isConditional(trimmed)) {
      return this._parseConditional(trimmed);
    } else if (this._isLoop(trimmed)) {
      return this._parseLoop(trimmed);
    } else {
      return this._parseMathExpression(trimmed);
    }
  }

  /**
   * Check if expression is an assignment
   */
  private _isAssignment(expr: string): boolean {
    return /^\s*\w+\s*=\s*.+/.test(expr);
  }

  /**
   * Check if expression is conditional
   */
  private _isConditional(expr: string): boolean {
    return expr.includes("if") && (expr.includes("{") || expr.includes("?"));
  }

  /**
   * Check if expression is a loop
   */
  private _isLoop(expr: string): boolean {
    return expr.includes("for") && expr.includes("{");
  }

  /**
   * Parse assignment expression (x = value)
   */
  private _parseAssignment(expr: string): FlowExpression {
    const [variable, value] = expr.split("=").map((s) => s.trim());
    const valueExpr = this._parseMathExpression(value);

    return {
      type: "variable",
      value: { variable, expression: valueExpr },
      dependencies: valueExpr.dependencies,
      complexity: valueExpr.complexity + 1,
    };
  }

  /**
   * Parse conditional expression (if condition { ... })
   */
  private _parseConditional(expr: string): FlowExpression {
    // Simple conditional parsing
    const ifMatch = expr.match(/if\s+(.+?)\s*{\s*(.+?)\s*}/);
    if (ifMatch) {
      const [, condition, trueBranch] = ifMatch;

      return {
        type: "condition",
        value: {
          condition: this._parseMathExpression(condition),
          trueBranch: this._parseMathExpression(trueBranch),
          falseBranch: null,
        },
        dependencies: this._extractDependencies(expr),
        complexity: 10,
      };
    }

    // Ternary operator (condition ? true : false)
    const ternaryMatch = expr.match(/(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/);
    if (ternaryMatch) {
      const [, condition, trueBranch, falseBranch] = ternaryMatch;

      return {
        type: "condition",
        value: {
          condition: this._parseMathExpression(condition),
          trueBranch: this._parseMathExpression(trueBranch),
          falseBranch: this._parseMathExpression(falseBranch),
        },
        dependencies: this._extractDependencies(expr),
        complexity: 8,
      };
    }

    // Fallback to math expression
    return this._parseMathExpression(expr);
  }

  /**
   * Parse loop expression
   */
  private _parseLoop(expr: string): FlowExpression {
    // Basic for loop parsing
    const forMatch = expr.match(/for\s+(\w+)\s+in\s+(.+?)\s*{\s*(.+?)\s*}/);
    if (forMatch) {
      const [, variable, range, body] = forMatch;

      return {
        type: "loop",
        value: {
          variable,
          range: this._parseMathExpression(range),
          body: this._parseMathExpression(body),
        },
        dependencies: this._extractDependencies(expr),
        complexity: 50,
      };
    }

    return this._parseMathExpression(expr);
  }

  /**
   * Parse mathematical expression
   */
  private _parseMathExpression(expr: string): FlowExpression {
    const tokens = this._tokenize(expr);
    const ast = this._parseTokens(tokens);

    return {
      type: "operation",
      value: ast,
      dependencies: this._extractDependencies(expr),
      complexity: this._calculateComplexity(ast),
    };
  }

  /**
   * Tokenize expression
   */
  private _tokenize(expr: string): string[] {
    // Simple tokenization - split by operators and functions
    const tokens: string[] = [];
    let current = "";

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];

      if (/\s/.test(char)) {
        if (current) {
          tokens.push(current);
          current = "";
        }
      } else if (/[+\-*/^()=<>!]/.test(char)) {
        if (current) {
          tokens.push(current);
          current = "";
        }
        tokens.push(char);
      } else {
        current += char;
      }
    }

    if (current) {
      tokens.push(current);
    }

    return tokens.filter((t) => t.length > 0);
  }

  /**
   * Parse tokens into AST
   */
  private _parseTokens(tokens: string[]): any {
    // Simple expression parsing using recursive descent
    if (tokens.length === 1) {
      const token = tokens[0];

      // Number literal
      if (/^\d+\.?\d*$/.test(token)) {
        return parseFloat(token);
      }

      // Variable reference
      return { type: "variable", name: token };
    }

    // Function call
    if (tokens.length >= 3 && tokens[1] === "(" && this._functions.has(tokens[0])) {
      const funcName = tokens[0];
      const args = this._parseArguments(tokens.slice(2, -1));

      return {
        type: "function",
        name: funcName,
        arguments: args,
      };
    }

    // Binary operation
    const operatorIndex = this._findMainOperator(tokens);
    if (operatorIndex > 0) {
      const operator = tokens[operatorIndex];
      const left = this._parseTokens(tokens.slice(0, operatorIndex));
      const right = this._parseTokens(tokens.slice(operatorIndex + 1));

      return {
        type: "operation",
        operator,
        left,
        right,
      };
    }

    // Fallback
    return { type: "literal", value: tokens.join(" ") };
  }

  /**
   * Find main operator in token array
   */
  private _findMainOperator(tokens: string[]): number {
    let minPrecedence = Infinity;
    let operatorIndex = -1;
    let parenDepth = 0;

    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];

      if (token === ")") parenDepth++;
      else if (token === "(") parenDepth--;
      else if (parenDepth === 0 && token in this._operators) {
        const precedence = this._operators[token]!.precedence;
        if (precedence <= minPrecedence) {
          minPrecedence = precedence;
          operatorIndex = i;
        }
      }
    }

    return operatorIndex;
  }

  /**
   * Parse function arguments
   */
  private _parseArguments(tokens: string[]): any[] {
    // Simple comma-separated argument parsing
    const args: any[] = [];
    let current: string[] = [];
    let parenDepth = 0;

    for (const token of tokens) {
      if (token === "," && parenDepth === 0) {
        if (current.length > 0) {
          args.push(this._parseTokens(current));
          current = [];
        }
      } else {
        if (token === "(") parenDepth++;
        else if (token === ")") parenDepth--;
        current.push(token);
      }
    }

    if (current.length > 0) {
      args.push(this._parseTokens(current));
    }

    return args;
  }

  /**
   * Extract variable dependencies from expression
   */
  private _extractDependencies(expr: string): string[] {
    const variables: string[] = [];
    const tokens = this._tokenize(expr);

    for (const token of tokens) {
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token) && !this._functions.has(token)) {
        if (!variables.includes(token)) {
          variables.push(token);
        }
      }
    }

    return variables;
  }

  /**
   * Calculate expression complexity
   */
  private _calculateComplexity(ast: any): number {
    if (!ast || typeof ast !== "object") return 1;

    let complexity = 1;

    if (ast.type === "function") {
      complexity += 5; // Functions are more expensive
      if (ast.arguments) {
        complexity += ast.arguments.reduce((sum: number, arg: any) => sum + this._calculateComplexity(arg), 0);
      }
    } else if (ast.type === "operation") {
      complexity += 2;
      complexity += this._calculateComplexity(ast.left);
      complexity += this._calculateComplexity(ast.right);
    }

    return complexity;
  }
}
