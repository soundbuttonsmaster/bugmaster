import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bug, Globe, FolderKanban, LogOut, Menu, X, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const navItems = [
    { to: "/user", icon: FolderKanban, label: "Projects" },
    { to: "/user/sites", icon: Globe, label: "Sites" },
    { to: "/user/bug-reports", icon: Bug, label: "My Bug Reports" },
    { to: "/user/profile", icon: UserIcon, label: "Profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/user") return location.pathname === "/user";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-50 flex">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/95 backdrop-blur-sm border border-blue-200/60 shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-md border-r border-blue-200/50 shadow-xl transform transition-transform duration-300 ease-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-blue-100/80">
            <Link to="/user" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">Team Bug</span>
                <p className="text-xs text-gray-500 font-medium">User Portal</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <p className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
            <div className="space-y-1">
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
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-blue-100/80">
            <p className="text-sm text-gray-500 mb-2 truncate px-2" title={user?.email}>{user?.email}</p>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden
        />
      )}

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 lg:p-8">
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-violet-500/10 border border-blue-200/50 px-5 py-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome back, <span className="text-blue-700">{user?.first_name || user?.username || "there"}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Manage your projects, complete checklists, and track bug reports.</p>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
