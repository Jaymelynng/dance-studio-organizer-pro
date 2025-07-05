import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Menu,
  Bell,
  Calendar,
  GraduationCap,
  AlertCircle
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", path: "/", icon: Home },
  { title: "Students", path: "/students", icon: Users },
  { title: "Contracts", path: "/contracts", icon: FileText },
  { title: "Payments", path: "/payments", icon: DollarSign },
  { title: "Communications", path: "/communications", icon: MessageSquare },
  { title: "Reports", path: "/reports", icon: BarChart3 },
  { title: "Schedule", path: "/schedule", icon: Calendar },
  { title: "Settings", path: "/settings", icon: Settings },
];

export const AppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? 'flex flex-col space-y-2' : 'hidden md:flex items-center space-x-1'}`}>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "default" : "ghost"}
          size={mobile ? "default" : "sm"}
          onClick={() => {
            navigate(item.path);
            if (mobile) setIsOpen(false);
          }}
          className={`${mobile ? 'justify-start w-full' : ''} ${
            isActive(item.path) ? 'bg-primary text-primary-foreground' : 'text-white/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <item.icon className={`h-4 w-4 ${mobile ? 'mr-2' : 'mr-1'}`} />
          {item.title}
        </Button>
      ))}
    </div>
  );

  return (
    <nav className="bg-gradient-hero border-b border-white/20 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <GraduationCap className="h-8 w-8 text-white" />
          <div className="text-white">
            <h1 className="text-xl font-bold">Dégagé Classical</h1>
            <p className="text-xs text-white/80">Conservatory Management</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <NavItems />

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-warning text-warning-foreground text-xs">
              3
            </Badge>
          </Button>

          {/* Alerts */}
          <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 relative">
            <AlertCircle className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
              2
            </Badge>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden text-white/90 hover:text-white hover:bg-white/10">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NavItems mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};