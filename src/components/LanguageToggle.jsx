import { useLanguage } from "../i18n/LanguageContext";

// The "EN | हि" pill. Clicking it flips the whole site between English and Hindi.
// Drop <LanguageToggle /> into the Navbar and/or the Landing page header.
export default function LanguageToggle({ className = "" }) {
  const { lang, setLang, t } = useLanguage();
  const languages = [
    { code: "en", label: "EN", name: "English" },
    { code: "hi", label: "हि", name: "हिन्दी" },
    { code: "mr", label: "मर", name: "मराठी" },
  ];

  return (
    <div
      role="group"
      aria-label={t("lang.switchTo")}
      className={`inline-flex overflow-hidden rounded-full border border-slate-200 ${className}`}
    >
      {languages.map(({ code, label, name }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-label={name}
          aria-pressed={lang === code}
          title={name}
          className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
            lang === code
              ? "bg-royal text-white"
              : "bg-white text-slate-500 hover:text-navy"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
