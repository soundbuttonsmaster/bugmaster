import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FILE_BASE_URL } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bug,
  FileText,
  Globe,
  Calendar,
  ExternalLink,
  Paperclip,
  BarChart3,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { BugReport } from "@/lib/types";

function statusConfig(status: string) {
  switch (status) {
    case "resolved":
      return {
        label: "Resolved",
        icon: CheckCircle2,
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        iconClassName: "text-emerald-600",
      };
    case "processing":
      return {
        label: "In progress",
        icon: Loader2,
        className: "bg-blue-100 text-blue-800 border-blue-200",
        iconClassName: "text-blue-600",
      };
    default:
      return {
        label: "Pending",
        icon: AlertCircle,
        className: "bg-amber-100 text-amber-800 border-amber-200",
        iconClassName: "text-amber-600",
      };
  }
}

export default function MyBugReports() {
  const { data: bugReports = [], isLoading } = useQuery({
    queryKey: ["user", "my-bug-reports"],
    queryFn: () => api.get<BugReport[]>("/user/my-bug-reports"),
  });

  const list = Array.isArray(bugReports) ? bugReports : [];

  const pendingCount = list.filter((b) => b.status === "pending").length;
  const processingCount = list.filter((b) => b.status === "processing").length;
  const resolvedCount = list.filter((b) => b.status === "resolved").length;

  const stats = [
    {
      title: "Total reports",
      value: list.length,
      subtitle: "All your submissions",
      icon: Bug,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
      borderColor: "border-violet-200/50",
    },
    {
      title: "Pending",
      value: pendingCount,
      subtitle: "Awaiting review",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-200/50",
    },
    {
      title: "In progress",
      value: processingCount,
      subtitle: "Being worked on",
      icon: Loader2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200/50",
    },
    {
      title: "Resolved",
      value: resolvedCount,
      subtitle: "Fixed",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-200/50",
    },
  ];

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Bug Reports</h1>
        <p className="text-muted-foreground mt-1">
          Track status of your submitted bug reports. All details in one place.
        </p>
      </div>

      {/* Stats row - dashboard style */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className={`p-5 bg-white/90 backdrop-blur-sm border ${stat.borderColor} shadow-md hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-0.5">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Report cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <Card className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
          <Bug className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold text-gray-700">No bug reports yet</p>
          <p className="text-sm text-gray-500 mt-1">Reports you submit will appear here</p>
          <Link to="/user/sites">
            <Button className="mt-4">Go to Sites</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-5">
          {list.map((b) => {
            const status = statusConfig(b.status);
            const StatusIcon = status.icon;
            return (
              <Card
                key={b.id}
                className="overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header: title + status */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 leading-tight pr-4">{b.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border ${status.className}`}
                    >
                      <StatusIcon
                        className={`w-4 h-4 ${status.iconClassName} ${b.status === "processing" ? "animate-spin" : ""}`}
                      />
                      {status.label}
                    </span>
                  </div>

                  {/* Description - full text visible */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      <FileText className="w-3.5 h-3.5" /> Description
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap rounded-lg bg-gray-50/80 px-3 py-2.5 border border-gray-100">
                      {b.description || "—"}
                    </p>
                  </div>

                  {/* Meta grid: site, dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>
                        <strong className="text-gray-500">Site:</strong> {b.site_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>
                        <strong className="text-gray-500">Submitted:</strong> {formatDateTime(b.created_at)}
                      </span>
                    </div>
                    {b.updated_at && b.updated_at !== b.created_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
                        <BarChart3 className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>
                          <strong className="text-gray-500">Last updated:</strong> {formatDateTime(b.updated_at)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Links & attachment */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    {b.link && (
                      <a
                        href={b.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open link
                      </a>
                    )}
                    {b.attachment && (
                      <a
                        href={`${FILE_BASE_URL}${b.attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline"
                      >
                        <Paperclip className="w-4 h-4" />
                        View attachment
                      </a>
                    )}
                    {!b.link && !b.attachment && (
                      <span className="text-sm text-gray-400">No link or attachment</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
