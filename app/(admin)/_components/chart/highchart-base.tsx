"use client";

import React, { useEffect, useRef, useState } from "react";
import type * as HighchartsType from "highcharts";
import { Icon } from "../admin-icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";

/** Palet warna standar EduSetara Admin (selaras nuansa Amber, Emerald, Slate, Blue, Rose) */
export const EDUSETARA_CHART_COLORS = [
  "#f59e0b", // Amber 500
  "#10b981", // Emerald 500
  "#3b82f6", // Blue 500
  "#8b5cf6", // Violet 500
  "#f43f5e", // Rose 500
  "#14b8a6", // Teal 500
  "#d97706", // Amber 600
  "#64748b", // Slate 500
];

const BASE_THEME_OPTIONS: HighchartsType.Options = {
  colors: EDUSETARA_CHART_COLORS,
  chart: {
    backgroundColor: "transparent",
    style: {
      fontFamily: "inherit",
    },
    spacing: [12, 8, 12, 8],
  },
  title: {
    text: undefined,
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    gridLineColor: "rgba(216, 201, 152, 0.22)",
    lineColor: "rgba(216, 201, 152, 0.5)",
    tickColor: "rgba(216, 201, 152, 0.5)",
    labels: {
      style: {
        color: "#6b5f41",
        fontSize: "11px",
        fontWeight: "600",
      },
    },
  },
  yAxis: {
    gridLineColor: "rgba(216, 201, 152, 0.28)",
    gridLineDashStyle: "Dash",
    title: {
      text: undefined,
    },
    labels: {
      style: {
        color: "#7d7152",
        fontSize: "11px",
        fontWeight: "500",
      },
    },
  },
  legend: {
    itemStyle: {
      color: "#2d2410",
      fontSize: "11px",
      fontWeight: "600",
    },
    itemHoverStyle: {
      color: "#b45309",
    },
  },
  tooltip: {
    backgroundColor: "rgba(36, 30, 18, 0.94)",
    borderColor: "rgba(245, 184, 46, 0.45)",
    borderRadius: 12,
    borderWidth: 1,
    padding: 11,
    shadow: false,
    style: {
      color: "#fef3c7",
      fontSize: "11.5px",
    },
  },
  plotOptions: {
    series: {
      animation: {
        duration: 550,
      },
    },
    column: {
      borderRadius: 6,
      borderWidth: 0,
    },
    bar: {
      borderRadius: 6,
      borderWidth: 0,
    },
    pie: {
      borderColor: "rgba(255, 255, 255, 0.85)",
      borderWidth: 2,
    },
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeChartOptions<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>
): T {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overVal = override[key];
    if (isPlainObject(baseVal) && isPlainObject(overVal)) {
      result[key] = mergeChartOptions(baseVal, overVal);
    } else if (overVal !== undefined) {
      result[key] = overVal;
    }
  }
  return result as T;
}

export interface AdminHighchartProps {
  options: HighchartsType.Options;
  height?: number | string;
  className?: string;
}

/**
 * Komponen Dasar Reusable Highcharts untuk Portal Admin EduSetara.
 * Aman terhadap SSR (hanya me-mount Highcharts di sisi client).
 */
export function AdminHighchart({
  options,
  height = 300,
  className = "",
}: AdminHighchartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<HighchartsType.Chart | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    let resizeObserver: ResizeObserver | null = null;

    async function renderChart() {
      const HighchartsModule = await import("highcharts");
      const Highcharts = HighchartsModule.default ?? HighchartsModule;

      if (!active || !containerRef.current) return;

      const merged = mergeChartOptions(
        BASE_THEME_OPTIONS as Record<string, unknown>,
        {
          ...options,
          chart: {
            ...options.chart,
            height: typeof height === "number" ? height : undefined,
          },
        } as Record<string, unknown>
      ) as HighchartsType.Options;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = Highcharts.chart(containerRef.current, merged);
      setReady(true);

      if (typeof ResizeObserver !== "undefined" && containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          chartInstanceRef.current?.reflow();
        });
        resizeObserver.observe(containerRef.current);
      }
    }

    renderChart();

    return () => {
      active = false;
      resizeObserver?.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [options, height]);

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
    >
      {!ready && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-amber-50/40 animate-pulse border border-amber-200/40"
          aria-hidden="true"
        >
          <span className="text-xs font-medium text-[#7d7152]">
            Memuat grafik visualisasi...
          </span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Pembungkus Kartu Grafik Standar Portal Admin.
 * Menyediakan header konsisten dengan ikon, judul, subjudul, slot filter, serta footer ringkasan.
 */
export function ChartCard({
  title,
  subtitle,
  icon = "chart",
  action,
  footer,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="flex-wrap gap-3">
        <div className="flex items-start gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Icon name={icon} size={16} />
          </span>
          <div>
            <CardTitle className="leading-snug">{title}</CardTitle>
            {subtitle && (
              <p className="text-[11px] font-medium text-[#7d7152] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-4 pb-5">
        <div className="w-full">{children}</div>
        {footer && (
          <div className="mt-4 pt-3.5 border-t border-white/60">{footer}</div>
        )}
      </CardContent>
    </Card>
  );
}
