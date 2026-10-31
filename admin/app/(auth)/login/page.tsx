"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { callAPI, ApiResponse } from "@/lib/api";
import { useUrlStore } from "@/store/useUrlStore";
import { useAuthStore, AuthDataResponse } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const loginUrl = useUrlStore((state) => state.URL.LOGIN);
  const setUser = useAuthStore((state) => state.setUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if session is already valid on mount (redirect to /admin), and load remembered identifier
  useEffect(() => {
    checkAuth().then((currentUser) => {
      if (currentUser) {
        router.replace("/admin");
      }
    });

    try {
      const savedIdentifier = localStorage.getItem("edusetara_remember_identifier");
      if (savedIdentifier) {
        setIdentifier(savedIdentifier);
        setRememberMe(true);
      }
    } catch {
      // LocalStorage access might fail in privacy-restricted browser environments
    }
  }, [checkAuth, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier || !password) {
      setErrorMessage("Email/NIP dan Kata Sandi wajib diisi.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await callAPI<ApiResponse<AuthDataResponse>>(loginUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          identifier: trimmedIdentifier,
          password,
          remember_me: rememberMe,
        }),
      });

      if (response.success && response.data?.user) {
        setUser(response.data.user);

        // Save or remove remembered identifier
        try {
          if (rememberMe) {
            localStorage.setItem("edusetara_remember_identifier", trimmedIdentifier);
          } else {
            localStorage.removeItem("edusetara_remember_identifier");
          }
        } catch {
          // ignore
        }

        setSuccessMessage("Login berhasil! Mengalihkan ke panel admin...");

        setTimeout(() => {
          router.replace("/admin");
          router.refresh();
        }, 350);
      } else {
        throw new Error(response.message || "Gagal masuk. Periksa kembali kredensial Anda.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi server.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

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
            © 2026 Dikbud Konawe Selatan • Sistem Informasi EduSetara
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
              Silakan masuk menggunakan Email kedinasan, NIP, atau Username Anda untuk mengakses
              panel administrasi.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="login-alert-error" role="alert">
              <span className="text-base select-none">⚠️</span>
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="login-alert-success" role="alert">
              <span className="text-base select-none">✅</span>
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Email / NIP / Username</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">✉</span>
                <input
                  id="login-email"
                  type="text"
                  placeholder="Masukkan email, NIP, atau username"
                  value={identifier}
                  disabled={isLoading}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  disabled={isLoading}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ingat saya</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Silakan hubungi Administrator Dinas Pendidikan Kab. Konawe Selatan untuk reset kata sandi.");
                }}
                className="login-forgot"
              >
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-help">
            <p>
              Belum punya akun?{" "}
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Pendaftaran akun ASN dilakukan melalui Bagian Kepegawaian Dikbud Konawe Selatan.");
                }}
              >
                Hubungi administrator
              </a>{" "}
              untuk mendaftarkan akun Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
