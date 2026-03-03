import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import type { UserChecklistItem, Site } from "@/lib/types";

export default function UserSiteChecklist() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: site } = useQuery({
    queryKey: ["user", "sites", id],
    queryFn: () => api.get<Site>(`/user/sites/${id}`),
    enabled: !!id,
  });

  const { data: checklist = [] } = useQuery({
    queryKey: ["user", "sites", id, "checklist"],
    queryFn: () => api.get<UserChecklistItem[]>(`/user/sites/${id}/checklist`),
    enabled: !!id,
  });

  const respondMut = useMutation({
    mutationFn: ({ itemId, response }: { itemId: number; response: boolean }) =>
      api.post(`/user/checklist/${itemId}/respond`, { response }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", "sites", id, "checklist"] });
      toast({ title: "Response saved" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const list = Array.isArray(checklist) ? checklist : [];

  if (!site) return null;

  return (
    <div className="space-y-8">
      <Link
        to="/user/sites"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sites
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Checklist: {site.name}</h1>
        <p className="text-muted-foreground">Answer each question with Yes or No</p>
      </div>

      <div className="space-y-4">
        {list.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="font-medium text-gray-800">{item.question}</p>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant={item.my_response === true ? "default" : "outline"}
                  onClick={() => respondMut.mutate({ itemId: item.id, response: true })}
                  disabled={respondMut.isPending}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" /> Yes
                </Button>
                <Button
                  size="sm"
                  variant={item.my_response === false ? "destructive" : "outline"}
                  onClick={() => respondMut.mutate({ itemId: item.id, response: false })}
                  disabled={respondMut.isPending}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" /> No
                </Button>
              </div>
            </div>
            {item.my_response !== null && (
              <p className="text-sm text-muted-foreground mt-2">
                Your answer: {item.my_response ? "Yes" : "No"}
              </p>
            )}
          </Card>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No checklist items for this site</div>
      )}
    </div>
  );
}
