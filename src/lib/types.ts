export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  date_joined: string;
  profile: {
    is_admin: boolean;
    role: Role | null;
    created_at: string;
    updated_at: string;
  };
}

export interface Role {
  id: number;
  name: string;
  description: string;
  user_count?: number;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  codename: string;
  name: string;
  description: string;
  created_at?: string;
}

export interface Project {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: number;
  project: number;
  name: string;
  link: string;
  launch_date: string;
  created_at: string;
  updated_at: string;
  /** User's personal checklist completion % (user site APIs). Admin APIs: overall completion % across all users. null if no items or no responses. */
  checklist_completion?: number | null;
  /** Admin site APIs only: total active checklist items for this site */
  checklist_items_count?: number;
}

export interface BugReport {
  id: number;
  site: number;
  site_name: string;
  reporter_email: string;
  reporter_name: string;
  title: string;
  description: string;
  link: string | null;
  attachment: string | null;
  status: "pending" | "processing" | "resolved";
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ChecklistItem {
  id: number;
  site: number;
  question: string;
  is_active: boolean;
  /** "Yes" | "No" | null — latest response for this item. null if not yet answered. */
  last_response?: string | null;
  last_responded_by: string | null;
  last_responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserChecklistItem extends Omit<ChecklistItem, "last_responded_by" | "last_responded_at"> {
  my_response: boolean | null;
}

export interface ChecklistTemplate {
  id: number;
  question: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}
