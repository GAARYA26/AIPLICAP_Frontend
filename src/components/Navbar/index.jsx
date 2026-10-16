import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import LanguageToggle from "../LanguageToggle";
import { useLanguage } from "../../i18n/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const NAV_LINKS = [
  { key: "nav.dashboard", to: "/dashboard" },
  { key: "nav.documents", to: "/documents" },
  { key: "nav.analysis", to: "/analysis" },
  { key: "nav.compare", to: "/compare" },
  { key: "nav.qa", to: "/qa" },
  { key: "nav.profile", to: "/settings" },
];

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, userName } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = (userName || "").trim().split(/\s+/)[0] || t("common.user");

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  function renderNavLinks(mobile = false) {
    return NAV_LINKS.map((link) => {
      const active =
        pathname === link.to ||
        (link.to === "/documents" && pathname === "/upload") ||
        (link.to !== "/dashboard" && pathname.startsWith(`${link.to}/`));
      return (
        <Link
          key={link.to}
          to={link.to}
          onClick={() => setMenuOpen(false)}
          aria-current={active ? "page" : undefined}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
            active
              ? "bg-white/10 text-white"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          } ${mobile ? "block" : ""}`}
        >
          {t(link.key)}
        </Link>
      );
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-navy">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal text-xs font-bold text-white">
            AI
          </span>
          <span className="text-base font-bold text-white">Legal Assistant</span>
        </Link>

        {/* Primary nav */}
        {isLoggedIn && <nav className="hidden xl:flex items-center gap-1">{renderNavLinks()}</nav>}

        {/* Right cluster */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageToggle className="bg-white" />

          {isLoggedIn ? (
            <div className="hidden items-center gap-2 xl:flex">
              <span className="text-sm font-medium text-slate-200">
                {t("nav.greeting", { name: firstName })}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
                aria-label={t("nav.logout")}
                title={t("nav.logout")}
              >
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 xl:flex">
              <Button as={Link} to="/login" variant="ghost" className="!text-slate-200 !px-3.5 !py-2 !text-sm hover:!text-white">
                {t("nav.login")}
              </Button>
              <Button as={Link} to="/register" variant="teal" className="!px-3.5 !py-2 !text-sm">
                {t("nav.signup")}
              </Button>
            </div>
          )}

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10 xl:hidden"
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.menu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 px-4 py-3 sm:px-6 xl:hidden">
          <div className="mx-auto max-w-7xl space-y-1">
            {isLoggedIn ? (
              <>
                {renderNavLinks(true)}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3.5 py-2 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <div className="flex gap-2 py-1">
                <Button as={Link} to="/login" variant="ghost" className="!text-slate-200 !px-3.5 !py-2 !text-sm hover:!text-white" onClick={() => setMenuOpen(false)}>
                  {t("nav.login")}
                </Button>
                <Button as={Link} to="/register" variant="teal" className="!px-3.5 !py-2 !text-sm" onClick={() => setMenuOpen(false)}>
                  {t("nav.signup")}
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
