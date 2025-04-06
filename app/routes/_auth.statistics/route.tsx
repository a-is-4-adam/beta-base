import type { Route } from "./+types/route";
import { getUserId } from "@/server/clerk";
import { getAllLogsByUserId } from "@/db/logs.server";
import { RouteBadge } from "@/components/route-badge";
import { Progress } from "@/components/ui/progress";
import { Label, labelVariants } from "@/components/ui/field";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table";

const POINTS = {
  VB: 200,
  "V0-": 350,
  V0: 400,
  "V0+": 450,
  V1: 500,
  V2: 550,
  V3: 600,
  V4: 633,
  V5: 667,
  V6: 700,
  V7: 720,
  V8: 740,
  V9: 760,
};

function orderLogs(logs: Awaited<ReturnType<typeof loader>>["logs"]) {
  return logs.sort((a, b) => {
    const pointsA = POINTS[a.route.grade] || 0;
    const pointsB = POINTS[b.route.grade] || 0;

    // First, sort by points (descending)
    if (pointsB !== pointsA) {
      return pointsB - pointsA;
    }

    // If points are the same, sort by createdAt (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

function averageTopClimbs(
  logs: Awaited<ReturnType<typeof loader>>["logs"],
  topN: number
): number {
  const orderedLogs = orderLogs(logs);
  const topClimbs = orderedLogs.slice(0, topN);

  const totalPoints = topClimbs.reduce((sum, log) => {
    return sum + (POINTS[log.route.grade] || 0);
  }, 0);

  return totalPoints / topClimbs.length;
}

function getClosestGrade(averagePoints: number): string {
  let closest = "VB"; // Default to the lowest grade
  for (const [grade, points] of Object.entries(POINTS)) {
    if (points <= averagePoints) {
      closest = grade; // Update closest if points are less than or equal
    }
  }
  return closest;
}

function percentageToNextGrade(averagePoints: number): {
  grade: string;
  percentage: number;
} {
  const closest = getClosestGrade(averagePoints);
  const closestPoints = POINTS[closest];

  // Find the next grade
  const grades = Object.keys(POINTS);
  const closestIndex = grades.indexOf(closest);
  const nextGrade =
    closestIndex < grades.length - 1 ? grades[closestIndex + 1] : null;
  const nextPoints = nextGrade ? POINTS[nextGrade] : null;

  if (nextPoints !== null) {
    const percentage =
      ((averagePoints - closestPoints) / (nextPoints - closestPoints)) * 100;
    return {
      grade: nextGrade,
      percentage: Math.floor(Math.max(0, Math.min(percentage, 100))),
    }; // Clamp between 0 and 100
  }

  return { grade: null, percentage: 0 }; // No next grade available
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await getUserId(args);

  const logs = await getAllLogsByUserId(userId);

  return {
    logs,
  };
}

export const handle = {
  breadcrumb: "Statistics",
};

export default function Route({ loaderData }: Route.ComponentProps) {
  const orderedLogs = orderLogs(loaderData.logs);

  const averagePoints = averageTopClimbs(loaderData.logs, 10);

  const currentGrade = getClosestGrade(averagePoints);
  const { grade: nextGrade, percentage } = percentageToNextGrade(averagePoints);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Progress value={percentage}>
          <div className="flex w-full justify-between pb-2">
            <Label>
              <span className="font-semibold">{currentGrade}</span>
            </Label>
            <span className={labelVariants({ className: "font-semibold" })}>
              {nextGrade}
            </span>
          </div>
        </Progress>
        <span
          className="relative inline-block translate-y-1"
          style={{
            "--tw-translate-x": percentage + "%",
          }}
        >
          <span className="relative inline-block  transform -translate-x-1/2  mb-2 bg-primary text-xs text-primary-foreground text-center rounded-sm px-2 py-1">
            {percentage}%
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-5 border-transparent border-b-primary w-0 h-0"></div>
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="border border-border rounded-xl overflow-hidden">
          <Table aria-label="Files" selectionMode="multiple">
            <TableHeader className="bg-muted [&_th]:py-3">
              <Column isRowHeader className="pl-2">
                Route
              </Column>
              <Column isRowHeader className="w-full">
                Sector
              </Column>
              <Column isRowHeader>Days remaining</Column>
              <Column isRowHeader>Bonus</Column>
              <Column isRowHeader className="pr-2">
                Points
              </Column>
            </TableHeader>
            <TableBody>
              {orderedLogs.slice(0, 10).map((log) => {
                const givenDate = new Date(log.createdAt);
                const currentDate = new Date();
                const timeDifference =
                  currentDate.getTime() - givenDate.getTime();

                // Convert the time difference from milliseconds to days
                const daysDifference = Math.floor(
                  timeDifference / (1000 * 60 * 60 * 24)
                );
                return (
                  <Row key={log.route.id}>
                    <Cell className="pl-4">
                      <RouteBadge color={log.route.color} className="size-8">
                        {log.route.grade}
                      </RouteBadge>
                    </Cell>
                    <Cell className="capitalize">{log.route.sector}</Cell>
                    <Cell className="text-right">{60 - daysDifference}</Cell>
                    <Cell className="text-right">
                      {log.status === "FLASH" ? 10 : 0}
                    </Cell>
                    <Cell className="text-right pr-4">
                      {POINTS[log.route.grade]}
                    </Cell>
                  </Row>
                );
              })}
            </TableBody>
          </Table>
          <div className="pb-3 bg-muted">
            <div className="text-right pr-2 mt-2 pt-2 border-t border-border text-sm">
              <span className="font-semibold text-muted-foreground pr-4">
                Average
              </span>{" "}
              {averagePoints}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
