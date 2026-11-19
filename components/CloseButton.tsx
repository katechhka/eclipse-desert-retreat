"use client";

import type { ButtonHTMLAttributes } from "react";
import s from "./CloseButton.module.scss";

export function CloseButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} type="button" className={s.button + " " + className}>
      <span>Close</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m4 4 12 12M16 4 4 16"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    </button>
  );
}
