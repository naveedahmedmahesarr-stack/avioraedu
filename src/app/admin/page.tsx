import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { usingBlob } from "@/lib/content/store";

// Access is enforced by src/proxy.ts (redirects to /admin/login without a valid session).
export default function AdminPage() {
  return <AdminDashboard storage={usingBlob() ? "blob" : "disk"} />;
}
