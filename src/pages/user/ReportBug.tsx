import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getDomainFromLink } from "@/lib/utils";
import type { Site } from "@/lib/types";

export default function ReportBug() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const { data: site } = useQuery({
    queryKey: ["user", "sites", id],
    queryFn: () => api.get<Site>(`/user/sites/${id}`),
    enabled: !!id,
  });

  const submitMut = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      if (link) form.append("link", link);
      if (attachment) form.append("attachment", attachment);
      return api.post(`/user/sites/${id}/report-bug`, form, true);
    },
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["user", "my-bug-reports"] });
      toast({ title: "Bug report submitted" });
      navigate("/user/bug-reports");
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMut.mutate();
  };

  if (!site) return null;

  const domain = getDomainFromLink(site.link);

  return (
    <div className="space-y-8 max-w-2xl">
      <Link
        to="/user/sites"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sites
      </Link>

      <div>
        {domain && (
          <span
            className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20 mb-3 block w-fit"
            title={site.link || undefined}
          >
            {domain}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight">Report Bug</h1>
        <p className="text-muted-foreground mt-1">Submit a bug report for {site.name}</p>
      </div>

      <Card className="p-6 border border-blue-200/50 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short bug title" required />
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description"
              rows={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Page URL (optional)</Label>
            <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Screenshot / Attachment (optional)</Label>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button type="submit" disabled={!title.trim() || !description.trim() || submitMut.isPending}>
            {submitMut.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
