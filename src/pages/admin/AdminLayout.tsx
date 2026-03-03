import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Bug,
  FolderKanban,
  Globe,
  LogOut,
  Menu,
  X,
  UserCog,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const navItems = [
    { to: "/admin", icon: BarChart3, label: "Dashboard" },
    { to: "/admin/projects", icon: FolderKanban, label: "Projects" },
    { to: "/admin/sites", icon: Globe, label: "Sites" },
    { to: "/admin/checklist-templates", icon: ClipboardList, label: "Checklist Templates" },
    { to: "/admin/bug-reports", icon: Bug, label: "Bug Reports" },
    { to: "/admin/settings", icon: UserCog, label: "Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-theme min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200/50 shadow-lg"
      >
        {isSidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white/90 backdrop-blur-sm border-r border-blue-200/50 shadow-xl transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <Link to="/" className="text-2xl font-bold text-gray-800">
                  Team Bug
                </Link>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.to)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-blue-200/50">
            <Card className="w-full mb-3">
              <CardHeader>
                <CardTitle className="text-top-left text-xs font-bold text-gray-500">
                  Logged in as
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">{user?.email ?? "—"}</p>
                <p className="text-xs text-gray-500">{user?.full_name ?? user?.username ?? ""}</p>
              </CardContent>
            </Card>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-xl transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
