import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        console.info("Password recovery session active");
      }
    });
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully. You can now log in.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center text-(--foreground) bg-(--background) justify-center">
      <form
        onSubmit={handleUpdatePassword}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold">Reset Password</h1>
        <div className="mb-6">
          <div className="relative flex justify-end items-center">
            <Input
              placeholder="New password"
              name={"password"}
              id="password"
              required
              type={showPassword ? "text" : "password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="text-(--primary) absolute right-3"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
