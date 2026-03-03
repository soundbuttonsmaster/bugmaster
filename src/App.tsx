import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import Sites from "./pages/admin/Sites";
import SiteChecklist from "./pages/admin/SiteChecklist";
import SiteChecklistPrint from "./pages/admin/SiteChecklistPrint";
import ChecklistTemplates from "./pages/admin/ChecklistTemplates";
import Settings from "./pages/admin/Settings";
import BugReports from "./pages/admin/BugReports";

import UserLayout from "./pages/user/UserLayout";
import UserProjects from "./pages/user/UserProjects";
import ProjectSites from "./pages/user/ProjectSites";
import UserSites from "./pages/user/UserSites";
import ReportBug from "./pages/user/ReportBug";
import MyBugReports from "./pages/user/MyBugReports";
import UserProfile from "./pages/user/UserProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
    mutations: { retry: 0 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} />

              <Route
                path="/admin/sites/:id/checklist/print"
                element={
                  <ProtectedRoute requireAdmin>
                    <SiteChecklistPrint />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="sites" element={<Sites />} />
                <Route path="sites/:id/checklist" element={<SiteChecklist />} />
                <Route path="checklist-templates" element={<ChecklistTemplates />} />
                <Route path="settings" element={<Settings />} />
                <Route path="bug-reports" element={<BugReports />} />
              </Route>

              <Route
                path="/user"
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<UserProjects />} />
                <Route path="projects/:id" element={<ProjectSites />} />
                <Route path="sites" element={<UserSites />} />
                <Route path="sites/:id/report-bug" element={<ReportBug />} />
                <Route path="bug-reports" element={<MyBugReports />} />
                <Route path="profile" element={<UserProfile />} />
              </Route>

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
