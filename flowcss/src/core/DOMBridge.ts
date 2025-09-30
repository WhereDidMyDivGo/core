import { FlowVariable } from "./FlowVariable";
import { StyleApplication } from "../types";

/**
 * Bridge between FlowCSS computations and DOM styling
 */
export class DOMBridge {
  private _pendingApplications: StyleApplication[] = [];
  private _activeStyles = new Map<HTMLElement, Map<string, any>>();

  /**
   * Apply styles to DOM element
   */
  apply(element: HTMLElement, styles: Record<string, FlowVariable | any>): void {
    for (const [property, value] of Object.entries(styles)) {
      if (value instanceof FlowVariable) {
        // Subscribe to variable changes
        value.subscribe((newValue: any) => {
          this._scheduleApplication(element, property, newValue);
        });
      } else {
        // Apply static value immediately
        this._scheduleApplication(element, property, value);
      }
    }
  }

  /**
   * Schedule a style application
   */
  private _scheduleApplication(element: HTMLElement, property: string, value: any): void {
    const application: StyleApplication = {
      element,
      property,
      value,
      lastApplied: 0,
    };

    // Remove any existing pending application for same element/property
    this._pendingApplications = this._pendingApplications.filter((app) => !(app.element === element && app.property === property));

    this._pendingApplications.push(application);
  }

  /**
   * Flush all pending style applications to DOM
   */
  flush(): void {
    const now = performance.now();

    for (const application of this._pendingApplications) {
      try {
        this._applyStyle(application);
        application.lastApplied = now;
      } catch (error) {
        console.error("Error applying style:", error);
      }
    }

    this._pendingApplications = [];
  }

  /**
   * Apply single style to element
   */
  private _applyStyle(application: StyleApplication): void {
    const { element, property, value } = application;

    // Convert property name to CSS format
    const cssProperty = this._toCSSProperty(property);

    // Convert value to appropriate CSS value
    const cssValue = this._toCSSValue(property, value);

    // Apply to element
    element.style.setProperty(cssProperty, cssValue);

    // Track active styles
    if (!this._activeStyles.has(element)) {
      this._activeStyles.set(element, new Map());
    }
    this._activeStyles.get(element)!.set(cssProperty, cssValue);
  }

  /**
   * Convert camelCase property to CSS kebab-case
   */
  private _toCSSProperty(property: string): string {
    return property.replace(/([A-Z])/g, "-$1").toLowerCase();
  }

  /**
   * Convert value to appropriate CSS value string
   */
  private _toCSSValue(property: string, value: any): string {
    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      // Add units for properties that need them
      if (this._needsPixelUnit(property)) {
        return `${value}px`;
      } else if (this._needsPercentUnit(property)) {
        return `${value}%`;
      } else if (this._needsDegreeUnit(property)) {
        return `${value}deg`;
      }
      return String(value);
    }

    if (typeof value === "boolean") {
      return value ? "1" : "0";
    }

    return String(value);
  }

  /**
   * Check if property needs pixel units
   */
  private _needsPixelUnit(property: string): boolean {
    const pixelProperties = ["width", "height", "top", "left", "right", "bottom", "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-width", "border-radius", "font-size", "line-height"];

    const cssProperty = this._toCSSProperty(property);
    return pixelProperties.some((prop) => cssProperty.includes(prop));
  }

  /**
   * Check if property needs percentage units
   */
  private _needsPercentUnit(property: string): boolean {
    // Most percentage properties are explicitly set
    return false;
  }

  /**
   * Check if property needs degree units
   */
  private _needsDegreeUnit(property: string): boolean {
    const degreeProperties = ["rotate", "rotation", "hue-rotate"];
    const cssProperty = this._toCSSProperty(property);
    return degreeProperties.some((prop) => cssProperty.includes(prop));
  }

  /**
   * Get active styles for element
   */
  getActiveStyles(element: HTMLElement): Map<string, any> {
    return this._activeStyles.get(element) || new Map();
  }

  /**
   * Clear styles for element
   */
  clearStyles(element: HTMLElement): void {
    const styles = this._activeStyles.get(element);
    if (styles) {
      for (const property of styles.keys()) {
        element.style.removeProperty(property);
      }
      this._activeStyles.delete(element);
    }
  }

  /**
   * Clear all tracked styles
   */
  clearAll(): void {
    for (const element of this._activeStyles.keys()) {
      this.clearStyles(element);
    }
    this._pendingApplications = [];
  }
}
