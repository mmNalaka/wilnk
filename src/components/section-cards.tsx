"use client";

import * as React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type SectionCardItem = {
  title: string;
  value: string | number | React.ReactNode;
  icon?: React.ReactNode;
  helpText?: string | React.ReactNode;
  delta?: string; // e.g. +12.5%, -3%
  subtitle?: string | React.ReactNode; // bolded short line above helpText
};

export function SectionCards({
  items,
  className,
  columns = { base: 1, sm: 2, md: 3, lg: 3, xl: 4 },
}: {
  items: SectionCardItem[];
  className?: string;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  compact?: boolean;
}) {
  const gridClass = cn(
    "grid gap-4",
    columns.base ? `grid-cols-${columns.base}` : "",
    columns.sm ? `sm:grid-cols-${columns.sm}` : "",
    columns.md ? `md:grid-cols-${columns.md}` : "",
    columns.lg ? `lg:grid-cols-${columns.lg}` : "",
    columns.xl ? `xl:grid-cols-${columns.xl}` : "",
    className,
  );

  return (
    <div className={gridClass}>
      {items.map((item, idx) => (
        <Card
          key={idx}
          className="bg-card text-card-foreground flex flex-col rounded-xl border py-4 shadow-sm gap-2 "
        >
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums md:text-4xl">
              {item.value}
            </CardTitle>
            <CardAction>{item.icon}</CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {item.subtitle}
            </div>
            <div className="text-muted-foreground">{item.helpText}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
