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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { User, Role } from "@/lib/types";
import type { PaginatedResponse } from "@/lib/types";

export default function Users() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [assignRoleUserId, setAssignRoleUserId] = useState<number | null>(null);
  const [assignRoleId, setAssignRoleId] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: usersData } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get<PaginatedResponse<User>>("/admin/users"),
  });
  const { data: roles = [] } = useQuery({
    queryKey: ["admin", "roles"],
    queryFn: () => api.get<Role[]>("/admin/roles"),
  });

  const users = usersData?.results ?? [];
  const roleList = Array.isArray(roles) ? roles : [];

  const createMut = useMutation({
    mutationFn: () =>
      api.post("/admin/users", {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        confirm_password: confirmPassword,
        role_id: roleId ? Number(roleId) : undefined,
      }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "users"] });
      setOpen(false);
      resetForm();
      toast({ title: "User created" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: () =>
      api.post(`/admin/users/${editing!.id}`, {
        first_name: firstName,
        last_name: lastName,
        is_active: isActive,
      }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "users"] });
      setEditing(null);
      setOpen(false);
      resetForm();
      toast({ title: "User updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const assignRoleMut = useMutation({
    mutationFn: (userId: number) =>
      api.post(`/admin/users/${userId}/assign-role`, { role_id: Number(assignRoleId) }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "users"] });
      setAssignRoleUserId(null);
      setAssignRoleId("");
      toast({ title: "Role assigned" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["admin", "users"] });
      setDeleteId(null);
      toast({ title: "User deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRoleId("");
    setIsActive(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setFirstName(u.first_name);
    setLastName(u.last_name);
    setIsActive(u.is_active);
    setOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage users</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            resetForm();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.full_name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.profile?.role?.name ?? "—"}</TableCell>
                <TableCell>{u.is_active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setAssignRoleUserId(u.id); setAssignRoleId(String(u.profile?.role?.id ?? "")); }}>
                      Assign Role
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(u.id)}>
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
            <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            {!editing && (
              <>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role (optional)</Label>
                  <Select value={roleId} onValueChange={setRoleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleList.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
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
              onClick={() => (editing ? updateMut.mutate() : createMut.mutate())}
              disabled={
                (editing ? !firstName.trim() : !email.trim() || !password || password !== confirmPassword) ||
                createMut.isPending ||
                updateMut.isPending
              }
            >
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assignRoleUserId} onOpenChange={() => setAssignRoleUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={assignRoleId} onValueChange={setAssignRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleList.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignRoleUserId(null)}>Cancel</Button>
            <Button
              onClick={() => assignRoleUserId && assignRoleMut.mutate(assignRoleUserId)}
              disabled={!assignRoleId || assignRoleMut.isPending}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
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
