import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChart } from "@/hooks/useCharts";
import type { DayChart, Point } from "@/types";

const HEX = {
  text: "#e8e8f0",
  muted: "#6b6b80",
  soft: "#8890a0",
  grid: "#2a2a38",
  card: "#13131a",
  violet: "#7c6af7",
};

/* ----------------------------- Helpers ----------------------------- */

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const shortLabel = (s: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(
    parseDay(s),
  );

const longLabel = (s: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDay(s));

/**
 * The server only returns days that have jobs. Fill the gaps with 0 so the
 * line shows quiet days honestly, oldest day first.
 */
const buildSeries = (data: DayChart[]): Point[] => {
  const byDate = new Map(data.map((d) => [d.date, d]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(today.getDate() - 6);

  const earliest = data.length
    ? parseDay(data[data.length - 1].date)
    : sixDaysAgo;
  const start = earliest < sixDaysAgo ? earliest : sixDaysAgo;

  const points: Point[] = [];
  for (const d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = toKey(d);
    const day = byDate.get(key);
    points.push({
      date: key,
      label: shortLabel(key),
      jobs: day?.totalJobs ?? 0,
      topScore: day?.best.length
        ? Math.max(...day.best.map((p) => p.score))
        : null,
    });
  }
  return points;
};

/* ----------------------------- UI parts ----------------------------- */

const cardClass =
  "rounded-2xl border border-[#2a2a38] bg-[#13131a] p-6 text-[#e8e8f0] mb-5 shadow-lg shadow-black/10 sm:p-8";

const IconTile = () => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#19262b]">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4fd1c5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 5-6" />
    </svg>
  </div>
);

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Point }[];
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-[#2a2a38] bg-[#0f0f15] px-3.5 py-3 shadow-xl shadow-black/50">
      <div className="text-[13px] font-semibold text-[#e8e8f0]">
        {longLabel(p.date)}
      </div>
      <div className="mt-1.5 text-xs text-[#e8e8f0]">
        <strong>{p.jobs}</strong> {p.jobs === 1 ? "job" : "jobs"} added
      </div>
      {p.topScore !== null && (
        <div className="mt-0.5 text-xs text-[#4fd1c5]">
          Top CV match {p.topScore.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

const Stat = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div>
    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b6b80]">
      {label}
    </div>
    <div className="mt-1 text-2xl font-bold leading-none tracking-tight text-[#e8e8f0]">
      {value}
    </div>
    {hint && <div className="mt-1 text-xs text-[#8890a0]">{hint}</div>}
  </div>
);

/* ----------------------------- Component ----------------------------- */

export const Chart = () => {
  const { data, loading, error, lastUpdated } = useChart();

  const series = useMemo(() => buildSeries(data), [data]);

  const stats = useMemo(() => {
    const total = series.reduce((sum, p) => sum + p.jobs, 0);
    const busiest = series.reduce(
      (a, b) => (b.jobs > a.jobs ? b : a),
      series[0],
    );
    return {
      total,
      average: series.length ? total / series.length : 0,
      busiest,
    };
  }, [series]);

  if (loading && data.length === 0) {
    return (
      <div className={cardClass} role="status" aria-live="polite">
        <p className="m-0 text-sm text-[#8890a0]">Loading job activity…</p>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div
        className="rounded-2xl border border-[#f87171]/30 bg-[#f87171]/10 p-6"
        role="alert"
      >
        <strong className="text-[#f87171]">Couldn’t load the job chart.</strong>
        <p className="mt-1.5 text-sm text-[#f87171]/90">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cardClass}>
        <strong>No jobs in the last 7 days</strong>
        <p className="mt-1.5 text-sm text-[#8890a0]">
          New jobs will appear here once they’re indexed.
        </p>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <IconTile />
          <div>
            <h2 className="m-0 text-base font-bold tracking-tight text-[#e8e8f0]">
              Jobs added per day
            </h2>
            <p className="m-0 mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b6b80]">
              New listings, last 7 days
            </p>
          </div>
        </div>
        {lastUpdated && (
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4fd1c5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4fd1c5]" />
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </header>

      {/* Summary */}
      <div className="mt-6 flex flex-wrap gap-10 border-t border-[#2a2a38] pt-5">
        <Stat label="Total jobs" value={String(stats.total)} />
        <Stat label="Daily average" value={stats.average.toFixed(1)} />
        <Stat
          label="Busiest day"
          value={String(stats.busiest.jobs)}
          hint={stats.busiest.label}
        />
      </div>

      {/* Line chart */}
      <div className="mt-6 h-[340px] w-full">
        <ResponsiveContainer>
          <AreaChart
            data={series}
            margin={{ top: 24, right: 24, bottom: 8, left: 0 }}
          >
            <defs>
              <linearGradient id="jobsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={HEX.violet} stopOpacity={0.22} />
                <stop offset="100%" stopColor={HEX.violet} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={HEX.grid}
              strokeDasharray="3 3"
              strokeOpacity={0.7}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: HEX.soft }}
              tickLine={false}
              axisLine={{ stroke: HEX.grid }}
              padding={{ left: 16, right: 16 }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, (max: number) => Math.max(max + 1, 5)]}
              tick={{ fontSize: 12, fill: HEX.muted }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: HEX.grid }}
            />
            <Area
              type="monotone"
              dataKey="jobs"
              stroke={HEX.violet}
              strokeWidth={2.5}
              fill="url(#jobsFill)"
              dot={{ r: 4, fill: HEX.card, stroke: HEX.violet, strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: HEX.violet,
                stroke: HEX.card,
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="jobs"
                position="top"
                offset={10}
                style={{ fontSize: 12, fontWeight: 600, fill: HEX.text }}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {error && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-[#f5b942]/30 bg-[#f5b942]/10 px-3.5 py-2.5 text-[13px] text-[#f5b942]"
        >
          Refresh failed. Showing the last data we loaded.
        </p>
      )}
    </div>
  );
};
