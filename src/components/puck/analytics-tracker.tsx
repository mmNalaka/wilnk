"use client";

import { useEffect } from "react";
import { nanoid } from "nanoid";
import { api } from "@/lib/api-client";

declare global {
  interface Window {
    __ANALYTICS_ENABLED__?: boolean;
  }
}

const DISABLE_GEO = process.env.NEXT_PUBLIC_ANALYTICS_DISABLE_GEO === 'true';
const SAMPLING_VIEWS = Number(
  process.env.NEXT_PUBLIC_ANALYTICS_SAMPLING_VIEWS ??
  process.env.NEXT_PUBLIC_ANALYTICS_SAMPLING_RATE ??
  1
);
const SAMPLING_CLICKS = Number(
  process.env.NEXT_PUBLIC_ANALYTICS_SAMPLING_CLICKS ??
  process.env.NEXT_PUBLIC_ANALYTICS_SAMPLING_RATE ??
  1
);
const CLICK_DEBOUNCE_MS = Number(process.env.NEXT_PUBLIC_ANALYTICS_CLICK_DEBOUNCE_MS ?? 400);

interface AnalyticsTrackerProps {
  pageId: string;
  enabled?: boolean;
}

// Analytics service for tracking page views and clicks
class AnalyticsService {
  private visitorId: string;
  private sessionId: string;
  private lastPageId?: string;
  private sentPageViews = new Set<string>();
  private lastClickTs = new Map<string, number>();

  constructor() {
    // Get or create visitor ID (persisted in localStorage)
    this.visitorId = this.getOrCreateVisitorId();
    // Create session ID (unique per session)
    this.sessionId = nanoid();
  }

  private getOrCreateVisitorId(): string {
    if (typeof window === 'undefined') return nanoid();
    
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = nanoid();
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }

  private async getLocationData(): Promise<{ country: string; city: string }> {
    try {
      if (DISABLE_GEO) {
        return { country: 'Unknown', city: 'Unknown' };
      }
      // Use a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = (await response.json()) as {
        country_name?: string;
        city?: string;
      };
      return {
        country: data?.country_name ?? 'Unknown',
        city: data?.city ?? 'Unknown',
      };
    } catch (error) {
      console.warn('Failed to get location data:', error);
      return {
        country: 'Unknown',
        city: 'Unknown',
      };
    }
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') return {};
    
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }
    
    // Simple browser detection
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    return {
      userAgent,
      deviceType,
      browser,
    };
  }

  private shouldSample(p: number) {
    if (Number.isNaN(p)) return true;
    if (p >= 1) return true;
    if (p <= 0) return false;
    return Math.random() < p;
  }

  async trackPageView(pageId: string) {
    try {
      // Remember page for subsequent clicks
      this.lastPageId = pageId;

      // Sampling and dedupe per session+page
      if (!this.shouldSample(SAMPLING_VIEWS)) return;
      if (this.sentPageViews.has(pageId)) return;

      const locationData = await this.getLocationData();
      const deviceInfo = this.getDeviceInfo();
      
      const viewData = {
        pageId,
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        ...locationData,
        ...deviceInfo,
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        // Extract UTM parameters
        utmSource: new URLSearchParams(window.location.search).get('utm_source') ?? undefined,
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium') ?? undefined,
        utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') ?? undefined,
      };

      // Send via oRPC client
      await api.analytics.trackPageView(viewData);

      // Mark as sent for this session
      this.sentPageViews.add(pageId);
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  }

  async trackClick(pageId: string | undefined, blockId: string, blockType: string, url: string, label?: string) {
    try {
      // Sampling for clicks
      if (!this.shouldSample(SAMPLING_CLICKS)) return;

      // Debounce rapid repeated clicks per block+url
      const key = `${pageId ?? this.lastPageId ?? ''}|${blockId}|${url}`;
      const now = Date.now();
      const last = this.lastClickTs.get(key) ?? 0;
      if (now - last < CLICK_DEBOUNCE_MS) return;
      this.lastClickTs.set(key, now);

      const locationData = await this.getLocationData();
      const deviceInfo = this.getDeviceInfo();
      
      const clickData = {
        pageId: pageId ?? this.lastPageId ?? "",
        blockId,
        blockType,
        url,
        label,
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        ...locationData,
        ...deviceInfo,
        referrer: typeof window !== 'undefined' ? document.referrer : '',
      };

      // Send via oRPC client
      await api.analytics.trackClick(clickData);
    } catch (error) {
      console.warn('Failed to track click:', error);
    }
  }
}

// Global analytics instance
let analyticsInstance: AnalyticsService | null = null;

export const getAnalytics = () => {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsService();
  }
  return analyticsInstance;
};

export const AnalyticsTracker = ({ pageId, enabled = true }: AnalyticsTrackerProps) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Gate: mark analytics as enabled only on pages where tracker is mounted
    window.__ANALYTICS_ENABLED__ = true;

    const analytics = getAnalytics();
    
    // Track page view
    analytics.trackPageView(pageId);
    
    // We intentionally keep it minimal: no duration beacon
    return () => {
      // Clear the gate on unmount
      window.__ANALYTICS_ENABLED__ = false;
    };
  }, [pageId, enabled]);

  return null; // This component doesn't render anything
};
