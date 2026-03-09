"use client";

import { useState } from "react";
import styles from "./LoginForm.module.scss";
import { avenir } from "@/lib/fonts";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${styles.wrapper} ${avenir.className}`}>
      <h1 className={styles.title}>Welcome!</h1>
      <p className={styles.subtitle}>Enter details to login.</p>

      <form className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
        />

        <div className={styles.passwordField}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={styles.input}
          />

          <button
            type="button"
            className={styles.showButton}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>

        <button type="button" className={styles.forgotPassword}>
          FORGOT PASSWORD?
        </button>

        <button type="submit" className={styles.loginButton}>
          LOG IN
        </button>
      </form>
    </div>
  );
}