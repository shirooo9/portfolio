import { isAdmin } from "@/lib/auth";
import { portfolioStore } from "@/lib/portfolio-store";
import AdminClient from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdmin();
  const data = authenticated ? await portfolioStore.read() : null;
  return <AdminClient initialData={data} />;
}
