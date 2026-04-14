'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Car,
  LayoutDashboard,
  Calendar,
  Warehouse,
  MessageSquare,
  LifeBuoy,
  Wrench,
  Settings,
  LogOut,
  Users,
  Sparkles,
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { Header } from '@/components/layout/header';
import { Logo } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/clients', icon: Users, label: 'Clients' },
  { href: '/dashboard/vehicles', icon: Car, label: 'Véhicules' },
  { href: '/dashboard/appointments', icon: Calendar, label: 'Rendez-vous' },
  { href: '/dashboard/diagnostics', icon: Wrench, label: 'Diagnostics' },
  { href: '/dashboard/description-generator', icon: Sparkles, label: 'Générateur' },
  { href: '/dashboard/inventory', icon: Warehouse, label: 'Inventaire' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/dashboard/support', icon: LifeBuoy, label: 'Support' },
];

function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 p-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">IBRA Service OS</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    className="w-full justify-start"
                    isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
                    tooltip={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton className="w-full justify-start">
                    <Settings className="h-5 w-5" />
                    <span>Paramètres</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <SidebarMenuButton onClick={handleLogout} className="w-full justify-start">
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function LoadingSkeleton() {
  return (
     <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Logo className="h-12 w-12 text-primary animate-pulse" />
        <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <LoadingSkeleton />;
  }

  return <AuthLayout>{children}</AuthLayout>;
}
