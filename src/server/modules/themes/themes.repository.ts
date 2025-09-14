import { db } from "@/server/db";
import { themes } from "@/server/db/schema/main.schema";
import { and, eq, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { CreateThemeInput, UpdateThemeInput } from "./themes.schemas";

export class ThemesRepository {
  async list(userId?: string) {
    const whereCondition = userId
      ? or(eq(themes.isSystem, true), eq(themes.createdBy, userId))
      : eq(themes.isSystem, true);

    const rows = await db
      .select({
        id: themes.id,
        name: themes.name,
        description: themes.description,
        config: themes.config,
        isSystem: themes.isSystem,
        createdAt: themes.createdAt,
        // Note: exclude updatedAt/createdBy from list response to match schema
      })
      .from(themes)
      .where(whereCondition);

    return rows.map((t) => {
      const rawCfg = (t.config ?? {}) as Record<string, unknown>;
      const config: Record<string, string> = Object.fromEntries(
        Object.entries(rawCfg).map(([k, v]) => [k, String(v)]),
      );
      return {
        id: t.id,
        name: t.name,
        description: t.description ?? null,
        config,
        isSystem: Boolean((t as unknown as { isSystem: unknown }).isSystem),
        createdAt: new Date(t.createdAt as unknown as string | number | Date),
      };
    });
  }

  async getById(themeId: string) {
    const [t] = await db
      .select()
      .from(themes)
      .where(eq(themes.id, themeId))
      .limit(1);

    if (!t) return null;

    const rawCfg = (t.config ?? {}) as Record<string, unknown>;
    const config: Record<string, string> = Object.fromEntries(
      Object.entries(rawCfg).map(([k, v]) => [k, String(v)]),
    );
    return {
      id: t.id,
      userId: t.createdBy ?? null,
      name: t.name,
      description: t.description ?? null,
      config,
      isSystem: Boolean(t.isSystem),
      createdAt: new Date(t.createdAt as unknown as string | number | Date),
      updatedAt: new Date(t.updatedAt as unknown as string | number | Date),
    };
  }

  async create(userId: string, input: CreateThemeInput) {
    const now = new Date();
    const [row] = await db
      .insert(themes)
      .values({
        id: nanoid(),
        name: input.name,
        description: input.description ?? null,
        createdBy: userId,
        config: input.config,
        isSystem: false,
        status: "active",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const rawCfg = (row.config ?? {}) as Record<string, unknown>;
    const config: Record<string, string> = Object.fromEntries(
      Object.entries(rawCfg).map(([k, v]) => [k, String(v)]),
    );
    return {
      id: row.id,
      userId: row.createdBy ?? null,
      name: row.name,
      description: row.description ?? null,
      config,
      createdAt: new Date(row.createdAt as unknown as string | number | Date),
      updatedAt: new Date(row.updatedAt as unknown as string | number | Date),
    };
  }

  async update(themeId: string, userId: string, data: UpdateThemeInput) {
    // ownership
    const [existing] = await db
      .select({ id: themes.id })
      .from(themes)
      .where(and(eq(themes.id, themeId), eq(themes.createdBy, userId)))
      .limit(1);
    if (!existing) throw new Error("Theme not found");

    const [row] = await db
      .update(themes)
      .set({
        name: data.name,
        description: data.description ?? null,
        config: data.config as unknown as object | undefined,
        updatedAt: new Date(),
      })
      .where(eq(themes.id, themeId))
      .returning();

    const rawCfg2 = (row.config ?? {}) as Record<string, unknown>;
    const config2: Record<string, string> = Object.fromEntries(
      Object.entries(rawCfg2).map(([k, v]) => [k, String(v)]),
    );
    return {
      id: row.id,
      userId: row.createdBy ?? null,
      name: row.name,
      description: row.description ?? null,
      config: config2,
      createdAt: new Date(row.createdAt as unknown as string | number | Date),
      updatedAt: new Date(row.updatedAt as unknown as string | number | Date),
    };
  }

  async delete(themeId: string, userId: string) {
    // ownership
    const [existing] = await db
      .select({ id: themes.id })
      .from(themes)
      .where(and(eq(themes.id, themeId), eq(themes.createdBy, userId)))
      .limit(1);
    if (!existing) throw new Error("Theme not found");

    await db.delete(themes).where(eq(themes.id, themeId));
    return true;
  }
}

export const themesRepository = new ThemesRepository();
