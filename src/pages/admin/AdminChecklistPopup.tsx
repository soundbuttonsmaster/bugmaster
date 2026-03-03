import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
import { Plus, Pencil, Trash2, Upload, Loader2, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { ChecklistItem } from "@/lib/types";
import { getCompletionColorClasses } from "@/lib/utils";

interface AdminChecklistPopupProps {
  siteId: number | null;
  siteName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminChecklistPopup({
  siteId,
  siteName,
  open,
  onOpenChange,
}: AdminChecklistPopupProps) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<ChecklistItem | null>(null);
  const [question, setQuestion] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: checklist = [], isLoading } = useQuery({
    queryKey: ["admin", "sites", siteId, "checklist"],
    queryFn: () => api.get<ChecklistItem[]>(`/admin/sites/${siteId}/checklist`),
    enabled: !!siteId && open,
    staleTime: 0,
  });

  const createMut = useMutation({
    mutationFn: () => api.post(`/admin/sites/${siteId}/checklist`, { question }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", siteId, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites"] });
      setAddOpen(false);
      setQuestion("");
      toast({ title: "Checklist item added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: (itemId: number) =>
      api.post(`/admin/checklist/${itemId}`, { question, is_active: isActive }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", siteId, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites"] });
      setEditing(null);
      setAddOpen(false);
      resetForm();
      toast({ title: "Checklist item updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (itemId: number) => api.delete(`/admin/checklist/${itemId}`),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", siteId, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites"] });
      setDeleteId(null);
      toast({ title: "Checklist item deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const importMut = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.post(`/admin/sites/${siteId}/checklist/import`, form, true);
    },
    onSuccess: async (res: { imported_count?: number }) => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", siteId, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites"] });
      toast({ title: `Imported ${(res as { imported_count?: number }).imported_count ?? 0} items` });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (e: Error) => {
      toast({ title: "Import failed", description: e.message, variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const resetForm = () => {
    setQuestion("");
    setIsActive(true);
  };

  const openEdit = (item: ChecklistItem) => {
    setEditing(item);
    setQuestion(item.question);
    setIsActive(item.is_active);
    setAddOpen(true);
  };

  const list = Array.isArray(checklist) ? checklist : [];
  const activeList = list.filter((i) => i.is_active);
  const completedCount = activeList.filter((i) => i.last_response != null).length;
  const completion =
    activeList.length > 0 ? Math.round((completedCount / activeList.length) * 100) : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl">Checklist: {siteName}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {list.length} items
                  {completion != null && (
                    <span className={`ml-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getCompletionColorClasses(completion)}`}>
                      {completion}% complete
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {siteId && (
                  <Link to={`/admin/sites/${siteId}/checklist`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" /> Full page
                    </Button>
                  </Link>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) importMut.mutate(file);
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={importMut.isPending}>
                  <Upload className="w-4 h-4 mr-1" /> Import
                </Button>
                <Button size="sm" onClick={() => { setEditing(null); resetForm(); setAddOpen(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-6 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : list.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No checklist items. Add one or import CSV.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead className="w-16">Active</TableHead>
                    <TableHead>Last response</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-sm">{item.question}</TableCell>
                      <TableCell>{item.is_active ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          {item.last_response != null ? (
                            <span
                              className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-semibold ${
                                item.last_response === "Yes"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }`}
                            >
                              {item.last_response}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                          {(item.last_responded_by || item.last_responded_at) && (
                            <span className="text-xs text-muted-foreground">
                              {item.last_responded_by ?? "—"}
                              {item.last_responded_at && ` • ${new Date(item.last_responded_at).toLocaleString()}`}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit item" : "Add item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Is the site live?" />
            </div>
            {editing && (
              <div className="flex items-center gap-2">
                <input type="checkbox" id="popupActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <Label htmlFor="popupActive">Active</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              onClick={() => (editing ? updateMut.mutate(editing.id) : createMut.mutate())}
              disabled={!question.trim() || createMut.isPending || updateMut.isPending}
            >
              {editing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete checklist item?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
    </>
  );
}
