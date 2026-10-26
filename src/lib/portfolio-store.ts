import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import seed from "../data/portfolio-db.seed.json";
import { Collection, CollectionItem, PortfolioDB, PortfolioDBSchema } from "./portfolio-schema";

const locks = new Map<string, Promise<unknown>>();
const queue = <T>(path: string, operation: () => Promise<T>) => { const previous = locks.get(path) ?? Promise.resolve(); const next = previous.catch(() => undefined).then(operation); locks.set(path, next.finally(() => { if (locks.get(path) === next) locks.delete(path); })); return next; };

export function createPortfolioStore(filePath = process.env.PORTFOLIO_DB_PATH ?? "./data/portfolio-db.json") {
  const path = resolve(filePath);
  const backupDir = join(dirname(path), "backups");
  async function parse(raw: string) { let value: unknown; try { value = JSON.parse(raw); } catch { throw new Error("Portfolio database contains invalid JSON"); } const result = PortfolioDBSchema.safeParse(value); if (!result.success) throw new Error("Portfolio database failed schema validation"); return result.data; }
  async function read(): Promise<PortfolioDB> { try { return await parse(await readFile(path, "utf8")); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; await mkdir(dirname(path), { recursive: true }); const initial = PortfolioDBSchema.parse(seed); await atomicWrite(initial); return initial; } }
  async function atomicWrite(data: PortfolioDB) { await mkdir(dirname(path), { recursive: true }); const temp = `${path}.${process.pid}.${randomUUID()}.tmp`; await writeFile(temp, JSON.stringify(data, null, 2) + "\n", { encoding: "utf8", mode: 0o600 }); await rename(temp, path); }
  async function write(data: PortfolioDB) { return queue(path, async () => { const valid = PortfolioDBSchema.parse({ ...data, updatedAt: new Date().toISOString() }); await atomicWrite(valid); return valid; }); }
  async function update(mutator: (current: PortfolioDB) => PortfolioDB) { return queue(path, async () => { const current = await read(); const valid = PortfolioDBSchema.parse({ ...mutator(current), updatedAt: new Date().toISOString() }); await atomicWrite(valid); return valid; }); }
  async function create<C extends Collection>(collection: C, input: Omit<PortfolioDB[C][number], "id">) { const item = { ...input, id: randomUUID() } as PortfolioDB[C][number]; return update((db) => ({ ...db, [collection]: [...db[collection], item] })); }
  async function remove(collection: Collection, itemId: string) { return update((db) => ({ ...db, [collection]: db[collection].filter((item) => item.id !== itemId) })); }
  async function replace(collection: Collection, itemId: string, input: CollectionItem) { return update((db) => ({ ...db, [collection]: db[collection].map((item) => item.id === itemId ? input : item) })); }
  async function backup(data: PortfolioDB) { await mkdir(backupDir, { recursive: true }); const filename = `portfolio-backup-${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}-${randomUUID()}.json`; await writeFile(join(backupDir, filename), JSON.stringify(data, null, 2) + "\n", { mode: 0o600 }); const retention = Math.max(1, Number(process.env.PORTFOLIO_BACKUP_RETENTION ?? 30)); const backups = (await readdir(backupDir)).filter((name) => name.endsWith(".json")).sort().reverse(); await Promise.all(backups.slice(retention).map((name) => unlink(join(backupDir, name)))); return filename; }
  async function restore(input: unknown) { const valid = PortfolioDBSchema.safeParse(input); if (!valid.success) throw new Error("Import data failed schema validation"); return queue(path, async () => { const current = await read(); await backup(current); const next = { ...valid.data, updatedAt: new Date().toISOString() }; await atomicWrite(next); return next; }); }
  async function listBackups() { try { return (await readdir(backupDir)).filter((name) => name.endsWith(".json")); } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; } }
  return { read, update, create, remove, replace, restore, listBackups, export: read };
}
export const portfolioStore = createPortfolioStore();
