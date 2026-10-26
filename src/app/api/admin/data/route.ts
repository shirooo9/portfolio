import "server-only";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { portfolioStore } from "@/lib/portfolio-store";
import { PortfolioDBSchema, type Collection } from "@/lib/portfolio-schema";
import { sameOrigin } from "@/lib/request-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const collections = ["experiences", "education", "projects", "skills"] as const;
function isCollection(value: unknown): value is Collection { return typeof value === "string" && collections.includes(value as Collection); }
function unauthorized() { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
function badRequest(message = "Invalid portfolio data") { return NextResponse.json({ error: message }, { status: 400 }); }

export async function GET() { if (!(await isAdmin())) return unauthorized(); try { return NextResponse.json(await portfolioStore.read(), { headers: { "Cache-Control": "no-store" } }); } catch { return NextResponse.json({ error: "Portfolio data could not be read" }, { status: 500 }); } }
export async function PUT(request: Request) { if (!(await isAdmin()) || !sameOrigin(request)) return unauthorized(); try { return NextResponse.json(await portfolioStore.restore(await request.json())); } catch { return badRequest("Import data failed validation or could not be saved"); } }
export async function POST(request: Request) { if (!(await isAdmin()) || !sameOrigin(request)) return unauthorized(); try { const body = await request.json() as { collection?: unknown; item?: unknown }; if (!isCollection(body.collection) || typeof body.item !== "object" || body.item === null) return badRequest(); return NextResponse.json(await portfolioStore.create(body.collection, body.item as never)); } catch { return badRequest(); } }
export async function PATCH(request: Request) { if (!(await isAdmin()) || !sameOrigin(request)) return unauthorized(); try { const body = await request.json() as { profile?: unknown; collection?: unknown; id?: unknown; item?: unknown }; if (body.profile !== undefined) { PortfolioDBSchema.shape.profile.parse(body.profile); return NextResponse.json(await portfolioStore.update((db) => ({ ...db, profile: body.profile as typeof db.profile }))); } if (!isCollection(body.collection) || typeof body.id !== "string" || typeof body.item !== "object" || body.item === null) return badRequest(); return NextResponse.json(await portfolioStore.replace(body.collection, body.id, { ...(body.item as object), id: body.id } as never)); } catch { return badRequest(); } }
export async function DELETE(request: Request) { if (!(await isAdmin()) || !sameOrigin(request)) return unauthorized(); try { const body = await request.json() as { collection?: unknown; id?: unknown }; if (!isCollection(body.collection) || typeof body.id !== "string") return badRequest(); return NextResponse.json(await portfolioStore.remove(body.collection, body.id)); } catch { return badRequest(); } }
