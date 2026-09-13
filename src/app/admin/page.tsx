import { AdminDashboard } from "@/components/admin/AdminDashboard";

// Access is enforced by src/proxy.ts (redirects to /admin/login without a valid session).
export default function AdminPage() {
  return <AdminDashboard />;
}
