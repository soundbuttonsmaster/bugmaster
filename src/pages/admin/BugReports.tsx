import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAttachmentUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import type { BugReport, Site } from "@/lib/types";

export default function BugReports() {
  const [siteFilter, setSiteFilter] = useState<string>("");
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: bugReports = [] } = useQuery({
    queryKey: ["admin", "bug-reports", siteFilter],
    queryFn: () =>
      api.get<BugReport[]>(`/admin/bug-reports${siteFilter ? `?site=${siteFilter}` : ""}`),
  });

  const { data: sites = [] } = useQuery({
    queryKey: ["admin", "sites"],
    queryFn: () => api.get<Site[]>("/admin/sites"),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.post(`/admin/bug-reports/${id}/status`, { status }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "bug-reports"] });
      toast({ title: "Status updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const list = Array.isArray(bugReports) ? bugReports : [];
  const siteList = Array.isArray(sites) ? sites : [];

  const statusColor = (s: string) => {
    if (s === "resolved") return "bg-green-100 text-green-800";
    if (s === "processing") return "bg-blue-100 text-blue-800";
    return "bg-amber-100 text-amber-800";
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bug Reports</h1>
          <p className="text-muted-foreground">View and manage bug reports</p>
        </div>
        <Select value={siteFilter || "all"} onValueChange={(v) => setSiteFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sites</SelectItem>
            {siteList.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium max-w-[200px]">
                  <div className="truncate" title={b.title}>{b.title}</div>
                  {b.description && (
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{b.description}</div>
                  )}
                </TableCell>
                <TableCell>{b.site_name}</TableCell>
                <TableCell>
                  <div className="text-sm">{b.reporter_name}</div>
                  <div className="text-xs text-muted-foreground">{b.reporter_email}</div>
                </TableCell>
                <TableCell>
                  <Select
                    value={b.status}
                    onValueChange={(v) => statusMut.mutate({ id: b.id, status: v })}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  {b.link && (
                    <a
                      href={b.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {b.attachment && (
                    <a
                      href={getAttachmentUrl(b.attachment) ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      Attachment
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No bug reports found</div>
        )}
      </Card>
    </div>
  );
}
