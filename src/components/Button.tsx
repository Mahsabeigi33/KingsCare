import React from "react";

type ButtonProps =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; variant?: "secondary" | "outline" })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; variant?: "secondary" | "outline" });

export function Button(props: ButtonProps) {
  const { as = "button", variant, children, ...rest } = props;
  const className =
    variant === "secondary"
      ? "bg-[#0E2A47] text-white px-4 py-2 rounded"
      : variant === "outline"
      ? "border border-[#0E2A47] text-[#0E2A47] px-4 py-2 rounded"
      : "";

  if (as === "a") {
    return (
      <a className={className} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className={className} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
