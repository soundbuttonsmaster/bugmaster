import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import type { ChecklistTemplate } from "@/lib/types";

export default function ChecklistTemplates() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ChecklistTemplate | null>(null);
  const [question, setQuestion] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: templates = [] } = useQuery({
    queryKey: ["admin", "checklist-templates"],
    queryFn: () => api.get<ChecklistTemplate[]>("/admin/checklist-templates"),
    staleTime: 0,
    refetchOnMount: true,
  });

  const createMut = useMutation({
    mutationFn: () =>
      api.post("/admin/checklist-templates", {
        question,
        is_active: isActive,
        order: order ?? 0,
      }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "checklist-templates"] });
      setOpen(false);
      resetForm();
      toast({ title: "Template created" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: (id: number) =>
      api.post(`/admin/checklist-templates/${id}`, {
        question,
        is_active: isActive,
        order: order ?? 0,
      }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "checklist-templates"] });
      setEditing(null);
      setOpen(false);
      resetForm();
      toast({ title: "Template updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/checklist-templates/${id}`),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "checklist-templates"] });
      setDeleteId(null);
      toast({ title: "Template deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const bulkImportMut = useMutation({
    mutationFn: () => api.post<{ message: string; sites_count: number; created_count: number; skipped_count: number }>("/admin/checklist-templates/bulk-import"),
    onSuccess: async (res) => {
      await qc.refetchQueries({ queryKey: ["admin", "checklist-templates"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites"] });
      toast({
        title: "Bulk import complete",
        description: `${res.sites_count} sites • ${res.created_count} created, ${res.skipped_count} skipped`,
      });
    },
    onError: (e: Error) => toast({ title: "Bulk import failed", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setQuestion("");
    setIsActive(true);
    setOrder(0);
  };

  const openEdit = (t: ChecklistTemplate) => {
    setEditing(t);
    setQuestion(t.question);
    setIsActive(t.is_active);
    setOrder(t.order);
    setOpen(true);
  };

  const list = Array.isArray(templates) ? templates : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Checklist Templates</h1>
          <p className="text-muted-foreground mt-1">
            Global question bank. Add templates here, then use Bulk import to push active questions to every site.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => bulkImportMut.mutate()}
            disabled={bulkImportMut.isPending || list.filter((t) => t.is_active).length === 0}
          >
            <Upload className="w-4 h-4 mr-2" /> Bulk import to all sites
          </Button>
          <Button onClick={() => { setEditing(null); resetForm(); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Template
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...list].sort((a, b) => a.order - b.order).map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-muted-foreground">{t.order}</TableCell>
                <TableCell className="font-medium">{t.question}</TableCell>
                <TableCell>{t.is_active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No templates yet. Add a template, then use Bulk import to add questions to every site.
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Template" : "Add Template"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Is the site live and accessible?"
              />
            </div>
            <div className="space-y-2">
              <Label>Order (display order)</Label>
              <Input
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <Label htmlFor="isActive">Active (included in bulk import)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => (editing ? updateMut.mutate(editing.id) : createMut.mutate())}
              disabled={!question.trim() || createMut.isPending || updateMut.isPending}
            >
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>This only removes the template from the bank. Existing checklist items on sites are not removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMut.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
