import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building,
  Calendar,
  FileText,
  ImageIcon,
  Layers,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { getAdminDashboardStats } from "@/lib/db/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "hsl(142 71% 35%)",
  "hsl(162 60% 38%)",
  "hsl(200 70% 45%)",
  "hsl(38 80% 50%)",
  "hsl(280 45% 52%)",
  "hsl(210 15% 55%)",
];

const contentChartConfig = {
  articles: { label: "Actualités", color: CHART_COLORS[0] },
  centres: { label: "Centres", color: CHART_COLORS[1] },
  activities: { label: "Activités", color: CHART_COLORS[2] },
  schools: { label: "Écoles", color: CHART_COLORS[3] },
  media: { label: "Médias", color: CHART_COLORS[4] },
  partners: { label: "Partenaires", color: CHART_COLORS[5] },
};

const trendChartConfig = {
  count: { label: "Publications", color: "hsl(142 71% 35%)" },
};

interface AdminDashboardProps {
  onNavigate: (sectionId: string) => void;
}

const quickActions = [
  { id: "news", label: "Nouvel article", icon: FileText, primary: true },
  { id: "heroes", label: "Bannières", icon: ImageIcon },
  { id: "impacts", label: "Impacts", icon: TrendingUp },
  { id: "sections", label: "Sections", icon: Layers },
  { id: "centres", label: "Centres", icon: Building },
  { id: "activities", label: "Activités", icon: Calendar },
];

function formatRelativeTime(isoDate: string) {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "À l'instant";
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Hier";
  return `Il y a ${diffDays} j`;
}

const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      return await getAdminDashboardStats();
    },
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const { headline, contentByType, monthlyPublications, recentUpdates, alerts, healthScore } = data;

  const pieData = contentByType.map((item) => ({
    ...item,
    fill: contentChartConfig[item.key as keyof typeof contentChartConfig]?.color ?? CHART_COLORS[0],
  }));

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-green-50 p-6 shadow-sm">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-700">
                État du site
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
              Santé éditoriale à <span className="font-mono text-green-600">{healthScore}%</span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Vue d'ensemble du contenu publié, des centres actifs et des éléments nécessitant votre attention.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.primary ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-2",
                  action.primary && "bg-green-600 hover:bg-green-700",
                  !action.primary && "border-green-300 bg-white hover:bg-green-50"
                )}
                onClick={() => onNavigate(action.id)}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles publiés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{headline.publishedArticles}</div>
            <p className="text-xs text-muted-foreground">
              {headline.draftArticles} brouillon{headline.draftArticles !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Centres actifs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{headline.activeCentres}</div>
            <p className="text-xs text-muted-foreground">Structures opérationnelles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{headline.activeActivities}</div>
            <p className="text-xs text-muted-foreground">Programmes en ligne</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sections</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{headline.totalSections}</div>
            <p className="text-xs text-muted-foreground">
              {headline.inactiveContent} élément{headline.inactiveContent !== 1 ? "s" : ""} inactif
              {headline.inactiveContent !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Tendance
              </p>
              <CardTitle className="text-lg">Publications — 6 derniers mois</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-green-700" onClick={() => onNavigate("news")}>
              Voir les articles
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendChartConfig} className="h-[240px] w-full">
              <BarChart data={monthlyPublications} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis hide allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Répartition
            </p>
            <CardTitle className="text-lg">Contenu par type</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <>
                <ChartContainer config={contentChartConfig} className="mx-auto h-[180px] w-full max-w-[220px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={78}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.key} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <ul className="mt-4 space-y-2">
                  {pieData.map((item) => (
                    <li key={item.key} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                        {item.name}
                      </span>
                      <span className="font-mono font-medium tabular-nums">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Aucun contenu enregistré pour le moment.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Activité
            </p>
            <CardTitle className="text-lg">Dernières mises à jour</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUpdates.length > 0 ? (
              <ul className="divide-y divide-border/60">
                {recentUpdates.map((item) => (
                  <li key={`${item.type}-${item.id}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type} · {formatRelativeTime(item.updatedAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune activité récente enregistrée.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Alertes
              </p>
              <CardTitle className="text-lg">Points d'attention</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <ul className="space-y-3">
                {alerts.map((alert, index) => (
                  <li
                    key={index}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm",
                      alert.level === "error" && "border-red-200 bg-red-50 text-red-800",
                      alert.level === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
                      alert.level === "info" && "border-sky-200 bg-sky-50 text-sky-900"
                    )}
                  >
                    {alert.message}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Tout est en ordre — aucune alerte pour le moment.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
