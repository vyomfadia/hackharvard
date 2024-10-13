"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with a custom shape";

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return Math.floor(x);
}

const chartConfig = {
  visitors: {
    label: "Steps",
  },
  safari: {
    label: "Safari",
    color: "#00ffff",
  },
} satisfies ChartConfig;

export default function Radial({ seed }) {
  const chartData = [{ steps: seededRandom(seed), fill: "#00ffff" }];
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={100}
        innerRadius={80}
        outerRadius={140}
      >
        <RadialBar dataKey="steps" />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      style={{ fill: "#fff" }} // Value in white
                      className="text-4xl font-bold"
                    >
                      {chartData[0].steps}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      style={{ fill: "#fff" }} // Steps label in white
                    >
                      Steps
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
