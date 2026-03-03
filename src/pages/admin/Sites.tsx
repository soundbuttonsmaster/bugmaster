import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Site, Project } from "@/lib/types";
import { getCompletionColorClasses } from "@/lib/utils";

export default function Sites() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: projects = [] } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => api.get<Project[]>("/admin/projects"),
  });
  const { data: sites = [] } = useQuery({
    queryKey: ["admin", "sites"],
    queryFn: () => api.get<Site[]>("/admin/sites"),
  });

  const createMut = useMutation({
    mutationFn: () =>
      api.post("/admin/sites", {
        project: Number(projectId),
        name,
        link: link || undefined,
        launch_date: launchDate || undefined,
      }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites"] });
      setOpen(false);
      resetForm();
      toast({ title: "Site created" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: () =>
      api.post(`/admin/sites/${editing!.id}`, {
        name,
        link: link || undefined,
        launch_date: launchDate || undefined,
      }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites"] });
      setEditing(null);
      setOpen(false);
      resetForm();
      toast({ title: "Site updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/sites/${id}`),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "sites"] });
      setDeleteId(null);
      toast({ title: "Site deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setProjectId("");
    setName("");
    setLink("");
    setLaunchDate("");
  };

  const openEdit = (s: Site) => {
    setEditing(s);
    setProjectId(String(s.project));
    setName(s.name);
    setLink(s.link || "");
    setLaunchDate(s.launch_date || "");
    setOpen(true);
  };

  const projectList = Array.isArray(projects) ? projects : [];
  const siteList = Array.isArray(sites) ? sites : [];
  const getProjectName = (id: number) => projectList.find((p) => p.id === id)?.name ?? id;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sites</h1>
          <p className="text-muted-foreground">Manage sites per project</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            resetForm();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Site
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Launch Date</TableHead>
              <TableHead className="whitespace-nowrap">Checklist</TableHead>
              <TableHead className="whitespace-nowrap">Completion</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siteList.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{getProjectName(s.project)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{s.link || "—"}</TableCell>
                <TableCell>{s.launch_date || "—"}</TableCell>
                <TableCell>
                  {s.checklist_items_count != null ? (
                    <span className="text-sm">{s.checklist_items_count} items</span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {s.checklist_completion != null ? (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCompletionColorClasses(s.checklist_completion)}`}
                    >
                      {Math.round(s.checklist_completion)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Link to={`/admin/sites/${s.id}/checklist`}>
                      <Button variant="outline" size="sm">
                        <ClipboardList className="w-4 h-4 mr-1" /> Checklist
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Site" : "Add Site"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!editing && (
              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={projectId} onValueChange={setProjectId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectList.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Site name" />
            </div>
            <div className="space-y-2">
              <Label>Link (optional)</Label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Launch Date (optional)</Label>
              <Input
                type="date"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => (editing ? updateMut.mutate() : createMut.mutate())}
              disabled={
                !name.trim() ||
                (!editing && !projectId) ||
                createMut.isPending ||
                updateMut.isPending
              }
            >
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete site?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the site and all its checklist items. This action cannot be undone.
            </AlertDialogDescription>
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
