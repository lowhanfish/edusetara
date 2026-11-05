import React from "react";
import { Icon } from "@/app/(admin)/_components/admin-icons";

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  action: "add" | "edit" | "delete";
  label: string;
}

const styles = {
  add: "border-amber-300/80 bg-gradient-to-br from-amber-200 to-amber-400 text-amber-950 shadow-amber-500/20 hover:shadow-amber-500/35 focus-visible:ring-amber-400",
  edit: "border-sky-200 bg-sky-50 text-sky-700 shadow-sky-500/10 hover:bg-sky-100 hover:border-sky-300 focus-visible:ring-sky-400",
  delete: "border-rose-200 bg-rose-50 text-rose-600 shadow-rose-500/10 hover:bg-rose-100 hover:border-rose-300 focus-visible:ring-rose-400",
};
const icons = { add: "plus", edit: "edit", delete: "trash" };

export default function ActionIconButton({ action, label, className = "", title, ...props }: Props) {
  return (
    <button type="button" {...props} aria-label={label} title={title || label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 ${styles[action]} ${className}`}>
      <Icon name={icons[action]} size={17} />
    </button>
  );
}
