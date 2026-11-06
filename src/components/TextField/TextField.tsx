import { useId, type ComponentProps } from "react";
import styles from "./TextField.module.scss";

type BaseProps = {
  name: string;
  label: string;
  errors?: string[];
};

type InputProps = BaseProps & Omit<ComponentProps<"input">, "id" | "name"> & { multiline?: false };
type TextareaProps = BaseProps &
  Omit<ComponentProps<"textarea">, "id" | "name"> & { multiline: true };

export type TextFieldProps = InputProps | TextareaProps;

// Strips the props TextField consumes, leaving the native control's attributes.
function controlProps<T extends TextFieldProps>(props: T) {
  const { label: _label, errors: _errors, multiline: _multiline, ...rest } = props;
  return rest;
}

export function TextField(props: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const error = props.errors?.[0];
  const shared = {
    id,
    className: styles.control,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {props.label}
      </label>
      {props.multiline ? (
        <textarea {...controlProps(props)} {...shared} />
      ) : (
        <input {...controlProps(props)} {...shared} />
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
