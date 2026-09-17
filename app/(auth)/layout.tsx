import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - Panel Admin Dikbud Konawe Selatan",
  description:
    "Halaman login untuk mengakses panel administrasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
