// Type definitions for the database schema

export type UserPlan = "free" | "pro" | "enterprise";
export type PageStatus = "draft" | "published" | "archived";
export type ThemeStatus = "draft" | "published" | "archived";
export type BlockStatus = "draft" | "published" | "archived";
export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "expired"
  | "past_due";
export type DeviceType = "mobile" | "desktop" | "tablet";

// Puck data structure types
export interface PuckData {
  content: PuckComponent[];
  root: Record<string, unknown>;
  zones?: Record<string, PuckComponent[]>;
}

export interface PuckComponent {
  type: string;
  props: {
    id: string;
    [key: string]: object | Array<object> | string | number | boolean;
  };
}
// Block template configuration types
export interface BlockConfig {
  fields: Record<string, FieldConfig>;
  defaultProps?: Record<
    string,
    object | Array<object> | string | number | boolean
  >;
  category?: string;
  icon?: string;
  preview?: string;
}

export interface FieldConfig {
  type:
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "radio"
    | "checkbox"
    | "url"
    | "color"
    | "image"
    | "external";
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: object | Array<object> | string | number | boolean;
}

// Analytics data types
export interface GeographicData {
  country: string;
  count: number;
}

export interface DeviceData {
  [deviceType: string]: number;
}

export interface BrowserData {
  [browser: string]: number;
}

export interface ReferrerData {
  domain: string;
  count: number;
}

// Theme configuration for page preview and slug renderer
export interface ThemeConfig {
  // shadcn preset name, e.g. "blue", "green", "amber" etc.
  id: string;
  name: string;
  description: string;
  config: Record<string, string>;
  isSystem: boolean;
}
