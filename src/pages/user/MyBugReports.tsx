import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FILE_BASE_URL } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { BugReport } from "@/lib/types";

export default function MyBugReports() {
  const { data: bugReports = [] } = useQuery({
    queryKey: ["user", "my-bug-reports"],
    queryFn: () => api.get<BugReport[]>("/user/my-bug-reports"),
  });

  const list = Array.isArray(bugReports) ? bugReports : [];

  const statusVariant = (s: string) => {
    if (s === "resolved") return "default";
    if (s === "processing") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bug Reports</h1>
        <p className="text-muted-foreground mt-1">Track status of your submitted bug reports</p>
      </div>

      <div className="space-y-4">
        {list.map((b) => (
          <Card
            key={b.id}
            className="p-5 bg-white/90 backdrop-blur-sm border border-blue-200/50 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{b.description}</p>
                <p className="text-xs text-muted-foreground">Site: {b.site_name}</p>
                <p className="text-xs text-muted-foreground">Submitted {new Date(b.created_at).toLocaleString()}</p>
              </div>
              <Badge variant={statusVariant(b.status)} className="shrink-0 capitalize">
                {b.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
              {b.link && (
                <a
                  href={b.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {b.attachment && (
                <a
                  href={`${FILE_BASE_URL}${b.attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Attachment
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>

      {list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-muted-foreground">No bug reports yet</p>
        </div>
      )}
    </div>
  );
}
