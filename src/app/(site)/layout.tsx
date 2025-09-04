import { HeroHeader } from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
