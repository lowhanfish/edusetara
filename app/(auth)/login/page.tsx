"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      {/* Left Panel - Branding */}
      <div className="login-brand-panel">
        <div className="login-brand-bg" />
        <div className="login-brand-content">
          <Link href="/" className="login-back-link">
            <span>←</span> Kembali ke Beranda
          </Link>
          <div className="login-brand-center">
            <Image
              src="/img/logo_loght.png"
              width={90}
              height={90}
              alt="Logo Konawe Selatan"
              priority
            />
            <h1>
              Dinas Pendidikan
              <br />
              dan Kebudayaan
            </h1>
            <p className="login-brand-subtitle">Kabupaten Konawe Selatan</p>
            <div className="login-brand-divider" />
            <p className="login-brand-tagline">
              Cerdas Berkarakter, Lestari Budayanya,
              <br />
              Maju Konselnya
            </p>
          </div>
          <p className="login-brand-footer">
            © 2026 Dikbud Konawe Selatan
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <div className="login-icon-circle">
              <span>🔐</span>
            </div>
            <h2>Masuk ke Panel Admin</h2>
            <p>
              Silakan masuk dengan akun yang telah terdaftar untuk mengakses
              panel administrasi.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: Handle login
            }}
          >
            <div className="login-field">
              <label htmlFor="login-email">Email / NIP</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">✉</span>
                <input
                  id="login-email"
                  type="text"
                  placeholder="Masukkan email atau NIP Anda"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Kata Sandi</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="login-forgot">
                Lupa kata sandi?
              </a>
            </div>

            <button type="submit" className="login-submit">
              Masuk
              <span>→</span>
            </button>
          </form>

          <div className="login-help">
            <p>
              Belum punya akun?{" "}
              <a href="#">Hubungi administrator</a> untuk mendaftarkan akun
              Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
