import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, Bug, ClipboardList, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { getDomainFromLink } from "@/lib/utils";
import ChecklistDialog from "./ChecklistDialog";
import type { Site } from "@/lib/types";

export default function UserSites() {
  const [checklistSite, setChecklistSite] = useState<{ id: number; name: string } | null>(null);

  const { data: sites = [], isLoading } = useQuery({
    queryKey: ["user", "sites"],
    queryFn: () => api.get<Site[]>("/user/sites"),
  });

  const list = Array.isArray(sites) ? sites : [];
  const completedCount = list.filter((s) => s.checklist_completion === 100).length;

  const stats = [
    { title: "Total sites", value: list.length, subtitle: "Sites you can access", icon: Globe, color: "text-blue-600", bgColor: "bg-blue-100", borderColor: "border-blue-200/50" },
    { title: "Checklists complete", value: completedCount, subtitle: "Fully done", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-100", borderColor: "border-emerald-200/50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sites</h1>
        <p className="text-muted-foreground mt-1">All sites where you can report bugs and complete checklists</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {list.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat, i) => (
                <Card
                  key={i}
                  className={`p-5 bg-white/90 backdrop-blur-sm border ${stat.borderColor} shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-0.5">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => {
              const domain = getDomainFromLink(s.link);
              return (
                <Card
                  key={s.id}
                  className="overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-md hover:shadow-xl hover:border-blue-300/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="p-6">
                    {domain && (
                      <div className="mb-3">
                        <span
                          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-200"
                          title={s.link || undefined}
                        >
                          {domain}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <h3 className="font-semibold text-gray-800 leading-tight line-clamp-2">{s.name}</h3>
                      {s.link && (
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Open site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {s.launch_date && (
                      <p className="text-xs text-muted-foreground mb-4">Launch: {s.launch_date}</p>
                    )}
                    {s.checklist_completion != null && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Your checklist</span>
                          <span className="font-medium text-foreground">
                            {s.checklist_completion === 100 ? "Complete" : `${Math.round(s.checklist_completion)}%`}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              s.checklist_completion === 100 ? "bg-emerald-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${Math.min(100, Math.round(s.checklist_completion))}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setChecklistSite({ id: s.id, name: s.name })}
                      >
                        <ClipboardList className="w-4 h-4 mr-2" /> Checklist
                      </Button>
                      <Link to={`/user/sites/${s.id}/report-bug`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Bug className="w-4 h-4 mr-2" /> Report Bug
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {list.length === 0 && (
            <Card className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-700">No sites available</p>
              <p className="text-sm text-gray-500 mt-1">Sites assigned to you will appear here</p>
            </Card>
          )}
        </>
      )}

      <ChecklistDialog
        siteId={checklistSite?.id ?? null}
        siteName={checklistSite?.name ?? ""}
        open={!!checklistSite}
        onOpenChange={(open) => !open && setChecklistSite(null)}
      />
    </div>
  );
}
