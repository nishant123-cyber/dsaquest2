import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await signup(data.name, data.email, data.password);
      toast.success("Account created! Let's start your quest 🎮");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm"
      >
        <h1 className="text-3xl font-display font-extrabold text-quest-purple text-center mb-1">
          Join the Quest! 🦸
        </h1>
        <p className="text-center text-gray-500 mb-6">Create your hero account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name")}
              placeholder="Your name"
              className="w-full border-2 border-quest-purple/20 rounded-xl px-4 py-2 focus:outline-none focus:border-quest-purple"
            />
            {errors.name && <p className="text-quest-pink text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full border-2 border-quest-purple/20 rounded-xl px-4 py-2 focus:outline-none focus:border-quest-purple"
            />
            {errors.email && <p className="text-quest-pink text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full border-2 border-quest-purple/20 rounded-xl px-4 py-2 focus:outline-none focus:border-quest-purple"
            />
            {errors.password && <p className="text-quest-pink text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-quest-pink text-white font-bold py-3 rounded-xl hover:bg-quest-pink/90 transition disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" /> {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already a hero?{" "}
          <Link to="/login" className="text-quest-purple font-bold">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
