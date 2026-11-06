import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.scss";

type Variant = "primary" | "secondary";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function classNames(variant: Variant, className?: string): string {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = "primary", className, ...linkProps } = props;
    return <Link {...linkProps} className={classNames(variant, className)} />;
  }
  const { variant = "primary", className, type = "button", ...buttonProps } = props;
  return <button type={type} {...buttonProps} className={classNames(variant, className)} />;
}
