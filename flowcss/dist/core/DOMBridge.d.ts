import { FlowVariable } from "./FlowVariable";
/**
 * Bridge between FlowCSS computations and DOM styling
 */
export declare class DOMBridge {
    private _pendingApplications;
    private _activeStyles;
    /**
     * Apply styles to DOM element
     */
    apply(element: HTMLElement, styles: Record<string, FlowVariable | any>): void;
    /**
     * Schedule a style application
     */
    private _scheduleApplication;
    /**
     * Flush all pending style applications to DOM
     */
    flush(): void;
    /**
     * Apply single style to element
     */
    private _applyStyle;
    /**
     * Convert camelCase property to CSS kebab-case
     */
    private _toCSSProperty;
    /**
     * Convert value to appropriate CSS value string
     */
    private _toCSSValue;
    /**
     * Check if property needs pixel units
     */
    private _needsPixelUnit;
    /**
     * Check if property needs percentage units
     */
    private _needsPercentUnit;
    /**
     * Check if property needs degree units
     */
    private _needsDegreeUnit;
    /**
     * Get active styles for element
     */
    getActiveStyles(element: HTMLElement): Map<string, any>;
    /**
     * Clear styles for element
     */
    clearStyles(element: HTMLElement): void;
    /**
     * Clear all tracked styles
     */
    clearAll(): void;
}
//# sourceMappingURL=DOMBridge.d.ts.map