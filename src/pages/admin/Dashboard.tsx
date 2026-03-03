import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, FolderKanban, Globe, ArrowRight, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import type { BugReport, Project, Site } from "@/lib/types";
import { normalizeArray } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: bugReports } = useQuery({
    queryKey: ["admin", "bug-reports"],
    queryFn: () => api.get<BugReport[]>("/admin/bug-reports"),
    retry: false,
  });

  const { data: projects } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => api.get<Project[]>("/admin/projects"),
    retry: false,
  });

  const { data: sites } = useQuery({
    queryKey: ["admin", "sites"],
    queryFn: () => api.get<Site[]>("/admin/sites"),
    retry: false,
  });

  const bugs = normalizeArray(bugReports);
  const projectList = normalizeArray(projects);
  const siteList = normalizeArray(sites);

  const pendingBugs = bugs.filter((b) => b.status === "pending").length;
  const processingBugs = bugs.filter((b) => b.status === "processing").length;
  const resolvedBugs = bugs.filter((b) => b.status === "resolved").length;

  const stats = [
    { title: "Projects", value: projectList.length, subtitle: "Total projects", icon: FolderKanban, color: "text-blue-500", bgColor: "bg-blue-100" },
    { title: "Sites", value: siteList.length, subtitle: "Total sites", icon: Globe, color: "text-green-500", bgColor: "bg-green-100" },
    { title: "Pending Bugs", value: pendingBugs, subtitle: "Awaiting review", icon: Bug, color: "text-amber-500", bgColor: "bg-amber-100" },
    { title: "Resolved", value: resolvedBugs, subtitle: "Fixed bugs", icon: BarChart3, color: "text-indigo-500", bgColor: "bg-indigo-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.first_name || user?.username}! Overview of your team bug reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center shadow-lg`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/admin/projects">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Projects</h3>
                <p className="text-sm text-gray-600">Manage your projects</p>
              </div>
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
              Manage Projects <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link to="/admin/sites">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Sites</h3>
                <p className="text-sm text-gray-600">Manage sites per project</p>
              </div>
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
              Manage Sites <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link to="/admin/bug-reports">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Bug Reports</h3>
                <p className="text-sm text-gray-600">View and manage bug reports</p>
              </div>
            </div>
            <div className="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
              View Reports <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Recent Bug Reports</h2>
            <p className="text-gray-600">Latest submitted bug reports</p>
          </div>
          <Link to="/admin/bug-reports">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {bugs.length > 0 ? (
            bugs.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.site_name} • {item.reporter_name}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    item.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : item.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Bug className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No bug reports yet</p>
              <p className="text-sm">Bug reports will appear here</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
