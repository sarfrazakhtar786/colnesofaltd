import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Home, Inbox, LayoutDashboard, Loader2, LogOut, ShieldAlert, ShoppingBag } from "lucide-react";
import { isCurrentUserAdmin } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

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
          <Link to="/" className="font-display text-xl tracking-tight">
            Sofa Studio <span className="text-primary text-xs uppercase">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
            activeProps={{ className: "bg-muted font-medium text-primary" }}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
            activeProps={{ className: "bg-muted font-medium text-primary" }}
          >
            <ShoppingBag className="h-4 w-4" />
            Products
          </Link>
          <Link
            to="/admin/content"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
            activeProps={{ className: "bg-muted font-medium text-primary" }}
          >
            <Home className="h-4 w-4" />
            Page Content
          </Link>
          <Link
            to="/admin/submissions"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
            activeProps={{ className: "bg-muted font-medium text-primary" }}
          >
            <Inbox className="h-4 w-4" />
            Requests
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b bg-background flex items-center px-8 justify-between">
          <h2 className="font-semibold text-lg">Admin Control Panel</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground italic">Logged in as {email}</span>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
