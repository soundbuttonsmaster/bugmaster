import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bug, ExternalLink, ClipboardList } from "lucide-react";
import { getDomainFromLink } from "@/lib/utils";
import ChecklistDialog from "./ChecklistDialog";
import type { Site } from "@/lib/types";

export default function ProjectSites() {
  const { id } = useParams<{ id: string }>();
  const [checklistSite, setChecklistSite] = useState<{ id: number; name: string } | null>(null);

  const { data: project } = useQuery({
    queryKey: ["user", "projects", id],
    queryFn: () => api.get<{ name: string }>(`/user/projects/${id}`),
    enabled: !!id,
  });

  const { data: sites = [] } = useQuery({
    queryKey: ["user", "projects", id, "sites"],
    queryFn: () => api.get<Site[]>(`/user/projects/${id}/sites`),
    enabled: !!id,
  });

  const list = Array.isArray(sites) ? sites : [];

  return (
    <div className="space-y-8">
      <Link
        to="/user"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {project?.name ?? "Project"} — Sites
        </h1>
        <p className="text-muted-foreground mt-1">Complete checklists or report bugs for each site</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const domain = getDomainFromLink(s.link);
          return (
            <Card
              key={s.id}
              className="overflow-hidden bg-white/90 backdrop-blur-sm border border-blue-200/50 shadow-md hover:shadow-xl hover:border-blue-300/50 transition-all duration-300"
            >
              <div className="p-5">
                {/* Domain pill – easy to distinguish similar domains */}
                {domain && (
                  <div className="mb-3">
                    <span
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20"
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
                      className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Open site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {s.launch_date && (
                  <p className="text-xs text-muted-foreground mb-4">Launch: {s.launch_date}</p>
                )}
                {/* Personal checklist completion (from user site API) */}
                {s.checklist_completion != null && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Your checklist</span>
                      <span className="font-medium text-foreground">
                        {s.checklist_completion === 100 ? "Complete" : `${Math.round(s.checklist_completion)}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          s.checklist_completion === 100 ? "bg-green-500" : "bg-primary"
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
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-muted-foreground">No sites in this project</p>
        </div>
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
