import type { Route } from "./+types/route";
import { typographyVariants } from "@/components/ui/typography";
import { getUserId } from "@/server/clerk";
import { getAllLogsByUserId } from "@/db/logs.server";
import { RouteBadge } from "@/components/route-badge";

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
    const pointsB = POINTS[b.grade] || 0;

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
      percentage: Math.max(0, Math.min(percentage, 100)),
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
  const { percentage } = percentageToNextGrade(averagePoints);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={typographyVariants({ variant: "h3" })}>
          Current Grade: {currentGrade}{" "}
          <span className="text-lg">{percentage}%</span>
        </h1>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <ul className="divide-y divide-border grid grid-cols-[auto_1fr_auto_auto] gap-x-6 ">
          <li className="grid grid-cols-subgrid col-span-full">
            <span>Climb</span>
            <span>Sector</span>
            <span>Bonus</span>
            <span>Points</span>
          </li>
          {orderLogs(loaderData.logs)
            .slice(0, 10)
            .map((log) => (
              <li className="grid grid-cols-subgrid col-span-full py-1">
                <span className="">
                  <RouteBadge color={log.route.color}>
                    {log.route.grade}
                  </RouteBadge>
                </span>
                <span>{log.route.sector}</span>
                <span>{log.status === "FLASH" ? "+10" : "0"}</span>
                <span>
                  {POINTS[log.route.grade] + (log.status === "FLASH" ? 10 : 0)}
                </span>
              </li>
            ))}
        </ul>
        <div className="text-right font-semibold">Average {averagePoints}</div>
      </div>
    </div>
  );
}
