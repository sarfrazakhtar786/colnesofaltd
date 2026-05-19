import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, ShoppingBag, Home, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      throw redirect({
        to: "/admin-login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("Admin");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin-login" });
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
