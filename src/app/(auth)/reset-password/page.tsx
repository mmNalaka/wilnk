"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import z from "zod/v4";
import { GalleryVerticalEnd } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token") || "";
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Invalid or missing token");
        return;
      }
      if (value.password !== value.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      await authClient.resetPassword(
        { newPassword: value.password, token },
        {
          onSuccess: () => {
            toast.success("Password reset successful. Please sign in.");
            router.push("/login");
          },
          onError: (error) => {
            toast.error(error.error.message || "Something went wrong");
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Confirm your password"),
      }),
    },
  });

  if (isPending) return <Loader />;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Wilnk
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <form.Field name="password">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>New Password</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.map((error) => (
                          <p key={error?.message} className="text-red-500">
                            {error?.message}
                          </p>
                        ))}
                      </div>
                    )}
                  </form.Field>
                </div>
                <div className="grid gap-3">
                  <form.Field name="confirmPassword">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Confirm Password</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.map((error) => (
                          <p key={error?.message} className="text-red-500">
                            {error?.message}
                          </p>
                        ))}
                      </div>
                    )}
                  </form.Field>
                </div>
                <form.Subscribe>
                  {(state) => (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!state.canSubmit || state.isSubmitting}
                    >
                      {state.isSubmitting ? "Submitting..." : "Reset Password"}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          Back to{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
