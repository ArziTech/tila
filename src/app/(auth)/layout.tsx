import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Theme toggle positioned absolutely */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md p-6 sm:p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border">
        <div className="text-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 dark:from-purple-500 dark:via-pink-500 dark:to-blue-500 rounded flex items-center justify-center text-white mx-auto mb-4 sm:mb-6 text-3xl sm:text-4xl font-extrabold shadow-lg">
            T
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-2">TILA</h1>
          <p className="text-muted-foreground text-base sm:text-lg">Today I've Learned About</p>
        </div>

        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
