import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users as UsersIcon, Shield, Key, UserCog } from "lucide-react";
import UsersPage from "./Users";
import RolesPage from "./Roles";
import PermissionsPage from "./Permissions";
import AccountPage from "./Account";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage users, roles, permissions, and your account</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="w-full sm:w-auto flex flex-wrap h-auto gap-1 p-1 bg-muted/80">
          <TabsTrigger value="users" className="gap-2">
            <UsersIcon className="w-4 h-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" /> Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Key className="w-4 h-4" /> Permissions
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <UserCog className="w-4 h-4" /> Account
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          <UsersPage />
        </TabsContent>
        <TabsContent value="roles" className="mt-6">
          <RolesPage />
        </TabsContent>
        <TabsContent value="permissions" className="mt-6">
          <PermissionsPage />
        </TabsContent>
        <TabsContent value="account" className="mt-6">
          <AccountPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
