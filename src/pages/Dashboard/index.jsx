import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  MessageSquare,
  GitCompareArrows,
  FileBarChart2,
  FileText,
  AlertCircle,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Button from "../../components/ui/Button";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getAllDocuments } from "../../api/documentApi";
import { extractErrorMessage } from "../../api/client";
import { useLanguage } from "../../i18n/LanguageContext";
import { getRiskBadgeClass, getRiskBandFromStatus } from "../../utils/risk";

// Title/description are translation keys: dashboard.qa.<id>.title / .desc
const QUICK_ACTIONS = [
  { icon: Upload,           id: "upload",  to: "/upload" },
  { icon: MessageSquare,    id: "ask",     to: "/qa" },
  { icon: GitCompareArrows, id: "compare", to: "/compare" },
  { icon: FileBarChart2,    id: "reports", to: "/reports" },
];

const STATUS_COLORS = {
  UPLOADED:    "text-blue-600 bg-blue-50",
  PROCESSING:  "text-purple-600 bg-purple-50",
  PROCESSED:   "text-green-600 bg-green-50",
  FAILED:      "text-red-600 bg-red-50",
};

function statusColor(status) {
  const riskClass = getRiskBadgeClass(getRiskBandFromStatus(status));
  if (riskClass) return riskClass;
  return STATUS_COLORS[String(status || "").toUpperCase()] || "text-slate-600 bg-slate-100";
}

function formatDate(dt, locale) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const { t, ts, locale } = useLanguage();
  const { userName } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllDocuments()
      .then((docs) => setDocuments(docs || []))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const firstName = (userName || "").trim().split(/\s+/)[0] || "there";
  const recentDocs = documents.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Welcome banner */}
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-navy to-secondary px-5 py-6 shadow-sm sm:px-8 sm:py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              {userName ? t("dashboard.welcomeName", { name: firstName }) : t("dashboard.welcome")}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {loading
                ? t("dashboard.loadingDocs")
                : t(documents.length === 1 ? "dashboard.docCount.one" : "dashboard.docCount.other", { n: documents.length })}
            </p>
          </div>
          <Button as={Link} to="/upload" variant="teal" className="shrink-0">
            <Upload size={16} /> {t("dashboard.newUpload")}
          </Button>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ icon, id, to }) => (
            <StatCard
              key={id}
              icon={icon}
              to={to}
              title={t(`dashboard.qa.${id}.title`)}
              description={t(`dashboard.qa.${id}.desc`)}
            />
          ))}
        </div>

        {/* Recent documents */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-navy">{t("dashboard.recent")}</h2>
            <Link
              to="/documents"
              className="text-sm font-medium text-royal hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          </div>

          {loading && (
            <div className="mt-6 flex items-center justify-center py-8 text-slate-400 text-sm">
              {t("dashboard.loadingDocsShort")}
            </div>
          )}

          {!loading && error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && documents.length === 0 && (
            <div className="mt-4">
              <EmptyState
                title={t("dashboard.empty.title")}
                description={t("dashboard.empty.desc")}
                action={
                  <Button variant="royal" onClick={() => navigate("/upload")}>
                    <Upload size={16} /> {t("dashboard.uploadBtn")}
                  </Button>
                }
              />
            </div>
          )}

          {!loading && !error && recentDocs.length > 0 && (
            <>
              <div className="mt-4 space-y-3 md:hidden">
                {recentDocs.map((doc) => (
                  <article
                    key={doc.id}
                    className="rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <FileText size={18} className="mt-0.5 shrink-0 text-royal" />
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-navy">
                          {doc.title || doc.fileName}
                        </p>
                        <p className="mt-0.5 break-all text-xs text-slate-400">{doc.fileName}</p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(doc.status)}`}>
                            {ts(doc.status)}
                          </span>
                          <span className="text-xs text-slate-500">{formatDate(doc.uploadedAt, locale)}</span>
                        </div>
                        <button
                          className="mt-3 min-h-10 text-sm font-semibold text-royal hover:underline"
                          onClick={() => navigate(`/analysis/${doc.id}`, { state: { fileName: doc.title || doc.fileName } })}
                        >
                          {t("dashboard.analyse")}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[680px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="pb-2 pr-4 font-semibold">{t("dashboard.col.document")}</th>
                    <th className="pb-2 pr-4 font-semibold">{t("dashboard.col.status")}</th>
                    <th className="pb-2 pr-4 font-semibold">{t("dashboard.col.uploadedBy")}</th>
                    <th className="pb-2 font-semibold">{t("dashboard.col.date")}</th>
                    <th className="pb-2 font-semibold">{t("dashboard.col.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="cursor-pointer border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      onClick={() =>
                        navigate(`/analysis/${doc.id}`, { state: { fileName: doc.title || doc.fileName } })
                      }
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="shrink-0 text-royal" />
                          <div>
                            <p className="text-sm font-medium text-navy">
                              {doc.title || doc.fileName}
                            </p>
                            <p className="text-xs text-slate-400">{doc.fileName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(doc.status)}`}
                        >
                          {ts(doc.status)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-500">
                        {doc.uploadedBy || "—"}
                      </td>
                      <td className="py-3 text-sm text-slate-500">
                        {formatDate(doc.uploadedAt, locale)}
                      </td>
                      <td className="py-3">
                        <button
                          className="text-xs font-medium text-royal hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/analysis/${doc.id}`, { state: { fileName: doc.title || doc.fileName } });
                          }}
                        >
                          {t("dashboard.analyse")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
