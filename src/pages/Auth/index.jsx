import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import LanguageToggle from "../../components/LanguageToggle";
import { login as apiLogin } from "../../api/authApi";
import { register as apiRegister } from "../../api/userApi";
import { extractErrorMessage } from "../../api/client";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useLanguage } from "../../i18n/LanguageContext";

function Auth() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();

  const isLogin = location.pathname !== "/register";

  function navigateAfterLogin() {
    const from = location.state?.from;
    const destination =
      from?.pathname && !["/login", "/register"].includes(from.pathname)
        ? `${from.pathname}${from.search || ""}${from.hash || ""}`
        : "/dashboard";
    navigate(destination, { replace: true });
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // POST /api/auth/login
        const data = await apiLogin({ email: form.email, password: form.password });
        // data = { message, token }
        if (!data?.token) {
          throw new Error(t("auth.missingToken"));
        }
        const userObj = { email: form.email };
        login(data.token, userObj);
        navigateAfterLogin();
      } else {
        // POST /api/users/register  — role CLIENT is the default for end users
        await apiRegister({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "CLIENT",
        });
        // After registration, auto-login
        const data = await apiLogin({ email: form.email, password: form.password });
        if (!data?.token) {
          throw new Error(t("auth.missingToken"));
        }
        const userObj = { name: form.name, email: form.email };
        login(data.token, userObj);
        navigateAfterLogin();
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand story (60%) */}
      <div className="relative hidden w-3/5 flex-col justify-center overflow-hidden bg-navy px-16 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-secondary/40" />

        <div className="relative">
          <Link to="/" className="text-base font-bold text-white">
            Legal Assistant
          </Link>

          <h1 className="mt-10 max-w-md text-4xl font-extrabold leading-tight text-white">
            {t("auth.heroTitle")}
          </h1>

          <p className="mt-5 max-w-sm text-slate-300">
            {t("auth.heroDescription")}
          </p>

        </div>
      </div>

      {/* Right panel — auth card (40%) */}
      <div className="relative flex w-full flex-col justify-center px-6 py-12 sm:px-16 lg:w-2/5">
        <div className="absolute right-6 top-6">
          <LanguageToggle className="bg-white" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-navy">
            {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isLogin
              ? t("auth.loginDescription")
              : t("auth.registerDescription")}
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">
                  {t("auth.fullName")}
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder={t("auth.namePlaceholder")}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                {t("auth.email")}
              </label>
              <Input
                name="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-navy">
                  {t("auth.password")}
                </label>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              variant="royal"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? isLogin ? t("auth.loginLoading") : t("auth.registerLoading")
                : isLogin ? t("auth.loginSubmit") : t("auth.registerSubmit")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? t("auth.newHere") : t("auth.existingAccount")}{" "}
            <button
              type="button"
              onClick={() => {
                navigate(isLogin ? "/register" : "/login", {
                  state: location.state,
                  replace: true,
                });
                setError("");
              }}
              className="font-semibold text-royal hover:underline"
            >
              {isLogin ? t("auth.createAccount") : t("auth.signIn")}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
