import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ChecklistItem, Site } from "@/lib/types";

export default function SiteChecklistPrint() {
  const { id } = useParams<{ id: string }>();
  const printed = useRef(false);

  const { data: site } = useQuery({
    queryKey: ["admin", "sites", id],
    queryFn: () => api.get<Site>(`/admin/sites/${id}`),
    enabled: !!id,
  });

  const { data: checklist = [], isLoading } = useQuery({
    queryKey: ["admin", "sites", id, "checklist"],
    queryFn: () => api.get<ChecklistItem[]>(`/admin/sites/${id}/checklist`),
    enabled: !!id,
  });

  const list = Array.isArray(checklist) ? checklist : [];
  const activeItems = list.filter((i) => i.is_active);

  useEffect(() => {
    if (printed.current || !site || isLoading) return;
    const t = setTimeout(() => {
      printed.current = true;
      window.print();
    }, 400);
    return () => clearTimeout(t);
  }, [site, isLoading]);

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 print:p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 print:mb-4">
          Checklist: {site.name}
        </h1>
        <p className="text-sm text-gray-500 mb-6 print:mb-4">
          Generated {new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
        </p>
        <ol className="list-decimal list-inside space-y-4 print:space-y-3">
          {activeItems.length === 0 ? (
            <li className="text-gray-500">No active checklist items.</li>
          ) : (
            activeItems.map((item, index) => (
              <li key={item.id} className="text-gray-800">
                <span className="font-medium">{item.question}</span>
                <span className="ml-2 text-gray-600">
                  — {item.last_response != null ? item.last_response : "Unanswered"}
                </span>
              </li>
            ))
          )}
        </ol>
      </div>
    </div>
  );
}
