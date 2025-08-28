"use client";

import { useEffect } from "react";
import { nanoid } from "nanoid";

interface AnalyticsTrackerProps {
  pageId: string;
  enabled?: boolean;
}

// Analytics service for tracking page views and clicks
class AnalyticsService {
  private visitorId: string;
  private sessionId: string;

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

  async trackPageView(pageId: string) {
    try {
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
        utmSource: new URLSearchParams(window.location.search).get('utm_source'),
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
        utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        viewedAt: new Date().toISOString(),
      };

      // Send to analytics API
      await fetch('/api/analytics/page-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(viewData),
      });
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  }

  async trackClick(pageId: string, blockId: string, blockType: string, url?: string, label?: string) {
    try {
      const locationData = await this.getLocationData();
      const deviceInfo = this.getDeviceInfo();
      
      const clickData = {
        pageId,
        blockId,
        blockType,
        url,
        label,
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        ...locationData,
        ...deviceInfo,
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        clickedAt: new Date().toISOString(),
      };

      // Send to analytics API
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clickData),
      });
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

    const analytics = getAnalytics();
    
    // Track page view
    analytics.trackPageView(pageId);

    // Track time on page
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      // Send duration data (this might not always work due to browser limitations)
      navigator.sendBeacon('/api/analytics/duration', JSON.stringify({
        pageId,
        visitorId: analytics['visitorId'],
        sessionId: analytics['sessionId'],
        duration,
      }));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pageId, enabled]);

  return null; // This component doesn't render anything
};
