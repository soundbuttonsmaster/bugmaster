import { useParams, Link } from "react-router-dom";
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
import { Plus, Pencil, Trash2, ArrowLeft, Upload, ThumbsUp, ThumbsDown, Printer } from "lucide-react";
import { useState, useRef } from "react";
import type { ChecklistItem, Site } from "@/lib/types";
import { getCompletionColorClasses } from "@/lib/utils";

export default function SiteChecklist() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ChecklistItem | null>(null);
  const [question, setQuestion] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: site } = useQuery({
    queryKey: ["admin", "sites", id],
    queryFn: () => api.get<Site>(`/admin/sites/${id}`),
    enabled: !!id,
  });

  const { data: checklist = [] } = useQuery({
    queryKey: ["admin", "sites", id, "checklist"],
    queryFn: () => api.get<ChecklistItem[]>(`/admin/sites/${id}/checklist`),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: true,
  });

  const createMut = useMutation({
    mutationFn: () => api.post(`/admin/sites/${id}/checklist`, { question }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", id, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites", id] });
      setOpen(false);
      setQuestion("");
      toast({ title: "Checklist item added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: (itemId: number) =>
      api.post(`/admin/checklist/${itemId}`, { question, is_active: isActive }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", id, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites", id] });
      setEditing(null);
      setOpen(false);
      resetForm();
      toast({ title: "Checklist item updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (itemId: number) => api.delete(`/admin/checklist/${itemId}`),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", id, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites", id] });
      setDeleteId(null);
      toast({ title: "Checklist item deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const respondMut = useMutation({
    mutationFn: ({ itemId, response }: { itemId: number; response: boolean }) =>
      api.post(`/admin/checklist/${itemId}/respond`, { response }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", id, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites", id] });
      toast({ title: "Response recorded" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const importMut = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.post(`/admin/sites/${id}/checklist/import`, form, true);
    },
    onSuccess: async (res: { imported_count?: number }) => {
      await qc.refetchQueries({ queryKey: ["admin", "sites", id, "checklist"] });
      qc.invalidateQueries({ queryKey: ["admin", "sites", id] });
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
    setOpen(true);
  };

  const list = Array.isArray(checklist) ? checklist : [];

  if (!site) return null;

  return (
    <div className="space-y-8">
      <Link
        to="/admin/sites"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sites
      </Link>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Checklist: {site.name}</h1>
          <p className="text-muted-foreground">Manage checklist items for this site</p>
          {site.checklist_completion != null && (
            <div className="mt-2">
              <span className="text-sm text-muted-foreground mr-2">Overall completion:</span>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${getCompletionColorClasses(site.checklist_completion)}`}
              >
                {Math.round(site.checklist_completion)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
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
          <Link to={`/admin/sites/${id}/checklist/print`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" /> Print checklist
            </Button>
          </Link>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importMut.isPending}>
            <Upload className="w-4 h-4 mr-2" /> Import CSV
          </Button>
          <Button onClick={() => { setEditing(null); resetForm(); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Last response</TableHead>
              <TableHead className="w-[200px]">Admin respond</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.question}</TableCell>
                <TableCell>{item.is_active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    {item.last_response != null ? (
                      <span
                        className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          item.last_response === "Yes"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {item.last_response}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
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
                    <Button
                      variant={item.last_response === "Yes" ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => respondMut.mutate({ itemId: item.id, response: true })}
                      disabled={respondMut.isPending}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 mr-1" /> Yes
                    </Button>
                    <Button
                      variant={item.last_response === "No" ? "destructive" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => respondMut.mutate({ itemId: item.id, response: false })}
                      disabled={respondMut.isPending}
                    >
                      <ThumbsDown className="w-3.5 h-3.5 mr-1" /> No
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No checklist items. Add one or import CSV.</div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Item" : "Add Item"}</DialogTitle>
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
            {editing && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
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
    </div>
  );
}
