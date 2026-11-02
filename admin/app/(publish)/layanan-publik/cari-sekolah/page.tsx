import type { Metadata } from "next";
import { SchoolFinderContent } from "./school-finder-content";
export const metadata: Metadata = {
  title: "Cari Sekolah",
  description:
    "Direktori dan pencarian data satuan pendidikan seluruh jenjang di 25 kecamatan Kabupaten Konawe Selatan.",
};

export default function SchoolFinderPage() { return <SchoolFinderContent />; }
