import Link from "next/link";

const stats = [
  { label: "Total Sekolah", value: "287", change: "+3", icon: "🏫", color: "#e8f5e9" },
  { label: "Tenaga Pendidik", value: "4.231", change: "+45", icon: "👨‍🏫", color: "#e3f2fd" },
  { label: "Peserta Didik", value: "52.847", change: "+312", icon: "🎓", color: "#fff3e0" },
  { label: "Pengumuman Aktif", value: "12", change: "+2", icon: "📢", color: "#fce4ec" },
];

const recentNews = [
  { id: 1, title: "Pelaksanaan ANBK 2026 Berjalan Lancar di Seluruh Konawe Selatan", date: "17 Sep 2026", status: "Terbit" },
  { id: 2, title: "Workshop Kurikulum Merdeka untuk Guru SD dan SMP", date: "16 Sep 2026", status: "Terbit" },
  { id: 3, title: "Pendaftaran Beasiswa Prestasi Semester Genap", date: "15 Sep 2026", status: "Draft" },
  { id: 4, title: "Festival Budaya Tolaki Meriahkan HUT Konawe Selatan", date: "14 Sep 2026", status: "Terbit" },
  { id: 5, title: "Rapat Koordinasi Peningkatan Mutu Pendidikan Dasar", date: "13 Sep 2026", status: "Draft" },
];

const recentAnnouncements = [
  { id: 1, title: "Jadwal Pelaksanaan Asesmen Nasional 2026", priority: "Tinggi", date: "17 Sep" },
  { id: 2, title: "Surat Edaran Libur Nasional dan Cuti Bersama", priority: "Normal", date: "15 Sep" },
  { id: 3, title: "Pemutakhiran Data Pokok Pendidikan (Dapodik)", priority: "Tinggi", date: "14 Sep" },
  { id: 4, title: "Seleksi Calon Kepala Sekolah Tahun 2026", priority: "Normal", date: "12 Sep" },
];

const quickActions = [
  { label: "Tulis Berita", icon: "✏️", href: "/admin/berita" },
  { label: "Buat Pengumuman", icon: "📝", href: "/admin/pengumuman" },
  { label: "Tambah Sekolah", icon: "➕", href: "/admin/sekolah" },
  { label: "Lihat Statistik", icon: "📊", href: "/admin/statistik" },
];

export default function AdminDashboard() {
  return (
    <>
      {/* Welcome Banner */}
      <div className="admin-welcome">
        <div>
          <h2>Selamat Datang, Admin! 👋</h2>
          <p>Berikut ringkasan data terkini dari sistem Dinas Pendidikan dan Kebudayaan.</p>
        </div>
        <div className="admin-welcome-date">
          <span>📅</span>
          <span>Rabu, 17 September 2026</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{stat.value}</span>
              <span className="admin-stat-label">{stat.label}</span>
            </div>
            <span className="admin-stat-change">
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href} className="admin-quick-btn">
            <span>{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="admin-grid-2">
        {/* Recent News */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>📰 Berita Terbaru</h3>
            <Link href="/admin/berita" className="admin-card-link">Lihat Semua →</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentNews.map((item) => (
                  <tr key={item.id}>
                    <td className="admin-table-title">{item.title}</td>
                    <td className="admin-table-date">{item.date}</td>
                    <td>
                      <span className={`admin-badge ${item.status === "Terbit" ? "badge-green" : "badge-yellow"}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>📢 Pengumuman Aktif</h3>
            <Link href="/admin/pengumuman" className="admin-card-link">Lihat Semua →</Link>
          </div>
          <div className="admin-announcement-list">
            {recentAnnouncements.map((item) => (
              <div key={item.id} className="admin-announcement-item">
                <div className="admin-announcement-content">
                  <strong>{item.title}</strong>
                  <small>{item.date}</small>
                </div>
                <span className={`admin-badge ${item.priority === "Tinggi" ? "badge-red" : "badge-blue"}`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>🕐 Aktivitas Terakhir</h3>
        </div>
        <div className="admin-activity-list">
          {[
            { text: "Admin memperbarui berita \"Pelaksanaan ANBK 2026\"", time: "10 menit lalu", icon: "✏️" },
            { text: "Sistem mempublikasikan pengumuman jadwal asesmen", time: "1 jam lalu", icon: "📢" },
            { text: "Admin menambahkan data sekolah baru: SDN 5 Andoolo", time: "3 jam lalu", icon: "🏫" },
            { text: "Admin memperbarui data tenaga pendidik", time: "5 jam lalu", icon: "👨‍🏫" },
            { text: "Laporan statistik bulanan berhasil dibuat", time: "Kemarin", icon: "📊" },
          ].map((activity, i) => (
            <div key={i} className="admin-activity-item">
              <span className="admin-activity-icon">{activity.icon}</span>
              <span className="admin-activity-text">{activity.text}</span>
              <span className="admin-activity-time">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
