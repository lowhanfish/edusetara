import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Video Testimoni | Admin Dikbud Konawe Selatan",
  description: "Manajemen Video Testimoni Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function VideoTestimoniPage() {
  return (
    <AdminPageScaffold
      title="Video Testimoni"
      category="Gallery"
      description="Kelola dan konfigurasi data Video Testimoni secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎬"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Video Testimoni",
              "href": "/admin/gallery/video-testimoni"
      }
]}
    />
  );
}
