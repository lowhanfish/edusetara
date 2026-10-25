"use client";

import React, { useMemo } from "react";
import type * as HighchartsType from "highcharts";
import { AdminHighchart, EDUSETARA_CHART_COLORS } from "./highchart-base";

/* ═══════════════════════════════════════════════════════════════════════════
   1. COLUMN / BAR CHART REUSABLE (Grouped, Stacked, atau Persentase)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ColumnBarSeriesItem {
  name: string;
  data: number[];
  color?: string;
}

export interface ColumnBarChartProps {
  categories: string[];
  series: ColumnBarSeriesItem[];
  horizontal?: boolean;
  stacking?: "normal" | "percent";
  yAxisSuffix?: string;
  height?: number;
  showLegend?: boolean;
}

export function ColumnBarChart({
  categories,
  series,
  horizontal = false,
  stacking,
  yAxisSuffix = "",
  height = 290,
  showLegend = true,
}: ColumnBarChartProps) {
  const chartType = horizontal ? "bar" : "column";

  const options = useMemo<HighchartsType.Options>(
    () => ({
      chart: {
        type: chartType,
      },
      xAxis: {
        categories,
      },
      yAxis: {
        labels: {
          format: `{value}${yAxisSuffix}`,
        },
      },
      legend: {
        enabled: showLegend,
      },
      tooltip: {
        shared: true,
        valueSuffix: yAxisSuffix ? ` ${yAxisSuffix}` : "",
      },
      plotOptions: {
        [chartType]: {
          stacking,
          borderRadius: stacking ? 4 : 6,
          pointPadding: 0.12,
          groupPadding: 0.16,
        },
      },
      series: series.map((item, idx) => ({
        type: chartType,
        name: item.name,
        data: item.data,
        color:
          item.color ??
          EDUSETARA_CHART_COLORS[idx % EDUSETARA_CHART_COLORS.length],
      })),
    }),
    [categories, series, chartType, stacking, yAxisSuffix, showLegend]
  );

  return <AdminHighchart options={options} height={height} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. DONUT / PIE CHART REUSABLE
   ═══════════════════════════════════════════════════════════════════════════ */

export interface DonutSliceItem {
  name: string;
  y: number;
  color?: string;
}

export interface DonutPieChartProps {
  data: DonutSliceItem[];
  seriesName?: string;
  innerSize?: string;
  centerLabel?: string;
  centerValue?: string;
  unitLabel?: string;
  height?: number;
}

export function DonutPieChart({
  data,
  seriesName = "Jumlah",
  innerSize = "64%",
  centerLabel,
  centerValue,
  unitLabel = "",
  height = 290,
}: DonutPieChartProps) {
  const options = useMemo<HighchartsType.Options>(
    () => ({
      chart: {
        type: "pie",
      },
      subtitle:
        centerValue || centerLabel
          ? {
              useHTML: true,
              text: `<div style="text-align:center;line-height:1.25;">
                ${
                  centerValue
                    ? `<div style="font-size:18px;font-weight:800;color:#2d2410;">${centerValue}</div>`
                    : ""
                }
                ${
                  centerLabel
                    ? `<div style="font-size:10px;font-weight:600;color:#7d7152;margin-top:2px;">${centerLabel}</div>`
                    : ""
                }
              </div>`,
              floating: true,
              verticalAlign: "middle",
              y: -8,
            }
          : undefined,
      tooltip: {
        pointFormat: `<b>{point.y:,.0f}${unitLabel ? ` ${unitLabel}` : ""}</b> ({point.percentage:.1f}%)`,
      },
      plotOptions: {
        pie: {
          innerSize,
          allowPointSelect: true,
          cursor: "pointer",
          showInLegend: true,
          dataLabels: {
            enabled: true,
            distance: 14,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "10.5px",
              fontWeight: "700",
              color: "#2d2410",
              textOutline: "none",
            },
          },
        },
      },
      series: [
        {
          type: "pie",
          name: seriesName,
          data: data.map((slice, idx) => ({
            name: slice.name,
            y: slice.y,
            color:
              slice.color ??
              EDUSETARA_CHART_COLORS[idx % EDUSETARA_CHART_COLORS.length],
          })),
        },
      ],
    }),
    [data, seriesName, innerSize, centerLabel, centerValue, unitLabel]
  );

  return <AdminHighchart options={options} height={height} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. TREND SPLINE / AREA CHART REUSABLE
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TrendSeriesItem {
  name: string;
  data: number[];
  color?: string;
  type?: "spline" | "areaspline" | "column";
}

export interface TrendSplineChartProps {
  categories: string[];
  series: TrendSeriesItem[];
  yAxisSuffix?: string;
  height?: number;
}

export function TrendSplineChart({
  categories,
  series,
  yAxisSuffix = "",
  height = 290,
}: TrendSplineChartProps) {
  const options = useMemo<HighchartsType.Options>(
    () => ({
      xAxis: {
        categories,
      },
      yAxis: {
        labels: {
          format: `{value}${yAxisSuffix}`,
        },
      },
      tooltip: {
        shared: true,
        valueSuffix: yAxisSuffix ? ` ${yAxisSuffix}` : "",
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.16,
          lineWidth: 2.5,
          marker: {
            enabled: true,
            radius: 4,
          },
        },
        spline: {
          lineWidth: 2.5,
          marker: {
            enabled: true,
            radius: 4,
          },
        },
      },
      series: series.map((item, idx) => {
        const color =
          item.color ??
          EDUSETARA_CHART_COLORS[idx % EDUSETARA_CHART_COLORS.length];
        return {
          type: item.type ?? "areaspline",
          name: item.name,
          data: item.data,
          color,
        } as HighchartsType.SeriesOptionsType;
      }),
    }),
    [categories, series, yAxisSuffix]
  );

  return <AdminHighchart options={options} height={height} />;
}
