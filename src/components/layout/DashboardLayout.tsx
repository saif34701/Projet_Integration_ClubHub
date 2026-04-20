import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Users, ClipboardList, Megaphone, CalendarDays, Video,
  Bell, Settings, LogOut, GraduationCap, Shield, Building2, ChevronDown, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const studentNav = [
  { title: "Tableau de bord", url: "/etudiant", icon: LayoutDashboard },
  { title: "Mes demandes", url: "/etudiant/demandes", icon: ClipboardList },
  { title: "Notifications", url: "/etudiant/notifications", icon: Bell },
  { title: "Réunions", url: "/etudiant/reunions", icon: Video },
];

const responsableNav = [
  { title: "Tableau de bord", url: "/responsable", icon: LayoutDashboard },
  { title: "Demandes d'adhésion", url: "/responsable/demandes", icon: ClipboardList },
  { title: "Membres", url: "/responsable/membres", icon: Users },
  { title: "Annonces", url: "/responsable/annonces", icon: Megaphone },
  { title: "Événements", url: "/responsable/evenements", icon: CalendarDays },
  { title: "Réunions", url: "/responsable/reunions", icon: Video },
];

const adminNav = [
  { title: "Tableau de bord", url: "/admin", icon: LayoutDashboard },
  { title: "Gestion des clubs", url: "/admin/clubs", icon: Building2 },
  { title: "Utilisateurs", url: "/admin/utilisateurs", icon: Users },
];

function DashboardSidebarContent() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapsed";

  const navItems = user?.role === "admin" ? adminNav : user?.role === "responsable" ? responsableNav : studentNav;
  const roleLabel = user?.role === "admin" ? "Administrateur" : user?.role === "responsable" ? "Responsable" : "Étudiant";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm text-sidebar-foreground leading-tight">ISET ClubHub</span>
              <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Radès</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest px-4">{roleLabel}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/etudiant" || item.url === "/responsable" || item.url === "/admin"}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4.5 h-4.5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom user section */}
        <div className="mt-auto border-t border-sidebar-border p-3">
          {collapsed ? (
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }} className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-left">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                    <p className="text-[11px] text-sidebar-foreground/50 truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground/40 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <Badge variant="info" className="text-[10px]">{roleLabel}</Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="gap-2"><Building2 className="w-4 h-4" />Retour au site</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/"); }} className="text-destructive gap-2">
                  <LogOut className="w-4 h-4" />Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({ children, title, description, actions }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebarContent />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b border-border bg-card/50 backdrop-blur-sm px-6 shrink-0">
            <SidebarTrigger />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="font-heading font-bold text-lg text-foreground">{title}</h1>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/" className="gap-2">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Retour a l'accueil</span>
                    <span className="sm:hidden">Accueil</span>
                  </Link>
                </Button>
                {actions}
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
