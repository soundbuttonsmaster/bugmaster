import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, FolderKanban, Globe, Loader2, CheckCircle2 } from "lucide-react";
import type { Project } from "@/lib/types";
import type { Site } from "@/lib/types";

export default function UserProjects() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["user", "projects"],
    queryFn: () => api.get<Project[]>("/user/projects"),
  });
  const { data: sites = [] } = useQuery({
    queryKey: ["user", "sites"],
    queryFn: () => api.get<Site[]>("/user/sites"),
  });

  const list = Array.isArray(projects) ? projects : [];
  const siteList = Array.isArray(sites) ? sites : [];
  const completedSites = siteList.filter((s) => s.checklist_completion === 100).length;

  const stats = [
    { title: "Projects", value: list.length, subtitle: "Your projects", icon: FolderKanban, color: "text-blue-600", bgColor: "bg-blue-100", borderColor: "border-blue-200/50" },
    { title: "Sites", value: siteList.length, subtitle: "Total sites", icon: Globe, color: "text-emerald-600", bgColor: "bg-emerald-100", borderColor: "border-emerald-200/50" },
    { title: "Checklists done", value: completedSites, subtitle: "Fully completed", icon: CheckCircle2, color: "text-violet-600", bgColor: "bg-violet-100", borderColor: "border-violet-200/50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
        <p className="text-muted-foreground mt-1">Choose a project to view sites, complete checklists, and report bugs</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
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

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your projects</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <Link key={p.id} to={`/user/projects/${p.id}`} className="group block">
                  <Card className="h-full overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-md hover:shadow-xl hover:border-blue-300/50 transition-all duration-300 cursor-pointer p-6 group-hover:scale-[1.02]">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow">
                        <FolderKanban className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(p.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </p>
                    <p className="text-sm text-blue-600 font-medium mt-3 flex items-center gap-1">
                      View sites <ArrowRight className="w-4 h-4 opacity-80" />
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {list.length === 0 && (
            <Card className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
              <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-700">No projects available</p>
              <p className="text-sm text-gray-500 mt-1">Projects assigned to you will appear here</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
