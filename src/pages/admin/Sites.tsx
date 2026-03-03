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
import { Plus, Pencil, Trash2, ClipboardList, Globe, Search, Filter, Loader2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import type { Site, Project } from "@/lib/types";
import { getCompletionColorClasses, getDomainFromLink } from "@/lib/utils";
import AdminChecklistPopup from "./AdminChecklistPopup";

type CompletionFilter = "all" | "complete" | "incomplete" | "none";

export default function Sites() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [checklistPopupSite, setChecklistPopupSite] = useState<{ id: number; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterCompletion, setFilterCompletion] = useState<CompletionFilter>("all");
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: projects = [] } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => api.get<Project[]>("/admin/projects"),
  });
  const { data: sites = [], isLoading } = useQuery({
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

  const filteredSites = useMemo(() => {
    let list = siteList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.link && s.link.toLowerCase().includes(q)) ||
          getProjectName(s.project).toLowerCase().includes(q)
      );
    }
    if (filterProject !== "all") {
      const pid = Number(filterProject);
      list = list.filter((s) => s.project === pid);
    }
    if (filterCompletion === "complete") {
      list = list.filter((s) => s.checklist_completion != null && s.checklist_completion >= 100);
    } else if (filterCompletion === "incomplete") {
      list = list.filter(
        (s) => s.checklist_completion != null && s.checklist_completion < 100 && (s.checklist_items_count ?? 0) > 0
      );
    } else if (filterCompletion === "none") {
      list = list.filter((s) => (s.checklist_items_count ?? 0) === 0);
    }
    return list;
  }, [siteList, searchQuery, filterProject, filterCompletion, projectList]);

  const totalSites = siteList.length;
  const completeCount = siteList.filter((s) => s.checklist_completion != null && s.checklist_completion >= 100).length;
  const incompleteCount = siteList.filter(
    (s) => s.checklist_completion != null && s.checklist_completion < 100 && (s.checklist_items_count ?? 0) > 0
  ).length;
  const noChecklistCount = siteList.filter((s) => (s.checklist_items_count ?? 0) === 0).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sites</h1>
          <p className="text-muted-foreground mt-1">Manage sites per project and their checklists</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            resetForm();
            setOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Site
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 bg-white/90 backdrop-blur-sm border border-blue-200/50 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Total sites</p>
              <p className="text-2xl font-bold text-gray-900">{totalSites}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Checklist complete</p>
              <p className="text-2xl font-bold text-gray-900">{completeCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-white/90 backdrop-blur-sm border border-amber-200/50 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Incomplete</p>
              <p className="text-2xl font-bold text-gray-900">{incompleteCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">No checklist</p>
              <p className="text-2xl font-bold text-gray-900">{noChecklistCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200/80">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-gray-700">Filters</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, link, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projectList.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCompletion} onValueChange={(v) => setFilterCompletion(v as CompletionFilter)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Checklist status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sites</SelectItem>
              <SelectItem value="complete">Checklist complete (100%)</SelectItem>
              <SelectItem value="incomplete">Checklist incomplete</SelectItem>
              <SelectItem value="none">No checklist</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || filterProject !== "all" || filterCompletion !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setFilterProject("all");
                setFilterCompletion("all");
              }}
            >
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Showing {filteredSites.length} of {siteList.length} sites
        </p>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-md">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="hidden md:table-cell">Link</TableHead>
                <TableHead className="hidden lg:table-cell">Launch</TableHead>
                <TableHead className="whitespace-nowrap">Checklist</TableHead>
                <TableHead className="whitespace-nowrap">Completion</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <span className="font-medium text-gray-900">{s.name}</span>
                      {s.link && (
                        <span className="block text-xs text-muted-foreground mt-0.5 md:hidden truncate max-w-[180px]">
                          {getDomainFromLink(s.link) || s.link}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{getProjectName(s.project)}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground hidden md:table-cell">
                    {s.link ? (
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline truncate block">
                        {getDomainFromLink(s.link) || s.link}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">{s.launch_date || "—"}</TableCell>
                  <TableCell>
                    {s.checklist_items_count != null ? (
                      <span className="text-sm font-medium">{s.checklist_items_count} items</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
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
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChecklistPopupSite({ id: s.id, name: s.name })}
                        className="shrink-0"
                      >
                        <ClipboardList className="w-4 h-4 mr-1" /> Checklist
                      </Button>
                      <Link to={`/admin/sites/${s.id}/checklist`} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        <Button variant="ghost" size="sm" className="h-8">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => openEdit(s)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive" onClick={() => setDeleteId(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && filteredSites.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {siteList.length === 0 ? "No sites yet. Add a site to get started." : "No sites match the current filters."}
          </div>
        )}
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
              <Input type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} />
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

      <AdminChecklistPopup
        siteId={checklistPopupSite?.id ?? null}
        siteName={checklistPopupSite?.name ?? ""}
        open={!!checklistPopupSite}
        onOpenChange={(open) => !open && setChecklistPopupSite(null)}
      />
    </div>
  );
}
