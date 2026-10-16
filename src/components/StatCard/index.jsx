import { Link } from "react-router-dom";

// Equal-weight "quick action" tile used on the Dashboard (Upload / Ask /
// Compare / Reports) and reusable anywhere a labelled icon-link is needed.
function StatCard({ icon: Icon, title, description, to, iconClassName = "" }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-royal/10 text-royal ${iconClassName}`}
      >
        <Icon size={18} />
      </span>
      <h3 className="mt-4 font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </Link>
  );
}

export default StatCard;
