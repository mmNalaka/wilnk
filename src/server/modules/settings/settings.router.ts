import { z } from "zod";
import { protectedProcedure } from "@/server/lib/orpc";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth.schema";
import { eq } from "drizzle-orm";

const updateSettingsSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  analyticsEmails: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  defaultTheme: z.string().optional(),
  customDomain: z.string().optional(),
});

export const settingsRouter = {
  // Get user settings
  get: protectedProcedure
    .output(z.object({
      settings: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        bio: z.string().nullable(),
        avatar: z.string().nullable(),
        plan: z.enum(["free", "pro", "enterprise"]),
        emailNotifications: z.boolean(),
        analyticsEmails: z.boolean(),
        marketingEmails: z.boolean(),
        twoFactorEnabled: z.boolean(),
        defaultTheme: z.string().nullable(),
        customDomain: z.string().nullable(),
      })
    }))
    .handler(async ({ context }) => {
      const userId = context.session.user.id;

      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          bio: users.bio,
          avatar: users.avatar,
          plan: users.plan,
          emailNotifications: users.emailNotifications,
          analyticsEmails: users.analyticsEmails,
          marketingEmails: users.marketingEmails,
          twoFactorEnabled: users.twoFactorEnabled,
          defaultTheme: users.defaultTheme,
          customDomain: users.customDomain,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        throw new Error("User not found");
      }

      return { settings: user };
    }),

  // Update user settings
  update: protectedProcedure
    .input(updateSettingsSchema)
    .output(z.object({
      settings: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        bio: z.string().nullable(),
        avatar: z.string().nullable(),
        plan: z.enum(["free", "pro", "enterprise"]),
        emailNotifications: z.boolean(),
        analyticsEmails: z.boolean(),
        marketingEmails: z.boolean(),
        twoFactorEnabled: z.boolean(),
        defaultTheme: z.string().nullable(),
        customDomain: z.string().nullable(),
      })
    }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Verify user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!existingUser) {
        throw new Error("User not found");
      }

      const [updatedUser] = await db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      return { settings: updatedUser };
    }),

  // Delete user account
  deleteAccount: protectedProcedure
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ context }) => {
      const userId = context.session.user.id;

      // Verify user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!existingUser) {
        throw new Error("User not found");
      }

      // TODO: In a real implementation, you would:
      // 1. Delete all user's pages
      // 2. Delete all analytics data
      // 3. Delete all themes created by user
      // 4. Cancel subscriptions
      // 5. Clean up any uploaded files
      // 6. Send confirmation email
      
      await db.delete(users).where(eq(users.id, userId));

      return { success: true };
    }),
};
