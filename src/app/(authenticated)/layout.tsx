import { MainNav } from "@/components/navigation/main-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <MainNav />
      </header>
      <main className="flex-1 px-4">{children}</main>
    </div>
  );
}
