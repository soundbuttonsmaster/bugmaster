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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Role, Permission } from "@/lib/types";

export default function Roles() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissionIds, setPermissionIds] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: roles = [] } = useQuery({
    queryKey: ["admin", "roles"],
    queryFn: () => api.get<Role[]>("/admin/roles"),
  });
  const { data: permissions = [] } = useQuery({
    queryKey: ["admin", "permissions"],
    queryFn: () => api.get<Permission[]>("/admin/permissions"),
  });

  const createMut = useMutation({
    mutationFn: () =>
      api.post("/admin/roles", {
        name,
        description: description || undefined,
        permission_ids: permissionIds.length ? permissionIds : undefined,
      }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "roles"] });
      setOpen(false);
      resetForm();
      toast({ title: "Role created" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: () =>
      api.post(`/admin/roles/${editing!.id}`, {
        name,
        description: description || undefined,
        permission_ids: permissionIds,
      }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "roles"] });
      setEditing(null);
      setOpen(false);
      resetForm();
      toast({ title: "Role updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/roles/${id}`),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "roles"] });
      setDeleteId(null);
      toast({ title: "Role deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setPermissionIds([]);
  };

  const openEdit = (r: Role) => {
    setEditing(r);
    setName(r.name);
    setDescription(r.description || "");
    setPermissionIds(r.permissions?.map((p) => p.id) ?? []);
    setOpen(true);
  };

  const togglePermission = (id: number) => {
    setPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const roleList = Array.isArray(roles) ? roles : [];
  const permList = Array.isArray(permissions) ? permissions : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground">Manage roles and permissions</p>
        </div>
        <Button onClick={() => { setEditing(null); resetForm(); setOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Role
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User Count</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roleList.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.description || "—"}</TableCell>
                <TableCell>{r.user_count ?? 0}</TableCell>
                <TableCell className="max-w-[300px]">
                  <span className="text-sm text-muted-foreground">
                    {r.permissions?.map((p) => p.name).join(", ") || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Role" : "Add Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Role name" />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                {permList.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissionIds.includes(p.id)}
                      onChange={() => togglePermission(p.id)}
                    />
                    <span className="text-sm">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => (editing ? updateMut.mutate() : createMut.mutate())}
              disabled={!name.trim() || createMut.isPending || updateMut.isPending}
            >
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
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
