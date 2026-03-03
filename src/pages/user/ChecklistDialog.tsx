import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import type { UserChecklistItem } from "@/lib/types";

interface ChecklistDialogProps {
  siteId: number | null;
  siteName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChecklistDialog({
  siteId,
  siteName,
  open,
  onOpenChange,
}: ChecklistDialogProps) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: checklist = [], isLoading } = useQuery({
    queryKey: ["user", "sites", siteId, "checklist"],
    queryFn: () => api.get<UserChecklistItem[]>(`/user/sites/${siteId}/checklist`),
    enabled: !!siteId && open,
    staleTime: 0,
    refetchOnMount: true,
  });

  const respondMut = useMutation({
    mutationFn: ({ itemId, response }: { itemId: number; response: boolean }) =>
      api.post(`/user/checklist/${itemId}/respond`, { response }),
    onMutate: async ({ itemId, response }) => {
      if (siteId == null) return {};
      await qc.cancelQueries({ queryKey: ["user", "sites", siteId, "checklist"] });
      const prev = qc.getQueryData<UserChecklistItem[]>(["user", "sites", siteId, "checklist"]);
      qc.setQueryData(["user", "sites", siteId, "checklist"], (old: UserChecklistItem[] | undefined) =>
        (old ?? []).map((item) =>
          item.id === itemId ? { ...item, my_response: response } : item
        )
      );
      return { prev };
    },
    onSuccess: async () => {
      if (siteId != null) await qc.refetchQueries({ queryKey: ["user", "sites", siteId, "checklist"] });
      toast({ title: "Response saved" });
    },
    onError: (e: Error, _vars, ctx) => {
      if (siteId != null && ctx?.prev != null) qc.setQueryData(["user", "sites", siteId, "checklist"], ctx.prev);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const list = Array.isArray(checklist) ? checklist : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="pr-8">Checklist: {siteName}</DialogTitle>
          <DialogDescription>Answer each question with Yes or No. Your answers are saved automatically.</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 min-h-0 -mx-1 px-1 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No checklist items for this site.</p>
          ) : (
            list.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-muted/50 border border-border/50"
              >
                <p className="font-medium text-sm text-foreground leading-snug flex-1">{item.question}</p>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={item.my_response === true ? "default" : "outline"}
                    className="min-w-[72px]"
                    onClick={() => respondMut.mutate({ itemId: item.id, response: true })}
                    disabled={respondMut.isPending}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 mr-1.5" /> Yes
                  </Button>
                  <Button
                    size="sm"
                    variant={item.my_response === false ? "destructive" : "outline"}
                    className="min-w-[72px]"
                    onClick={() => respondMut.mutate({ itemId: item.id, response: false })}
                    disabled={respondMut.isPending}
                  >
                    <ThumbsDown className="w-3.5 h-3.5 mr-1.5" /> No
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
