import { SidebarProvider } from "@components/ui/sidebar";

export default function Home({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
