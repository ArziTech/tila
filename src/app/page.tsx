import {
  ArrowRight,
  Brain,
  CheckCircle,
  Flame,
  Layout,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
}: FeatureCardProps) => (
  <div className="bg-card p-6 rounded border border-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color}`}
    >
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export default async function LandingPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-purple-200 dark:selection:bg-purple-800">
      {/* --- NAVBAR --- */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
            T
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            TILA
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 sm:gap-8 font-medium text-muted-foreground">
          <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition">
            Features
          </a>
          <a href="#testimonials" className="hover:text-purple-600 dark:hover:text-purple-400 transition">
            Stories
          </a>
          <a href="#pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Button variant={"default"} className="rounded-2xl" asChild>
              <Link href="/dashboard">
                <span className="hidden sm:inline">Hi {user.name || "there"}, Go to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Link>
            </Button>
          ) : (
            <div className="flex gap-2 sm:gap-4">
              <Button variant={"outline"} className="rounded-2xl" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant={"default"} className="rounded-2xl" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 px-6">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm text-purple-600 text-sm font-bold animate-fade-in-up">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              New: AI Study Companion
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
              Master Any Skill, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 dark:from-purple-400 dark:via-pink-400 dark:to-orange-300">
                One Day at a Time.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              TILA helps you track, organize, and gamify your self-learning
              journey. Turn "I wish I knew" into "I just learned".
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-800 dark:hover:bg-white hover:scale-105 transition shadow-xl flex items-center gap-2"
                asChild
              >
                <Link href="/login">
                  Start Learning Now <ArrowRight size={20} />
                </Link>
              </Button>
              <button
                type="button"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-card text-foreground border border-border rounded-2xl font-bold text-base sm:text-lg hover:bg-muted transition flex items-center gap-2"
              >
                <Layout size={20} /> View Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden"
                  >
                    {/* <Image */}
                    {/*   src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} */}
                    {/*   alt="User" */}
                    {/*   width={40} */}
                    {/*   height={40} */}
                    {/* /> */}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400 dark:text-yellow-500 mb-0.5">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="font-bold text-foreground">
                  Loved by 10,000+ learners
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
              Everything You Need to <br />
              <span className="text-purple-600 dark:text-purple-400">Grow Every Day</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Learning shouldn't be boring. We combine proven productivity
              methods with gamification to keep you addicted to progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI Personal Tutor"
              description="Stuck on a concept? Tila Bot is ready 24/7 to explain complex topics, generate quizzes, and suggest what to learn next."
              color="bg-gradient-to-br from-blue-400 to-cyan-300"
            />
            <FeatureCard
              icon={Flame}
              title="Gamified Streaks"
              description="Build unbreakable habits. Earn XP, unlock achievements, and watch your daily streak grow as you learn."
              color="bg-gradient-to-br from-orange-400 to-red-300"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Smart Analytics"
              description="Visualize your effort. See exactly where your time goes and identify your most productive learning hours."
              color="bg-gradient-to-br from-purple-400 to-pink-300"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Learning Backlog"
              description="Never forget a 'I want to learn that later' thought again. Capture ideas instantly and prioritize them."
              color="bg-gradient-to-br from-green-400 to-emerald-300"
            />
            <FeatureCard
              icon={Zap}
              title="Focus Timer"
              description="Integrated Pomodoro timer to help you enter flow state. Track every minute of deep work automatically."
              color="bg-gradient-to-br from-yellow-400 to-orange-300"
            />
            <FeatureCard
              icon={Users}
              title="Community (Soon)"
              description="Connect with fellow learners, share your notes, and compete on the global leaderboard."
              color="bg-gradient-to-br from-indigo-400 to-violet-300"
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-12 border-t border-gray-800 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 text-white rounded-lg flex items-center justify-center font-bold">
              T
            </div>
            <span className="text-xl font-bold">TILA</span>
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} Today I've Learned About. All rights
            reserved.
          </div>
          <div className="flex gap-6">
            <a href="/" className="text-gray-400 hover:text-white dark:hover:text-gray-200 transition">
              Twitter
            </a>
            <a href="/" className="text-gray-400 hover:text-white dark:hover:text-gray-200 transition">
              GitHub
            </a>
            <a href="/" className="text-gray-400 hover:text-white dark:hover:text-gray-200 transition">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
