import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";

export default function UserProjects() {
  const { data: projects = [] } = useQuery({
    queryKey: ["user", "projects"],
    queryFn: () => api.get<Project[]>("/user/projects"),
  });

  const list = Array.isArray(projects) ? projects : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">Choose a project to view sites, checklists, and report bugs</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} to={`/user/projects/${p.id}`}>
            <Card className="h-full overflow-hidden bg-white/90 backdrop-blur-sm border border-blue-200/50 shadow-md hover:shadow-xl hover:border-blue-300/50 transition-all duration-300 cursor-pointer group p-5">
              <h3 className="font-semibold text-gray-800 mb-2 leading-tight group-hover:text-primary transition-colors">
                {p.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Created {new Date(p.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center text-primary text-sm font-medium">
                View sites <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-muted-foreground">No projects available</p>
        </div>
      )}
    </div>
  );
}
