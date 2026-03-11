"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { avenir } from "@/lib/fonts";
import styles from "./LoginForm.module.scss";

type LoginFormFields = {
  email: string;
  password: string;
};

type LoginFormTouched = {
  email: boolean;
  password: boolean;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm() {
  const router = useRouter();

  const [fields, setFields] = useState<LoginFormFields>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState<LoginFormTouched>({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const normalizedEmail = fields.email.trim();

  const errors = useMemo(() => {
    const emailError = !touched.email
      ? ""
      : !normalizedEmail
        ? "Email is required"
        : !isValidEmail(normalizedEmail)
          ? "Enter a valid email address"
          : "";

    const passwordError = !touched.password
      ? ""
      : !fields.password
        ? "Password is required"
        : fields.password.length < 8
          ? "Password must be at least 8 characters"
          : "";

    return {
      email: emailError,
      password: passwordError,
    };
  }, [fields.password, normalizedEmail, touched.email, touched.password]);

  const isFormValid =
    isValidEmail(normalizedEmail) && fields.password.length >= 8;

  const handleFieldChange =
    (field: keyof LoginFormFields) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setFields((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleFieldBlur = (field: keyof LoginFormTouched) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!isFormValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      router.push("/users");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.formCard} ${avenir.className}`}>
      <h1 className={styles.formCard__title}>Welcome!</h1>
      <p className={styles.formCard__subtitle}>Enter details to login.</p>

      <form className={styles.formCard__form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formCard__fieldGroup}>
          <input
            type="email"
            placeholder="Email"
            className={`${styles.formCard__input} ${
              errors.email ? styles["formCard__input--error"] : ""
            }`}
            value={fields.email}
            onChange={handleFieldChange("email")}
            onBlur={() => handleFieldBlur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            autoComplete="email"
          />

          {errors.email ? (
            <p id="email-error" className={styles.formCard__errorText}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className={styles.formCard__fieldGroup}>
          <div className={styles.formCard__passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${styles.formCard__input} ${
                errors.password ? styles["formCard__input--error"] : ""
              }`}
              value={fields.password}
              onChange={handleFieldChange("password")}
              onBlur={() => handleFieldBlur("password")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              autoComplete="current-password"
            />

            <button
              type="button"
              className={styles.formCard__showButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          {errors.password ? (
            <p id="password-error" className={styles.formCard__errorText}>
              {errors.password}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          className={styles.formCard__forgotPassword}
        >
          FORGOT PASSWORD?
        </button>

        <button
          type="submit"
          className={styles.formCard__loginButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "LOGGING IN..." : "LOG IN"}
        </button>
      </form>
    </div>
  );
}