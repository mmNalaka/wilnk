"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointer, TrendingUp, Users, Calendar, ExternalLink } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  clickThroughRate: number;
  topPages: Array<{
    id: string;
    title: string;
    slug: string;
    views: number;
    clicks: number;
    ctr: number;
  }>;
  topCountries: Array<{
    country: string;
    views: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    clicks: number;
    visitors: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    views: number;
    percentage: number;
  }>;
}

// Mock analytics service
const mockAnalyticsService = {
  async getAnalytics(): Promise<AnalyticsData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      totalViews: 12847,
      totalClicks: 3421,
      uniqueVisitors: 8932,
      clickThroughRate: 26.6,
      topPages: [
        {
          id: "1",
          title: "My Social Links",
          slug: "johndoe",
          views: 5432,
          clicks: 1234,
          ctr: 22.7,
        },
        {
          id: "2", 
          title: "Creative Portfolio",
          slug: "jane-creative",
          views: 3210,
          clicks: 987,
          ctr: 30.7,
        },
        {
          id: "3",
          title: "Business Links",
          slug: "mybusiness",
          views: 2105,
          clicks: 543,
          ctr: 25.8,
        },
      ],
      topCountries: [
        { country: "United States", views: 4521, percentage: 35.2 },
        { country: "United Kingdom", views: 2134, percentage: 16.6 },
        { country: "Canada", views: 1876, percentage: 14.6 },
        { country: "Australia", views: 1234, percentage: 9.6 },
        { country: "Germany", views: 987, percentage: 7.7 },
      ],
      dailyStats: [
        { date: "2024-01-01", views: 234, clicks: 67, visitors: 189 },
        { date: "2024-01-02", views: 345, clicks: 89, visitors: 267 },
        { date: "2024-01-03", views: 456, clicks: 123, visitors: 334 },
        { date: "2024-01-04", views: 567, clicks: 145, visitors: 423 },
        { date: "2024-01-05", views: 432, clicks: 98, visitors: 356 },
        { date: "2024-01-06", views: 654, clicks: 187, visitors: 498 },
        { date: "2024-01-07", views: 789, clicks: 234, visitors: 612 },
      ],
      topReferrers: [
        { referrer: "Direct", views: 5432, percentage: 42.3 },
        { referrer: "Instagram", views: 2134, percentage: 16.6 },
        { referrer: "Twitter", views: 1876, percentage: 14.6 },
        { referrer: "TikTok", views: 1234, percentage: 9.6 },
        { referrer: "LinkedIn", views: 987, percentage: 7.7 },
      ],
    };
  },
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await mockAnalyticsService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <p className="text-muted-foreground">Failed to load analytics data.</p>
          <Button onClick={loadAnalytics} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickThroughRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Your most viewed Link-in-Bio pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{page.title}</p>
                      <Badge variant="secondary" className="text-xs">
                        /{page.slug}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{page.views.toLocaleString()} views</span>
                      <span>{page.clicks.toLocaleString()} clicks</span>
                      <span>{page.ctr}% CTR</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Where your visitors are from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCountries.map((country) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{country.country}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">{country.views.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{country.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Stats Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
            <CardDescription>Views and clicks over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
              <div className="text-center">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Integration with charting library needed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>How visitors find your pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topReferrers.map((referrer) => (
                <div key={referrer.referrer} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{referrer.referrer}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${referrer.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">{referrer.views.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{referrer.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
