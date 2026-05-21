import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Home,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  ShieldAlert,
  ShoppingBag,
  Users,
} from "lucide-react";
import { isCurrentUserAdmin } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialAdminPath = useRef(location.href);
  const [email, setEmail] = useState("Admin");
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!isActive) {
        return;
      }

      if (!data.session) {
        navigate({
          to: "/admin-login",
          search: {
            redirect: initialAdminPath.current,
          },
          replace: true,
        });
        return;
      }

      const user = data.session.user;
      const adminAccess = await isCurrentUserAdmin(user.id, user.email);

      if (!isActive) {
        return;
      }

      if (user.email) {
        setEmail(user.email);
      }

      setHasAdminAccess(adminAccess);
      setCheckingSession(false);
    });

    return () => {
      isActive = false;
    };
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin-login" });
  }

  function AdminBrand() {
    return (
      <Link to="/" className="font-display text-xl tracking-tight">
        Sofa Studio <span className="text-primary text-xs uppercase">Admin</span>
      </Link>
    );
  }

  function AdminNavigation({ onNavigate }: { onNavigate?: () => void }) {
    const linkClass =
      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors";
    const activeClass = "bg-muted font-medium text-primary";

    return (
      <nav className="space-y-2">
        <Link
          to="/admin"
          className={linkClass}
          activeProps={{ className: activeClass }}
          onClick={onNavigate}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className={linkClass}
          activeProps={{ className: activeClass }}
          onClick={onNavigate}
        >
          <ShoppingBag className="h-4 w-4" />
          Products
        </Link>
        <Link
          to="/admin/content"
          className={linkClass}
          activeProps={{ className: activeClass }}
          onClick={onNavigate}
        >
          <Home className="h-4 w-4" />
          Page Content
        </Link>
        <Link
          to="/admin/submissions"
          className={linkClass}
          activeProps={{ className: activeClass }}
          onClick={onNavigate}
        >
          <Inbox className="h-4 w-4" />
          Requests
        </Link>
        <Link
          to="/admin/users"
          className={linkClass}
          activeProps={{ className: activeClass }}
          onClick={onNavigate}
        >
          <Users className="h-4 w-4" />
          Admin Users
        </Link>
        <div className="pt-4 mt-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-destructive w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>
    );
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Checking admin access...</span>
        </div>
      </main>
    );
  }

  if (!hasAdminAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md rounded-sm border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-display text-3xl">Admin access required</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You are signed in as {email}, but this account is not listed in `admin_users`.
          </p>
          <Button onClick={handleLogout} className="mt-6">
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background hidden md:block">
        <div className="flex h-16 items-center px-6 border-b">
          <AdminBrand />
        </div>
        <div className="p-4">
          <AdminNavigation />
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-auto">
        <header className="sticky top-0 z-30 min-h-16 border-b bg-background/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button type="button" variant="outline" size="icon" className="md:hidden" aria-label="Open admin menu">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="border-b px-6 py-5 text-left">
                    <SheetTitle>
                      <AdminBrand />
                    </SheetTitle>
                    <SheetDescription>Admin navigation</SheetDescription>
                  </SheetHeader>
                  <div className="p-4">
                    <AdminNavigation onNavigate={() => setMobileNavOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
              <h2 className="truncate font-semibold text-base md:text-lg">Admin Control Panel</h2>
            </div>
            <span className="max-w-[48vw] truncate text-xs text-muted-foreground italic sm:text-sm">
              Logged in as {email}
            </span>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
