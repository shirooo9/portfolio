import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createPortfolioStore } from "../src/lib/portfolio-store";

test("seeds missing runtime data and CRUD persists", async () => {
  const dir = await mkdtemp(join(tmpdir(), "portfolio-test-"));
  const store = createPortfolioStore(join(dir, "db.json"));
  const initial = await store.read();
  assert.equal(initial.schemaVersion, 1);
  await store.create("skills", { name: "TypeScript", category: "Frontend", visible: true, order: 0 });
  const created = (await store.read()).skills[0];
  assert.match(created.id, /^[0-9a-f-]{36}$/);
  assert.equal((await store.read()).skills.length, 1);
});

test("CRUD persists across all collections and a fresh store instance", async () => {
  const dir = await mkdtemp(join(tmpdir(), "portfolio-test-"));
  const path = join(dir, "db.json");
  const store = createPortfolioStore(path);
  await store.read();
  const experience = await store.create("experiences", { role: "Engineer", company: "Test Co", employmentType: "full-time", startDate: "2024-01", endDate: "2024-02", current: false, highlights: [], technologies: [], order: 0 });
  const education = await store.create("education", { institution: "Test University", degree: "Engineering", type: "education", achievements: [], order: 0 });
  const project = await store.create("projects", { title: "Test Project", slug: "test-project", tagline: "Test", description: "Test project", status: "completed", featured: false, technologies: [], highlights: [], architectureComponents: [], architectureFlow: [], order: 0 });
  const skill = await store.create("skills", { name: "Testing", category: "Quality", visible: true, order: 0 });
  const created = await store.read();
  assert.equal(created.experiences.length, 1);
  assert.equal(created.education.length, 1);
  assert.equal(created.projects.length, 1);
  assert.equal(created.skills.length, 1);
  await store.replace("projects", project.projects[0].id, { ...project.projects[0], title: "Updated Project" });
  await store.remove("experiences", experience.experiences[0].id);
  await store.remove("education", education.education[0].id);
  await store.remove("projects", project.projects[0].id);
  await store.remove("skills", skill.skills[0].id);
  const restarted = createPortfolioStore(path);
  const persisted = await restarted.read();
  assert.deepEqual(persisted.experiences, []);
  assert.deepEqual(persisted.education, []);
  assert.deepEqual(persisted.projects, []);
  assert.deepEqual(persisted.skills, []);
});

test("does not overwrite corrupt JSON", async () => {
  const dir = await mkdtemp(join(tmpdir(), "portfolio-test-"));
  const path = join(dir, "db.json");
  await writeFile(path, "{broken", "utf8");
  const store = createPortfolioStore(path);
  await assert.rejects(store.read(), /invalid/i);
  assert.equal(await readFile(path, "utf8"), "{broken");
});

test("backup retention keeps only the configured number of backups", async () => {
  const dir = await mkdtemp(join(tmpdir(), "portfolio-test-"));
  const store = createPortfolioStore(join(dir, "db.json"));
  await store.read();
  process.env.PORTFOLIO_BACKUP_RETENTION = "2";
  for (let i = 0; i < 3; i += 1) await store.restore({ ...(await store.read()), profile: { ...(await store.read()).profile, name: `Restore ${i}` } });
  assert.equal((await store.listBackups()).length, 2);
  delete process.env.PORTFOLIO_BACKUP_RETENTION;
});

test("restore validates before replacing and creates backup", async () => {
  const dir = await mkdtemp(join(tmpdir(), "portfolio-test-"));
  const path = join(dir, "db.json");
  const store = createPortfolioStore(path);
  await store.read();
  const next = await store.restore({ ...(await store.read()), profile: { ...(await store.read()).profile, name: "Restored" } });
  assert.equal(next.profile.name, "Restored");
  assert.equal((await store.listBackups()).length, 1);
  await assert.rejects(store.restore({ bad: true }), /validation/i);
  assert.equal((await store.read()).profile.name, "Restored");
});
