"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.scss";
import { avenir } from "@/lib/fonts";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = useMemo(() => {
    if (!touched.email) return "";
    if (!email.trim()) return "Email is required";
    if (!isValidEmail(email.trim())) return "Enter a valid email address";
    return "";
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return "";
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  }, [password, touched.password]);

  const isFormValid = isValidEmail(email.trim()) && password.length >= 8;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      router.push("/users");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.wrapper} ${avenir.className}`}>
      <h1 className={styles.title}>Welcome!</h1>
      <p className={styles.subtitle}>Enter details to login.</p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldGroup}>
          <input
            type="email"
            placeholder="Email"
            className={`${styles.input} ${emailError ? styles.inputError : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() =>
              setTouched((prev) => ({
                ...prev,
                email: true,
              }))
            }
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError ? (
            <p id="email-error" className={styles.errorText}>
              {emailError}
            </p>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${styles.input} ${passwordError ? styles.inputError : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  password: true,
                }))
              }
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? "password-error" : undefined}
            />

            <button
              type="button"
              className={styles.showButton}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          {passwordError ? (
            <p id="password-error" className={styles.errorText}>
              {passwordError}
            </p>
          ) : null}
        </div>

        <button type="button" className={styles.forgotPassword}>
          FORGOT PASSWORD?
        </button>

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "LOGGING IN..." : "LOG IN"}
        </button>
      </form>
    </div>
  );
}