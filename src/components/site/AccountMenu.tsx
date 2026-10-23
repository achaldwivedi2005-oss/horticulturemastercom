import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}

/** Session-aware account control for the header. */
export function AccountMenu() {
  const { user, isAdmin, loading } = useAuth();
  const signOut = useSignOut();

  if (loading) return <span className="size-9" aria-hidden />;

  if (!user) {
    return (
      <Button asChild variant="ghost" className="rounded-full">
        <Link to="/auth">Sign in</Link>
      </Button>
    );
  }

  const name = (user.user_metadata?.["full_name"] as string) || (user.user_metadata?.["name"] as string) || user.email || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="grid size-9 place-items-center rounded-full bg-gradient-primary font-display text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
        >
          {name.charAt(0).toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal">
          <p className="truncate font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard">
            <LayoutDashboard /> My dashboard
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <ShieldCheck /> Admin dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
