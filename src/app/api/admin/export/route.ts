import "server-only";
import { isAdmin } from "@/lib/auth";
import { portfolioStore } from "@/lib/portfolio-store";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const data = await portfolioStore.export();
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return new Response(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="portfolio-backup-${stamp}.json"`, "Cache-Control": "no-store" } });
}
