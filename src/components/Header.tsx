import { Package, Menu, LogOut, LayoutDashboard, Truck, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { href: "/services", label: "Services", isHash: false },
  { href: "/tracking", label: "Track", isHash: false },
  { href: "/about", label: "About", isHash: false },
  { href: "/contact", label: "Contact", isHash: false },
  { href: "/faq", label: "FAQ", isHash: false },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setAvatarUrl(null);
      setIsAdmin(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url, is_admin")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setAvatarUrl(data.avatar_url);
      setIsAdmin(data.is_admin || false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded flex items-center justify-center">
            <Package className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-accent uppercase tracking-tight">Global Embrace</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isHash ? (
              <a
                key={link.href}
                href={link.href}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-full hover:bg-primary-foreground/10 transition-colors">
                  <Avatar className="w-8 h-8 border-2 border-accent">
                    <AvatarImage src={avatarUrl || undefined} alt="Profile" />
                    <AvatarFallback className="bg-accent text-accent-foreground text-sm font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-primary-foreground font-medium text-sm max-w-[120px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border z-50">
                <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-shipments" className="flex items-center gap-2 cursor-pointer">
                    <Truck className="w-4 h-4" />
                    My Shipments
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer text-orange-600">
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="hero-outline" size="sm" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
          )}
          <Link to="/services">
            <Button variant="hero" size="sm" className="hidden sm:inline-flex">
              Get Quote
            </Button>
          </Link>

          {/* Mobile Hamburger Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-primary-foreground/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-primary border-primary-foreground/10">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-accent">
                  <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                    <Package className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="uppercase font-bold tracking-tight">Global Embrace</span>
                </SheetTitle>
              </SheetHeader>
              
              {/* Mobile user info */}
              {user && (
                <div className="flex items-center gap-3 mt-6 p-3 rounded-lg bg-primary-foreground/5">
                  <Avatar className="w-10 h-10 border-2 border-accent">
                    <AvatarImage src={avatarUrl || undefined} alt="Profile" />
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-primary-foreground font-medium truncate">
                      {user.email?.split("@")[0]}
                    </p>
                    <p className="text-primary-foreground/60 text-sm truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) =>
                  link.isHash ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-lg py-2 border-b border-primary-foreground/10"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-lg py-2 border-b border-primary-foreground/10"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                {user && (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-lg py-2 border-b border-primary-foreground/10"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex flex-col gap-3 mt-4">
                  {user ? (
                    <Button variant="hero-outline" className="w-full" onClick={() => { handleSignOut(); setOpen(false); }}>
                      Sign Out
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <Button variant="hero-outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                  <Link to="/services" onClick={() => setOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Get Quote
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
