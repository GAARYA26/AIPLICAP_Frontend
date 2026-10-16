import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Scale as ScaleIcon,
  AlertTriangle,
  GitCompareArrows,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import { useLanguage } from "../../i18n/LanguageContext";

const FEATURES = [
  {
    icon: ShieldCheck,
    titleKey: "home.feature.1.title",
    descKey: "home.feature.1.desc",
  },
  {
    icon: TrendingUp,
    titleKey: "home.feature.2.title",
    descKey: "home.feature.2.desc",
  },
  {
    icon: ScaleIcon,
    titleKey: "home.feature.3.title",
    descKey: "home.feature.3.desc",
  },
  {
    icon: AlertTriangle,
    titleKey: "home.feature.4.title",
    descKey: "home.feature.4.desc",
  },
  {
    icon: MessageSquare,
    titleKey: "home.feature.5.title",
    descKey: "home.feature.5.desc",
  },
  {
    icon: GitCompareArrows,
    titleKey: "home.feature.6.title",
    descKey: "home.feature.6.desc",
  },
];

function Landing() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy">
        <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-royal/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-2 lg:py-20">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 text-sm font-semibold text-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              {t("home.eyebrow")}
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
              {t("home.title")}
            </h1>

            <p className="mt-6 max-w-lg text-lg text-slate-300 sm:text-xl">
              {t("home.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/upload" variant="teal" className="!px-4 !py-3 text-sm sm:!px-6 sm:!py-3.5 sm:text-base">
                <Upload size={18} /> {t("home.upload")}
              </Button>
              <Button as={Link} to="/qa" variant="translucent" className="!px-4 !py-3 text-sm sm:!px-6 sm:!py-3.5 sm:text-base">
                <MessageSquare size={18} /> {t("home.ask")}
              </Button>
              <Button as={Link} to="/register" variant="outlineDark" className="!px-4 !py-3 text-sm sm:!px-6 sm:!py-3.5 sm:text-base">
                {t("home.learnMore")}
              </Button>
            </div>
          </motion.div>

          {/* RIGHT — workflow illustration without fabricated analysis metrics */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-7 text-white shadow-2xl backdrop-blur">
              <p className="text-lg font-semibold">{t("home.workflowTitle")}</p>
              <p className="mt-2 text-sm text-slate-300">{t("home.workflowDesc")}</p>
              <ol className="mt-6 space-y-4">
                {[t("home.step1"), t("home.step2"), t("home.step3"), t("home.step4")].map((step, i) => (
                  <li key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-royal font-bold">{i + 1}</span>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            {t("home.featuresTitle")}
          </h2>
          <p className="mt-3 text-lg text-slate-500">
            {t("home.featuresSubtitle")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, titleKey, descKey }, i) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="group cursor-default rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-royal/30 hover:shadow-xl hover:shadow-royal/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal/10 text-royal transition-colors group-hover:bg-royal group-hover:text-white">
                <Icon size={20} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{t(descKey)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
