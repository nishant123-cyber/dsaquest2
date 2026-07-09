import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back, hero! 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <AmbientBlobs />

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="quest-card relative z-10 rounded-3xl p-8 w-full max-w-sm"
      >
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-quest-purple/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-quest-purple" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-quest-purple text-center mb-1">DSA Quest 🚀</h1>
        <p className="text-center text-[var(--text-muted)] mb-6">Log in to continue your adventure!</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                placeholder="Email"
                className="input-quest pl-10"
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && <p className="text-quest-pink text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                placeholder="Password"
                className="input-quest pl-10"
                aria-invalid={!!errors.password}
              />
            </div>
            {errors.password && <p className="text-quest-pink text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-quest-primary w-full">
            <LogIn className="w-5 h-5" /> {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          New here?{" "}
          <Link to="/signup" className="text-quest-purple font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

/** Ambient, purely decorative background — CSS/SVG only, no external assets. */
function AmbientBlobs() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)" }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-6rem] right-[-6rem] w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)" }}
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)" }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
