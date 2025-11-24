import Nav from "@/components/nav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
