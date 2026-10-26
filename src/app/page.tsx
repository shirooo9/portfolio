import { portfolioStore } from "@/lib/portfolio-store";
import PublicPortfolio from "@/components/public-portfolio";
import "./public.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let data;
  try { data = await portfolioStore.read(); } catch {
    return <main className="public-error"><p className="mono">PORTFOLIO / DATA ERROR</p><h1>Portfolio data is unavailable.</h1><p>Check the server data configuration and try again.</p></main>;
  }
  return <PublicPortfolio data={data} />;
}
