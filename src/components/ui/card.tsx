import { clsx } from "clsx";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "neon" | "danger" | "success";
}

export function Card({ children, className, onClick, variant = "default" }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "sb-card p-5 transition-all duration-200 relative z-10",
        onClick && "cursor-pointer hover:neon-border",
        variant === "neon" && "neon-border",
        variant === "danger" && "border-red-500/30",
        variant === "success" && "border-sb-neon/30",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={clsx("text-lg font-semibold text-white", className)}>{children}</h3>;
}
