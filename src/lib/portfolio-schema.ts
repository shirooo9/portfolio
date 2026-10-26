import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const url = z.string().url().max(2048).optional();
const date = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const id = z.string().uuid();

export const ProfileSchema = z.object({
  name: text(120), headline: text(180), bio: text(3000), email: z.string().email().max(320).optional(),
  location: optionalText(180), githubUrl: url, linkedInUrl: url, websiteUrl: url, resumeUrl: url,
  availability: z.enum(["available", "open_to_opportunities", "not_available", "custom"]),
  availabilityLabel: optionalText(120), showContact: z.boolean().optional(),
}).strict();

const list = (max: number, itemMax = 200) => z.array(text(itemMax)).max(max);
export const ExperienceSchema = z.object({ id, role: text(180), company: text(180), employmentType: z.enum(["full-time", "part-time", "internship", "contract", "freelance", "other"]).optional(), location: optionalText(180), startDate: date, endDate: date.nullable().optional(), current: z.boolean(), summary: z.string().max(3000).optional(), highlights: list(30), technologies: list(40), order: z.number().int().min(0) }).strict().superRefine((v, ctx) => { if (v.current && v.endDate) ctx.addIssue({ code: "custom", path: ["endDate"], message: "Current experience cannot have an end date" }); if (v.endDate && v.endDate < v.startDate) ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must not precede start date" }); });
export const EducationSchema = z.object({ id, institution: text(180), degree: text(180), fieldOfStudy: optionalText(180), type: z.enum(["education", "certification", "other"]), location: optionalText(180), startDate: date.optional(), endDate: date.optional(), grade: optionalText(80), achievements: list(30), order: z.number().int().min(0) }).strict();
const architectureItem = z.object({ name: text(120), description: text(1000) }).strict();
const flowItem = z.object({ title: text(120), description: text(1000) }).strict();
export const ProjectSchema = z.object({ id, title: text(180), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180), tagline: text(300), description: text(10000), category: optionalText(120), status: z.enum(["completed", "in_progress", "archived"]), role: optionalText(180), startDate: date.optional(), endDate: date.optional(), featured: z.boolean(), coverImageUrl: url, repositoryUrl: url, liveUrl: url, technologies: list(40), highlights: list(30), architectureOverview: z.string().max(5000).optional(), architectureComponents: z.array(architectureItem).max(50), architectureFlow: z.array(flowItem).max(50), order: z.number().int().min(0) }).strict();
export const SkillSchema = z.object({ id, name: text(120), category: text(120), level: optionalText(80), visible: z.boolean(), order: z.number().int().min(0) }).strict();
export const PortfolioDBSchema = z.object({ schemaVersion: z.literal(1), updatedAt: z.string().datetime(), profile: ProfileSchema, experiences: z.array(ExperienceSchema).max(200), education: z.array(EducationSchema).max(200), projects: z.array(ProjectSchema).max(200), skills: z.array(SkillSchema).max(300) }).strict().superRefine((db, ctx) => { const ids = [...db.experiences, ...db.education, ...db.projects, ...db.skills].map((x) => x.id); if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "Record IDs must be unique" }); if (new Set(db.projects.map((x) => x.slug)).size !== db.projects.length) ctx.addIssue({ code: "custom", message: "Project slugs must be unique" }); });
export type PortfolioDB = z.infer<typeof PortfolioDBSchema>;
export type Collection = "experiences" | "education" | "projects" | "skills";
export type CollectionItem = PortfolioDB[Collection][number];
