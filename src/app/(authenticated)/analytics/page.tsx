"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointer, TrendingUp, Users, Calendar, ExternalLink } from "lucide-react";
import { api } from "@/lib/api-client";
import { SectionCards } from "@/components/section-cards";

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

type TimeRange = "7d" | "30d" | "90d" | "1y";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.analytics.overview({ timeRange });
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

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
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
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
      <SectionCards
        items={[
          {
            title: "Total Views",
            value: analytics.totalViews.toLocaleString(),
            icon: <Eye className="h-4 w-4 text-muted-foreground" />,
            subtitle: "Total views on your pages",
            helpText: "Sum of page views across your pages",
          },
          {
            title: "Total Clicks",
            value: analytics.totalClicks.toLocaleString(),
            icon: <MousePointer className="h-4 w-4 text-muted-foreground" />,
            subtitle: "Total clicks on your pages",
            helpText: "Sum of page clicks across your pages",
          },
          {
            title: "Unique Visitors",
            value: analytics.uniqueVisitors.toLocaleString(),
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
            subtitle: "Unique visitors to your pages",
            helpText: "Number of unique visitors to your pages",
          },
          {
            title: "Click-through Rate",
            value: `${analytics.clickThroughRate}%`,
            icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
            subtitle: "Click-through rate on your pages",
            helpText: "Percentage of clicks on your pages",
          },
        ]}
        columns={{ base: 1, sm: 2, lg: 4 }}
      />

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

        {/* Daily Activity (inline SVG bar chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
            <CardDescription>Views and clicks over time</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.dailyStats.length === 0 ? (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No activity for the selected period</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {/* Simple legend */}
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm bg-primary" /> Views</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm bg-muted-foreground/60" /> Clicks</div>
                </div>
                {(() => {
                  const data = analytics.dailyStats;
                  const max = Math.max(...data.map(d => Math.max(d.views, d.clicks)), 1);
                  const padding = { top: 10, right: 10, bottom: 24, left: 10 };
                  const height = 200;
                  const width = 700; // viewBox width (will scale to container)
                  const innerH = height - padding.top - padding.bottom;
                  const n = data.length;
                  const groupW = width / n;
                  const barGap = 6;
                  const barW = (groupW - barGap * 3) / 2; // views + gap + clicks centered
                  const dateLabels = data.map(d => d.date.slice(5)); // MM-DD

                  return (
                    <div className="w-full overflow-x-auto">
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[600px] h-64">
                        {/* Y grid (3 lines) */}
                        {[0, 0.5, 1].map((t, i) => {
                          const y = padding.top + innerH * (1 - t);
                          return (
                            <g key={i}>
                              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                              <text x={width - padding.right} y={y - 2} textAnchor="end" fontSize={10} fill="#9ca3af">
                                {Math.round(max * t)}
                              </text>
                            </g>
                          );
                        })}

                        {/* Bars */}
                        {data.map((d, idx) => {
                          const x0 = idx * groupW + padding.left;
                          const vH = (d.views / max) * innerH;
                          const cH = (d.clicks / max) * innerH;
                          const vx = x0 + barGap;
                          const cx = vx + barW + barGap;
                          const vy = padding.top + innerH - vH;
                          const cy = padding.top + innerH - cH;
                          return (
                            <g key={d.date}>
                              <rect x={vx} y={vy} width={barW} height={vH} fill="currentColor" className="text-primary" rx={2} />
                              <rect x={cx} y={cy} width={barW} height={cH} fill="#9ca3af" rx={2} />
                            </g>
                          );
                        })}

                        {/* X axis labels */}
                        {dateLabels.map((label, idx) => {
                          const x = idx * groupW + padding.left + groupW / 2;
                          return (
                            <text key={idx} x={x} y={height - 6} textAnchor="middle" fontSize={10} fill="#6b7280">
                              {label}
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })()}
              </div>
            )}
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
