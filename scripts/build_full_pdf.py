# scripts/build_full_pdf.py
import sys
import os

# Add local site-packages
sys.path.insert(0, '/Users/dinaskominfo/kiken/Project/next/edusetara/scripts/py_modules')

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas
import html

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 38
USABLE_WIDTH = PAGE_WIDTH - (2 * MARGIN)  # 595.27 - 76 = 519.27 pt

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0284c7"))
            self.drawString(MARGIN, PAGE_HEIGHT - 26, "ORBIT TRACE")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawString(MARGIN + 62, PAGE_HEIGHT - 26, "|  Dokumen Perencanaan Teknis Platform (v1.3)")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.75)
            self.line(MARGIN, PAGE_HEIGHT - 32, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 32)

        # Footer (All pages)
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#94a3b8"))
        self.drawString(MARGIN, 22, "ORBIT TRACE")
        self.setFont("Helvetica", 8)
        self.drawString(MARGIN + 58, 22, "— Internal Implementation Blueprint  •  Production Baseline")
        self.drawRightString(PAGE_WIDTH - MARGIN, 22, f"Halaman {self._pageNumber} dari {page_count}")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.75)
        self.line(MARGIN, 32, PAGE_WIDTH - MARGIN, 32)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN + 6,
        bottomMargin=MARGIN + 4
    )

    base_styles = getSampleStyleSheet()

    # Custom Styles
    style_normal = ParagraphStyle(
        'CustomNormal',
        parent=base_styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#1e293b')
    )

    style_normal_bold = ParagraphStyle(
        'CustomNormalBold',
        parent=style_normal,
        fontName='Helvetica-Bold'
    )

    style_code = ParagraphStyle(
        'CustomCode',
        parent=style_normal,
        fontName='Courier',
        fontSize=7.2,
        leading=9.8,
        textColor=colors.HexColor('#0f172a')
    )

    style_h1 = ParagraphStyle(
        'CustomH1',
        parent=base_styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=12,
        spaceAfter=7,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'CustomH2',
        parent=base_styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0369a1'),
        spaceBefore=9,
        spaceAfter=5,
        keepWithNext=True
    )

    style_h3 = ParagraphStyle(
        'CustomH3',
        parent=base_styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=7,
        spaceAfter=4,
        keepWithNext=True
    )

    style_th = ParagraphStyle(
        'CustomTH',
        parent=style_normal,
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    style_td = ParagraphStyle(
        'CustomTD',
        parent=style_normal,
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    style_td_bold = ParagraphStyle(
        'CustomTDBold',
        parent=style_td,
        fontName='Helvetica-Bold'
    )

    style_td_code = ParagraphStyle(
        'CustomTDCode',
        parent=style_td,
        fontName='Courier',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor('#0369a1')
    )

    story = []

    def p(text, style=style_normal):
        return Paragraph(text, style)

    def h1(text):
        return Paragraph(text, style_h1)

    def h2(text):
        return Paragraph(text, style_h2)

    def h3(text):
        return Paragraph(text, style_h3)

    def make_table(headers, rows, col_widths, is_code_col=None):
        data = []
        h_row = [Paragraph(f"<b>{h}</b>", style_th) for h in headers]
        data.append(h_row)

        for r_idx, r in enumerate(rows):
            row_data = []
            for c_idx, cell in enumerate(r):
                c_str = str(cell)
                if is_code_col and c_idx in is_code_col:
                    row_data.append(Paragraph(c_str, style_td_code))
                elif c_idx == 0 and len(headers) > 2:
                    row_data.append(Paragraph(c_str, style_td_bold))
                else:
                    row_data.append(Paragraph(c_str, style_td))
            data.append(row_data)

        t = Table(data, colWidths=col_widths, repeatRows=1)
        t_style = [
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 3.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 4.5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4.5),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ]
        for i in range(1, len(data)):
            if i % 2 == 0:
                t_style.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor('#f8fafc')))
            else:
                t_style.append(('BACKGROUND', (0, i), (-1, i), colors.white))
        t.setStyle(TableStyle(t_style))
        return t

    def make_callout(title, body_lines, kind="info"):
        bg_col = colors.HexColor('#f0fdf4') if kind == "success" else (
            colors.HexColor('#fef9c3') if kind == "warning" else colors.HexColor('#eff6ff')
        )
        bar_col = colors.HexColor('#16a34a') if kind == "success" else (
            colors.HexColor('#ca8a04') if kind == "warning" else colors.HexColor('#0284c7')
        )

        content = []
        if title:
            content.append(Paragraph(f"<b>{title}</b>", ParagraphStyle('CalloutTitle', parent=style_normal, fontName='Helvetica-Bold', fontSize=8.8, leading=12.5, textColor=colors.HexColor('#0f172a'))))
            content.append(Spacer(1, 2.5))
        for line in body_lines:
            content.append(Paragraph(line, style_normal))

        wrapper_table = Table([[content]], colWidths=[USABLE_WIDTH])
        wrapper_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg_col),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('LINEBEFORE', (0, 0), (0, -1), 3.5, bar_col),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        return wrapper_table

    def make_code_box(code_text):
        escaped_lines = []
        for line in code_text.strip().split('\n'):
            esc = html.escape(line).replace(' ', '&nbsp;')
            escaped_lines.append(Paragraph(f"<font name='Courier' size=7.2 color='#0f172a'>{esc}</font>", style_code))
        t = Table([[escaped_lines]], colWidths=[USABLE_WIDTH])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 7),
            ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ]))
        return t

    # -------------------------------------------------------------------------
    # COVER / PAGE 1
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 40))
    story.append(Paragraph("<font color='#d97706'><b>ORBIT TRACE</b></font>", ParagraphStyle('Brand', fontName='Helvetica-Bold', fontSize=12, leading=14)))
    story.append(Spacer(1, 24))
    story.append(Paragraph("<font color='#0284c7'><b>DOKUMEN PERENCANAAN TEKNIS</b></font>", ParagraphStyle('SubDoc', fontName='Helvetica-Bold', fontSize=11, leading=14)))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Orbit Trace</b>", ParagraphStyle('TitleDoc', fontName='Helvetica-Bold', fontSize=28, leading=34, textColor=colors.HexColor('#0f172a'))))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Multi-Tenant Omnichannel Customer Engagement Platform", ParagraphStyle('SubtitleDoc', fontName='Helvetica', fontSize=13.5, leading=17.5, textColor=colors.HexColor('#475569'))))
    story.append(Spacer(1, 24))

    callout_p1 = [
        "Blueprint implementasi backend dan platform: arsitektur, multi-tenancy, autentikasi, model data, endpoint API, RAG, "
        "workflow orkestrasi, antrean, keamanan, sinkronisasi real-time, message debouncing, pengujian terverifikasi, deployment, dan roadmap delivery."
    ]
    story.append(make_callout("Tujuan Dokumen", callout_p1, kind="warning"))
    story.append(Spacer(1, 28))

    meta_headers = ["Atribut", "Nilai"]
    meta_rows = [
        ["Versi", "1.3 - Real-Time Ingress, Inbound Debounce Buffer, and Production Hardening"],
        ["Status", "Implementation Blueprint (Production Target)"],
        ["Pemilik produk/teknis", "Kiken Sukma Batara / Tim Orbit Trace"],
        ["Tanggal", "16 September 2026"],
        ["Stack acuan", "FastAPI, SQLAlchemy 2.x (Async), PostgreSQL + pgvector, Redis, LangGraph, Next.js"]
    ]
    story.append(make_table(meta_headers, meta_rows, [140, USABLE_WIDTH - 140]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # RINGKASAN EKSEKUTIF & SCOPE
    # -------------------------------------------------------------------------
    story.append(h1("Ringkasan Eksekutif"))
    story.append(p(
        "<b>Orbit Trace</b> adalah platform SaaS omnichannel multi-tenant yang menyatukan percakapan pelanggan, "
        "data bisnis, knowledge base, workflow automation, AI/RAG, human handoff, real-time agent dispatch, dan analytics. "
        "Produk tidak diposisikan sebagai chatbot tunggal; RAG dan model AI adalah mesin pendukung di belakang alur operasional bisnis. "
        "Dokumen teknis internal ini mencatat model yang dipakai agar implementasi dapat diaudit, sementara kontrak API publik "
        "tetap memakai <i>capability alias</i> dan tidak pernah mengirim nama provider, nama model, versi model, atau identifier "
        "deployment kepada client."
    ))
    story.append(Spacer(1, 6))

    story.append(make_callout(
        "Keputusan Arsitektur Inti",
        ["Bangun sebagai <b>modular monolith dengan worker terpisah</b> pada tahap awal. Desain domain, database RLS, dan outbox "
         "event dibuat siap dipisah menjadi service mandiri jika beban atau skala organisasi menuntut, tanpa membayar kompleksitas "
         "microservices terlalu dini."],
        kind="info"
    ))
    story.append(Spacer(1, 6))

    baseline_headers = ["Area", "Keputusan baseline", "Alasan"]
    baseline_rows = [
        ["Backend", "FastAPI + SQLAlchemy async", "Kuat untuk asynchronous I/O, AI orchestration, Pydantic type safety, dan background integration."],
        ["Database", "PostgreSQL + pgvector", "Transaksi bisnis relasional dan vector search berada dalam satu fondasi ACID operasional yang konsisten."],
        ["Multi-tenant", "Shared DB/shared schema + tenant_id + RLS", "Efisien untuk MVP, isolasi kuat melalui Postgres Row-Level Security, mudah dioperasikan."],
        ["Auth", "OIDC/password + JWT 15 min + rotating refresh 7d", "Standar aman untuk dashboard web, mobile, dan integrasi API; dilengkapi token family reuse detection."],
        ["Workflow", "LangGraph + deterministic rules", "Stateful graph, branching, checkpointing, pause/resume, retry, typed tool calls, dan human-in-the-loop."],
        ["Async Queue", "Redis streams/queue + worker pools", "Webhook ingress, ingestion dokumen, outbound delivery, analytics, dan retry tidak memblokir API."],
        ["Real-Time", "WebSocket & SSE via Redis Pub/Sub", "Dispatch instan percakapan masuk, status pesan, dan AI draft suggestion ke dashboard agen (<300ms)."],
        ["Chat Debounce", "Redis sliding window buffer (3-5 detik)", "Mencegah duplikasi pemicuan AI workflow saat pengguna mengirim chat beruntun (multi-bubble burst)."],
        ["PDF standard", "PyMuPDF text extraction", "Cepat dan hemat biaya untuk PDF digital yang memiliki text layer bawaan."],
        ["PDF high accuracy", "Gemini Embedding 2 (Internal)", "Mempertahankan konteks visual dokumen, layout tabel/diagram, dan representasi multimodal untuk retrieval."],
        ["Model confidentiality", "Public aliases only (standard, high_accuracy)", "Client hanya melihat capability dan status; provider/model binding tetap terisolasi di server."],
        ["Frontend", "Next.js + TanStack Query + Zustand", "Server state dan UI state dipisahkan secara jelas; optimistik UI untuk pengalaman chat agen responsif."]
    ]
    story.append(make_table(baseline_headers, baseline_rows, [95, 160, USABLE_WIDTH - 255]))
    story.append(Spacer(1, 8))

    story.append(h2("Sasaran v1"))
    story.append(p("• <b>Omnichannel inbox:</b> Percakapan dari WhatsApp Cloud API, Instagram/Facebook, dan web chat masuk ke satu unified inbox."))
    story.append(p("• <b>Unified customer profile:</b> Identitas lintas channel digabung menjadi profil kontak/lead tunggal per tenant."))
    story.append(p("• <b>AI-assisted response:</b> Jawaban memakai knowledge tenant dengan grounding citation internal dan confidence scoring threshold."))
    story.append(p("• <b>Automation:</b> Trigger, condition, action, wait, human approval, team assignment, dan outbound webhook."))
    story.append(p("• <b>Human handoff:</b> Agen mengambil alih thread, melihat konteks lengkap percakapan, mengedit draft saran AI, lalu mengirim jawaban."))
    story.append(p("• <b>Real-time synchronization:</b> Agen menerima pesan baru dan notifikasi SLA secara instan tanpa perlu me-refresh halaman."))
    story.append(p("• <b>Auditability:</b> Semua perubahan sensitif, mutasi data, tool calls, dan keputusan AI memiliki jejak audit permanen."))

    story.append(Spacer(1, 6))
    story.append(h2("Di Luar Scope MVP"))
    story.append(p("• Marketplace workflow publik dan plugin pihak ketiga tanpa kurasi."))
    story.append(p("• Data warehouse analitik besar dan real-time BI lintas multi-region."))
    story.append(p("• Database fisik khusus untuk setiap tenant (disediakan sebagai opsi dedicated enterprise setelah ada validasi kebutuhan)."))
    story.append(p("• Autonomous agent yang dapat melakukan tindakan finansial/transaksional tanpa human approval."))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # DAFTAR ISI
    # -------------------------------------------------------------------------
    story.append(h1("Daftar Isi"))
    story.append(Spacer(1, 6))
    toc_items = [
        "1. Konteks Produk dan Aktor",
        "2. Arsitektur Sistem dan Real-Time Ingress",
        "3. Strategi Multi-Tenant dan Penegakan RLS",
        "4. Authentication dan Authorization",
        "5. Desain Database Relasional",
        "6. Konvensi API dan Model Confidentiality",
        "7. Katalog Endpoint REST dan Real-Time Stream",
        "8. Omnichannel, Webhook, dan Inbound Debouncing",
        "9. RAG dan Knowledge Base Multi-Modal",
        "10. Workflow Automation dengan LangGraph",
        "11. Queue dan Background Jobs",
        "12. Keamanan Sistem (Security Threat Controls)",
        "13. Observability dan Analytics Tiga Pilar",
        "14. Deployment dan Topologi Infrastruktur",
        "15. Strategi Pengujian (Testing Matrix)",
        "16. Roadmap Implementasi 16 Minggu (MVP Vertical Slice)",
        "17. Definition of Done & Launch Checklist",
        "18. Lampiran Payload, SQL, dan Architectural Decision Records"
    ]
    for item in toc_items:
        story.append(Paragraph(f"<b>{item}</b>", style_normal))
        story.append(Spacer(1, 2.5))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 1: KONTEKS PRODUK DAN AKTOR
    # -------------------------------------------------------------------------
    story.append(h1("1. Konteks Produk dan Aktor"))
    story.append(h2("1.1 Domain Utama"))
    d_headers = ["Domain", "Tanggung Jawab", "Data Utama"]
    d_rows = [
        ["Identity & Tenant", "Login, session, tenant, membership, role, plan, quota", "users, tenants, memberships, roles"],
        ["Channel Gateway", "Koneksi channel, webhook ingress, outbound delivery, signature check", "channel_accounts, webhook_events"],
        ["Customer Data", "Kontak, identitas lintas channel, lead tracking, tagging", "contacts, contact_identities, leads"],
        ["Conversation", "Inbox, thread, pesan teks/media, assignment, SLA, real-time sync", "conversations, messages, assignments"],
        ["Knowledge", "Sumber data, dokumen PDF, chunk, vector embedding, retrieval", "knowledge_bases, documents, chunks"],
        ["Automation", "Definisi graph workflow, eksekusi run, step, approval human-in-the-loop", "workflows, runs, approvals"],
        ["Analytics", "Event stream, metriks agregat harian, KPI kualitas AI, token usage", "events, daily_metrics"],
        ["Billing", "Paket langganan, kuota pemakaian, usage meter, invoice record", "plans, subscriptions, usage_records"]
    ]
    story.append(make_table(d_headers, d_rows, [95, 230, USABLE_WIDTH - 325]))
    story.append(Spacer(1, 8))

    story.append(h2("1.2 Aktor dan Role Bawaan"))
    r_headers = ["Role", "Ruang Lingkup", "Kemampuan Default"]
    r_rows = [
        ["platform_admin", "Global", "Kelola seluruh tenant, plan, insiden sistem, dan support impersonation yang diaudit ketat."],
        ["owner", "Tenant", "Akses penuh konfigurasi tenant, billing, manajemen member, integrasi channel, dan data."],
        ["admin", "Tenant", "Kelola member, channel, workflow automation, knowledge base, dan analitik; tanpa transfer kepemilikan."],
        ["supervisor", "Tenant/Team", "Atur queue perpesanan, assignment agen, monitoring QA, persetujuan approval, dan laporan tim."],
        ["agent", "Tenant/Team", "Menangani conversation aktif, view profil contact, internal notes, dan approve/edit saran AI."],
        ["analyst", "Tenant", "Akses read-only laporan analitik, ekspor data terkontrol, dan audit log terbatas."],
        ["developer", "Tenant", "Kelola API key, konfigurasi webhook keluar, integrasi API teknis; tidak otomatis membaca isi pesan."],
        ["billing_admin", "Tenant", "Kelola subscription plan, riwayat invoice, monitor penggunaan kuota, dan metode pembayaran."]
    ]
    story.append(make_table(r_headers, r_rows, [90, 85, USABLE_WIDTH - 175]))
    story.append(Spacer(1, 8))

    story.append(h2("1.3 Permission Model"))
    story.append(p(
        "Permission menggunakan pola <code>resource:action</code> terstandardisasi, misalnya <code>conversations:read</code>, "
        "<code>messages:send</code>, <code>knowledge:write</code>, <code>workflows:publish</code>, <code>members:invite</code>, "
        "dan <code>billing:manage</code>. Role hanyalah kumpulan permission; scope tambahan membatasi akses pada tingkat team, "
        "inbox spesifik, atau channel tertentu."
    ))
    story.append(Spacer(1, 4))
    perm_code = (
        "# Contoh penegakan permission bertingkat pada handler\n"
        "require_permission(\"messages:send\")\n"
        "require_scope(team_id=conversation.team_id)\n"
        "require_tenant_resource(conversation.tenant_id)"
    )
    story.append(make_code_box(perm_code))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 2: ARSITEKTUR SISTEM
    # -------------------------------------------------------------------------
    story.append(h1("2. Arsitektur Sistem"))
    story.append(p(
        "Orbit Trace dirancang menggunakan pola <b>Modular Monolith</b> dengan decoupling asynchronous melalui Redis Stream/Queue "
        "dan Transactional Outbox pattern. Pola ini memberikan kesederhanaan deployment pada tahap awal tanpa mengorbankan "
        "ketahanan skala di masa depan."
    ))
    story.append(Spacer(1, 6))

    story.append(h2("2.1 Prinsip Arsitektur"))
    story.append(p("• <b>Modular Monolith First:</b> Satu codebase backend dengan batasan modul terisolasi ketat, satu transaction boundary, dan proses worker terpisah."))
    story.append(p("• <b>Event-Driven at Boundaries:</b> Peristiwa penting ditulis ke outbox table dalam transaksi yang sama dengan entitas bisnis, lalu diproses worker asinkron."))
    story.append(p("• <b>Stateless API:</b> Instance FastAPI sepenuhnya stateless dan dapat diskalakan horizontal di balik load balancer; tidak ada session state di memori proses."))
    story.append(p("• <b>Real-Time Push via Redis Pub/Sub:</b> Percakapan masuk dan saran AI disalurkan secara instan ke browser agen melalui koneksi WebSocket/SSE terkelola."))
    story.append(p("• <b>Inbound Debouncing:</b> Pesan chat beruntun dari pengguna WhatsApp/sosmed diakumulasi dalam sliding window buffer sebelum memicu pipeline RAG."))
    story.append(p("• <b>Idempotent Integrations:</b> Seluruh endpoint webhook dan background job menerapkan idempotency key untuk mencegah pemrosesan ganda."))
    story.append(p("• <b>Tenant Isolation by Default:</b> Semua query, cache key, object storage key, queue payload, dan telemetry log terikat erat dengan tenant_id."))
    story.append(p("• <b>Provider Abstraction:</b> Channel messaging, model LLM, engine embedding, dan object storage dibungkus adapter interface seragam."))

    story.append(Spacer(1, 6))
    story.append(h2("2.2 Struktur Aplikasi Backend"))
    tree_text = (
        "app/\n"
        "  api/v1/             # Router, endpoint definition, request/response Pydantic schemas\n"
        "  core/               # App configuration, security, tenant context middleware, exceptions\n"
        "  modules/            # Domain modules terisolasi (business logic & repositories)\n"
        "    identity/         # Users, authentications, sessions, memberships, RBAC rules\n"
        "    tenants/          # Tenant lifecycle, settings, quota, plans, and entitlements\n"
        "    channels/         # Omnichannel connectors (WhatsApp, IG, Web), webhook ingress\n"
        "    contacts/         # Unified contacts, identity mapping, leads, custom tags\n"
        "    conversations/    # Inboxes, message threads, human assignment, SLA, realtime\n"
        "    knowledge/        # Document ingestion, PyMuPDF, chunking, pgvector retrieval\n"
        "    workflows/        # LangGraph state graphs, node registry, human approvals\n"
        "    analytics/        # Operational events, daily aggregations, AI quality metrics\n"
        "    billing/          # Subscription tracking, usage meters, webhook invoicing\n"
        "  infrastructure/     # Adapter eksternal (db, redis, queue, storage, llm, realtime, telemetry)\n"
        "  workers/            # Worker processes: messaging, ingestion, workflow runner, debouncer\n"
        "  tests/              # Unit tests, integration tests, RLS tenant-isolation test suite"
    )
    story.append(make_code_box(tree_text))
    story.append(Spacer(1, 6))

    story.append(h2("2.3 Runtime Components"))
    rt_headers = ["Komponen", "Proses Runtime", "Scaling Key", "Catatan Arsitektur"]
    rt_rows = [
        ["API Gateway", "uvicorn / gunicorn", "CPU, latency, RPS", "REST API, autentikasi, dashboard endpoints, presigned upload URLs."],
        ["Real-Time WS", "FastAPI WebSocket / SSE", "Concurrent open connections", "Menerima event dari Redis Pub/Sub dan mem-broadcast ke browser agen."],
        ["Webhook Ingress", "FastAPI ingress route", "Inbound events / sec", "Verifikasi signature cepat (<200ms), persist ke DB, dan enqueue job."],
        ["Debounce Worker", "Redis delayed worker", "Active burst sessions", "Buffer sliding window 3-5 detik untuk mengonsolidasi chat multi-bubble."],
        ["Messaging Worker", "Worker pool (Celery/ARQ)", "Outbound rate per channel", "Menerapkan provider rate limit, exponential backoff, dan dead-letter."],
        ["Ingestion Worker", "Worker pool terisolasi", "Document pages / tokens", "Ekstraksi PyMuPDF, visual chunking, multimodal embedding, atomic swap."],
        ["Workflow Worker", "LangGraph runner", "Concurrent workflow runs", "Eksekusi state graph, evaluasi kondisi, pause approval, dan checkpoint."],
        ["Scheduler", "Single leader process", "Cron scheduled intervals", "Evaluasi SLA breach, follow-up timeouts, agregasi analitik, data retention."],
        ["PostgreSQL", "Primary + Read Replica", "Connection pool & IOPS", "Menyimpan data relasional + pgvector HNSW index. PgBouncer wajib."],
        ["Redis", "Managed Cluster / Sentinel", "Memory & Ops / sec", "Pub/Sub realtime, job queue, sliding window buffer, cache, dan rate limiting."]
    ]
    story.append(make_table(rt_headers, rt_rows, [85, 95, 95, USABLE_WIDTH - 275]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 3: STRATEGI MULTI-TENANT & RLS
    # -------------------------------------------------------------------------
    story.append(h1("3. Strategi Multi-Tenant"))
    story.append(p(
        "Orbit Trace menerapkan isolasi multi-tenant berlapis (<b>Defense in Depth</b>). Keamanan isolasi data "
        "tidak hanya bergantung pada filter aplikasi di level ORM, melainkan dijamin secara fundamental oleh "
        "PostgreSQL Row-Level Security (RLS)."
    ))
    story.append(Spacer(1, 6))

    story.append(h2("3.1 Model Tenancy"))
    story.append(p(
        "Baseline v1 menggunakan model <b>Shared Database / Shared Schema</b>. Setiap tabel bisnis wajib memiliki "
        "kolom <code>tenant_id</code> bertipe UUID. Tabel global seperti <code>users</code> dan <code>plans</code> "
        "tidak memiliki tenant_id; asosiasi user dengan organisasi dikelola melalui tabel <code>tenant_memberships</code>."
    ))
    story.append(Spacer(1, 4))

    ten_headers = ["Pilihan Desain", "Status v1", "Justifikasi & Batasan"]
    ten_rows = [
        ["Shared DB / Shared Schema", "Default Baseline", "Sangat hemat biaya operasional, efisien dalam resource pooling, dan kuat dengan proteksi RLS."],
        ["Shared DB / Dedicated Schema", "Tidak Digunakan", "Kompleksitas migrasi skema berlipat dan membebani connection pooling tanpa manfaat isolasi sepadan."],
        ["Dedicated Database", "Enterprise Option", "Khusus tier enterprise dengan persyaratan kepatuhan data ketat (data residency) atau volume masif."]
    ]
    story.append(make_table(ten_headers, ten_rows, [120, 95, USABLE_WIDTH - 215]))
    story.append(Spacer(1, 6))

    story.append(h2("3.2 Resolusi Tenant dan Penegakan RLS"))
    story.append(p("1. Access token diverifikasi pada layer gateway dan mengekstrak <code>user_id</code> serta <code>active_tenant_id</code>."))
    story.append(p("2. Validasi status membership user pada tenant aktif. Status diverifikasi dari cache terinvalidasi."))
    story.append(p("3. <code>TenantContext</code> diinjeksikan ke dalam request context; <code>tenant_id</code> dari query string atau request body dilarang menjadi otoritas."))
    story.append(p("4. Database session mengeksekusi <code>SET LOCAL app.current_tenant_id = '&lt;uuid&gt;'</code> pada awal setiap transaksi."))
    story.append(p("5. PostgreSQL RLS dengan klausul <code>FORCE</code> secara otomatis memfilter seluruh query SELECT, UPDATE, dan DELETE."))

    story.append(Spacer(1, 4))
    rls_sql = (
        "ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;\n"
        "ALTER TABLE conversations FORCE ROW LEVEL SECURITY;\n\n"
        "CREATE POLICY tenant_isolation_conversations ON conversations\n"
        "USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)\n"
        "WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true)::uuid);"
    )
    story.append(make_code_box(rls_sql))
    story.append(Spacer(1, 6))

    story.append(h2("3.2.1 Mitigasi Connection Pooling (PgBouncer)"))
    story.append(make_callout(
        "Hardening PgBouncer Transaction Mode",
        ["Dalam arsitektur connection pooling berkinerja tinggi (PgBouncer mode <code>transaction</code>), penggunaan "
         "<code>SET app.current_tenant_id</code> dapat menyebabkan <b>kebocoran konteks antar tenant</b> jika koneksi "
         "digunakan kembali oleh request lain.<br/><br/>"
         "<b>Aturan Wajib:</b> Gunakan selalu <code>SET LOCAL</code> yang secara otomatis ter-reset saat blok transaksi "
         "berakhir (commit/rollback). Tambahkan pemeriksaan protektif di SQLAlchemy session listener untuk memastikan "
         "variabel session dibersihkan saat koneksi dikembalikan ke connection pool."],
        kind="warning"
    ))
    story.append(Spacer(1, 6))

    story.append(h2("3.3 Aturan Lintas Storage"))
    st_headers = ["Lapisan Storage", "Aturan Wajib", "Contoh Implementasi"]
    st_rows = [
        ["PostgreSQL", "tenant_id NOT NULL + FK + RLS + composite index", "UNIQUE (tenant_id, external_id)"],
        ["Redis", "Semua key wajib memiliki namespace tenant_id", "tenant:{tenant_id}:rate:wa:{channel_id}"],
        ["Async Queue", "Payload wajib menyertakan tenant_id; divalidasi ulang di worker", "{\"tenant_id\": \"...\", \"job_type\": \"...\"}"],
        ["Object Storage", "Prefix tenant_id terisolasi dan presigned URL singkat", "tenant/{tenant_id}/docs/{doc_id}/source.pdf"],
        ["Vector Search", "Filter tenant_id wajib dieksekusi sebelum similarity order", "WHERE tenant_id = :tid AND kb_id = :kbid"],
        ["Logs & Traces", "Structured attribute tenant_id; masking seluruh data PII", "{\"tenant_id\": \"...\", \"request_id\": \"...\"}"]
    ]
    story.append(make_table(st_headers, st_rows, [95, 185, USABLE_WIDTH - 280]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 4: AUTHENTICATION & AUTHORIZATION
    # -------------------------------------------------------------------------
    story.append(h1("4. Authentication dan Authorization"))
    story.append(h2("4.1 Metode Login"))
    auth_headers = ["Metode", "Use Case", "Kontrol Keamanan"]
    auth_rows = [
        ["Email + Password", "Owner / Admin / Staff Agent", "Argon2id hashing, verifikasi email, rate limit ketat, breached-password check."],
        ["Google OIDC", "Login Cepat Dashboard", "PKCE standard, state & nonce validation, automatic verified email matching."],
        ["Enterprise SAML/SSO", "Pelanggan Korporasi (Fase v2)", "Domain claim verification, JIT provisioning terisolasi, enforced tenant SSO."],
        ["API Key", "Integrasi Server-to-Server", "Tenant-scoped, SHA-256 hashed at rest, prefix terlihat (ot_live_...), expiry date."],
        ["Service Account", "Integrasi Sistem Internal", "Short-lived JWT, workload identity least privilege, internal rotation."]
    ]
    story.append(make_table(auth_headers, auth_rows, [110, 140, USABLE_WIDTH - 250]))
    story.append(Spacer(1, 6))

    story.append(h2("4.2 Manajemen Token dan Session"))
    tok_headers = ["Artefak", "TTL", "Penyimpanan Client", "Karakteristik Teknis"]
    tok_rows = [
        ["Access Token", "15 Menit", "HttpOnly Secure Cookie (Web) / Bearer (API)", "JWT RS256/EdDSA, memuat user_id, active_tenant_id, roles, session_id."],
        ["Refresh Token", "7 Hari", "HttpOnly Secure Cookie (SameSite=Lax)", "Opaque random string, disimpan dalam bentuk hash di DB, rotasi setiap refresh."],
        ["CSRF Token", "Per Session", "Readable Cookie + Header X-CSRF-Token", "Wajib divalidasi pada seluruh mutasi HTTP berbasis cookie."],
        ["API Key", "Configurable", "Client Authorization Header", "Diberikan sekali saat pembuatan; dapat dicabut sewaktu-waktu oleh admin."]
    ]
    story.append(make_table(tok_headers, tok_rows, [85, 75, 130, USABLE_WIDTH - 290]))
    story.append(Spacer(1, 6))

    story.append(make_callout(
        "Deteksi Penggunaan Ulang Refresh Token (Reuse Detection)",
        ["Jika refresh token yang sudah dirotasi digunakan kembali oleh client, sistem menandai <b>token family sebagai compromised</b>, "
         "mencabut seluruh session aktif dalam keluarga token tersebut, mencatat security audit log berprioritas tinggi, dan mewajibkan pengguna login ulang."],
        kind="warning"
    ))
    story.append(Spacer(1, 6))

    story.append(h2("4.3 JWT Claims Payload"))
    jwt_sample = (
        "{\n"
        "  \"iss\": \"https://api.orbittrace.id\",\n"
        "  \"aud\": \"orbit-trace-web\",\n"
        "  \"sub\": \"usr_0199a4c5-8e2b-7000-8000-000000000001\",\n"
        "  \"sid\": \"ses_0199a4c5-8e2b-7000-8000-000000000002\",\n"
        "  \"tid\": \"ten_0199a4c5-8e2b-7000-8000-000000000003\",\n"
        "  \"roles\": [\"agent\"],\n"
        "  \"ver\": 1,\n"
        "  \"jti\": \"tok_0199a4c5-8e2b-7000-8000-000000000004\",\n"
        "  \"iat\": 1789556400,\n"
        "  \"exp\": 1789557300\n"
        "}"
    )
    story.append(make_code_box(jwt_sample))
    story.append(Spacer(1, 4))
    story.append(p(
        "<i>Catatan:</i> Role di dalam token hanya berfungsi sebagai optimasi routing UI. Otorisasi aksi sensitif "
        "wajib divalidasi langsung ke cache/database untuk memastikan status keanggotaan belum dicabut."
    ))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 5: DESAIN DATABASE
    # -------------------------------------------------------------------------
    story.append(h1("5. Desain Database"))
    story.append(h2("5.1 Standar Kolom Entitas"))
    col_headers = ["Kolom Standar", "Tipe Data", "Aturan & Konvensi"]
    col_rows = [
        ["id", "uuid", "UUIDv7 (time-ordered) untuk index B-tree efisien; primary key pada seluruh tabel."],
        ["tenant_id", "uuid", "Wajib NOT NULL pada semua tabel milik tenant; Foreign Key ke tenants.id; penegakan RLS."],
        ["created_at", "timestamptz", "Waktu pembuatan record dalam UTC; default timezone-aware now()."],
        ["updated_at", "timestamptz", "Waktu update terakhir dalam UTC; diperbarui otomatis via database trigger."],
        ["deleted_at", "timestamptz nullable", "Soft-delete hanya untuk entitas bisnis utama yang membutuhkan pemulihan (retention window)."],
        ["version", "integer", "Optimistic concurrency locking untuk konfigurasi, draft workflow, dan dokumen."],
        ["metadata", "jsonb", "Atribut ekstensi kustom; dilarang menggantikan kolom terindeks."]
    ]
    story.append(make_table(col_headers, col_rows, [85, 95, USABLE_WIDTH - 180]))
    story.append(Spacer(1, 6))

    story.append(h2("5.2 Schema: Identity, Tenancy, dan Billing"))
    db1_headers = ["Nama Tabel", "Kolom Kunci", "Constraint & Indeks Utama"]
    db1_rows = [
        ["users", "id, email, password_hash, display_name, status, token_version", "UNIQUE (lower(email))"],
        ["tenants", "id, slug, name, status, timezone, locale, data_region, settings", "UNIQUE (slug)"],
        ["tenant_memberships", "tenant_id, user_id, status, joined_at, last_seen_at", "UNIQUE (tenant_id, user_id)"],
        ["roles", "id, tenant_id nullable, code, name, is_system", "UNIQUE (tenant_id, code)"],
        ["permissions", "id, code, description", "UNIQUE (code)"],
        ["role_permissions", "role_id, permission_id", "Composite PK (role_id, permission_id)"],
        ["membership_roles", "membership_id, role_id, scope_json", "Composite PK (membership_id, role_id)"],
        ["invitations", "tenant_id, email, token_hash, role_ids, expires_at", "Index (tenant_id, email) where active"],
        ["auth_sessions", "user_id, active_tenant_id, ip_hash, ua_hash, expires_at", "Index (user_id, expires_at)"],
        ["refresh_tokens", "session_id, family_id, token_hash, expires_at, revoked_at", "UNIQUE (token_hash)"],
        ["api_keys", "tenant_id, name, key_prefix, secret_hash, permissions, expires_at", "UNIQUE (key_prefix)"],
        ["plans", "code, name, limits, entitlements, price_metadata", "Global configuration table"],
        ["subscriptions", "tenant_id, plan_id, status, period_start, period_end", "One active record per tenant"],
        ["usage_records", "tenant_id, metric, quantity, occurred_at, source_id", "Idempotent source_id tracking"]
    ]
    story.append(make_table(db1_headers, db1_rows, [110, 225, USABLE_WIDTH - 335]))
    story.append(Spacer(1, 6))

    story.append(h2("5.3 Schema: Customer, Channel, dan Conversation"))
    db2_headers = ["Nama Tabel", "Kolom Kunci", "Constraint & Indeks Utama"]
    db2_rows = [
        ["channel_accounts", "tenant_id, provider, external_account_id, name, status, credentials_ref", "UNIQUE (tenant_id, provider, external_account_id)"],
        ["webhook_events", "tenant_id, provider, external_event_id, payload_ref, status, received_at", "UNIQUE (provider, external_event_id)"],
        ["contacts", "tenant_id, display_name, email, phone_e164, company_id, attributes", "Index (tenant_id, phone_e164), Index (tenant_id, email)"],
        ["contact_identities", "tenant_id, contact_id, provider, external_user_id, username", "UNIQUE (tenant_id, provider, external_user_id)"],
        ["inboxes", "tenant_id, name, team_id, sla_policy_id", "UNIQUE (tenant_id, name)"],
        ["conversations", "tenant_id, inbox_id, contact_id, channel_account_id, status, assigned_to", "Index (tenant_id, inbox_id, status, last_message_at DESC)"],
        ["messages", "tenant_id, conversation_id, external_msg_id, direction, sender_type, body", "UNIQUE (channel_account_id, external_msg_id)"],
        ["message_attachments", "tenant_id, message_id, object_key, mime_type, size, sha256", "Index (tenant_id, message_id)"],
        ["conversation_notes", "tenant_id, conversation_id, author_id, body, visibility", "Index (tenant_id, conversation_id, created_at)"]
    ]
    story.append(make_table(db2_headers, db2_rows, [115, 220, USABLE_WIDTH - 335]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 5.4 - 5.6: KNOWLEDGE, WORKFLOW & REFERENTIAL RULES
    # -------------------------------------------------------------------------
    story.append(h2("5.4 Schema: Knowledge dan RAG"))
    rag_headers = ["Nama Tabel", "Kolom Kunci", "Constraint & Indeks Utama"]
    rag_rows = [
        ["knowledge_bases", "tenant_id, name, description, public_ingestion_profile, status", "UNIQUE (tenant_id, name)"],
        ["data_sources", "tenant_id, kb_id, type, config_ref, sync_mode, last_synced_at", "Index (tenant_id, kb_id, status)"],
        ["documents", "tenant_id, kb_id, source_id, title, mime_type, object_key, checksum", "UNIQUE (tenant_id, kb_id, checksum) where active"],
        ["document_versions", "tenant_id, document_id, version_no, object_key, parsed_text_ref", "UNIQUE (tenant_id, document_id, version_no)"],
        ["document_chunks", "tenant_id, document_id, version_id, chunk_no, content, embedding", "HNSW vector index + tenant_id/kb_id filter"],
        ["ingestion_jobs", "tenant_id, source_id, document_id, public_profile, state, attempts", "Index (tenant_id, state, scheduled_at)"],
        ["retrieval_logs", "tenant_id, conversation_id, query, chunk_ids, scores, latency_ms", "Internal telemetry only; time-partitioned"],
        ["answer_feedback", "tenant_id, message_id, rating, reason, corrected_answer", "Index (tenant_id, rating, created_at)"]
    ]
    story.append(make_table(rag_headers, rag_rows, [115, 220, USABLE_WIDTH - 335]))
    story.append(Spacer(1, 6))

    story.append(h2("5.5 Schema: Workflow, Tools, Audit, dan Real-Time"))
    wf_headers = ["Nama Tabel", "Kolom Kunci", "Constraint & Indeks Utama"]
    wf_rows = [
        ["workflows", "tenant_id, name, status, active_version_id, trigger_type", "UNIQUE (tenant_id, name)"],
        ["workflow_versions", "tenant_id, workflow_id, version_no, graph_json, published_at", "Immutable after publish"],
        ["workflow_runs", "tenant_id, workflow_id, version_id, trigger_ref, state, checkpoint_ref", "Index (tenant_id, state, created_at)"],
        ["workflow_run_steps", "tenant_id, run_id, node_key, attempt, input_ref, output_ref, status", "Index (run_id, sequence_no)"],
        ["approval_requests", "tenant_id, run_id, action_type, payload_ref, status, expires_at", "Index (tenant_id, status, expires_at)"],
        ["tool_connections", "tenant_id, provider, name, secret_ref, scopes, status", "Encrypted credentials only"],
        ["outbox_events", "tenant_id, aggregate_type, aggregate_id, event_type, payload", "Index on unpublished rows (published_at IS NULL)"],
        ["audit_logs", "tenant_id nullable, actor_type, actor_id, action, resource_id, diff", "Append-only; partitioned by month"]
    ]
    story.append(make_table(wf_headers, wf_rows, [115, 220, USABLE_WIDTH - 335]))
    story.append(Spacer(1, 6))

    story.append(h2("5.6 Aturan Integritas Relasional"))
    story.append(p("• <b>Composite Foreign Key:</b> Hubungan antar tabel tenant wajib menyertakan pasangan <code>(tenant_id, id)</code> untuk menjamin referensi lintas tenant secara fisik mustahil terjadi."))
    story.append(p("• <b>Immutability Workflow:</b> Versi workflow yang telah dipublikasikan bersifat beku (immutable). Segala modifikasi wajib menghasilkan nomor versi baru."))
    story.append(p("• <b>Secret Protection:</b> Kredensial integrasi pihak ketiga dilarang disimpan dalam bentuk plaintext; hanya referensi ciphertext atau secret manager ID yang disimpan."))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 6: KONVENSI API & MODEL CONFIDENTIALITY
    # -------------------------------------------------------------------------
    story.append(h1("6. Konvensi API dan Model Confidentiality"))
    story.append(h2("6.1 Standar Protokol API"))
    api_headers = ["Aspek", "Standar yang Diterapkan", "Detail Spesifikasi"]
    api_rows = [
        ["Base URL", "/api/v1", "Semua route publik berada di bawah prefix versi API v1."],
        ["Payload Format", "JSON UTF-8", "Header Content-Type: application/json; multipart hanya untuk presigned upload negotiation."],
        ["Naming Convention", "kebab-case path, snake_case JSON", "Contoh: /api/v1/knowledge-bases, field: customer_phone_number."],
        ["Date & Time", "ISO-8601 UTC", "Contoh: 2026-09-16T10:15:30Z; semua serialisasi waktu berbasis UTC."],
        ["Pagination", "Cursor-based", "Query params limit, after; response menyertakan page_info.next_cursor dan has_more."],
        ["Error Handling", "RFC 7807 (application/problem+json)", "Memuat type, title, status, code, detail, dan request_id unik."],
        ["Idempotency", "Idempotency-Key HTTP Header", "Wajib pada request POST/PATCH transaksi bisnis sensitif, pengiriman pesan, dan webhook."]
    ]
    story.append(make_table(api_headers, api_rows, [90, 160, USABLE_WIDTH - 250]))
    story.append(Spacer(1, 6))

    story.append(h2("6.2 Format Response dan Error Standar"))
    env_json = (
        "// Envelope Response Sukses (200 OK / 201 Created)\n"
        "{\n"
        "  \"data\": [{ \"id\": \"0199a4c5-8e2b-7000-8000-000000000001\", \"status\": \"open\" }],\n"
        "  \"page_info\": {\"next_cursor\": \"eyJpZCI6...\", \"has_more\": true},\n"
        "  \"meta\": { \"request_id\": \"req_0199a4c58e2b7000\" }\n"
        "}\n\n"
        "// Format Standar Error (RFC 7807 Problem Details)\n"
        "{\n"
        "  \"type\": \"https://docs.orbittrace.id/errors/permission-denied\",\n"
        "  \"title\": \"Permission Denied\",\n"
        "  \"status\": 403,\n"
        "  \"code\": \"AUTH_PERMISSION_DENIED\",\n"
        "  \"detail\": \"Aksi memerlukan permission 'messages:send' pada inbox ini.\",\n"
        "  \"request_id\": \"req_0199a4c58e2b7000\"\n"
        "}"
    )
    story.append(make_code_box(env_json))
    story.append(Spacer(1, 6))

    story.append(h2("6.3 Kontrak Kerahasiaan Model (Model Confidentiality Contract)"))
    story.append(make_callout(
        "Prinsip Abstraksi Model AI",
        ["Nama provider (Google, Meta, OpenAI), nama model teknis (Gemini 2.5 Flash, Gemini Embedding 2), versi release, "
         "dan upstream error <b>dilarang keras muncul dalam API publik, response payload, webhook keluar, error detail, maupun schema client.</b><br/><br/>"
         "Client hanya mengenal <b>Capability Profile</b> seperti <code>standard</code> dan <code>high_accuracy</code>. "
         "Seluruh binding model dikendalikan di sisi server melalui internal model registry. Hal ini mencegah perbandingan vendor "
         "oleh client dan mempermudah substitusi LLM di masa depan."],
        kind="warning"
    ))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 7: KATALOG ENDPOINT
    # -------------------------------------------------------------------------
    story.append(h1("7. Katalog Endpoint"))
    story.append(p("Baseline katalog REST API v1 dan real-time stream endpoint Orbit Trace."))
    story.append(Spacer(1, 4))

    story.append(h2("7.1 Authentication & Session"))
    e1_headers = ["Method", "Path", "Auth / Scope", "Deskripsi Fungsi"]
    e1_rows = [
        ["POST", "/auth/register", "Public", "Mendaftarkan user baru dan tenant organisasi trial."],
        ["POST", "/auth/login", "Public", "Autentikasi kredensial email/password; menerbitkan token session."],
        ["GET", "/auth/oidc/{provider}/authorize", "Public", "Memulai alur OAuth/OIDC authorization code + PKCE."],
        ["GET", "/auth/oidc/{provider}/callback", "Public", "Memvalidasi callback penyedia identitas dan link session."],
        ["POST", "/auth/refresh", "Refresh Cookie", "Memvalidasi dan merotasi refresh token; menerbitkan access token baru."],
        ["POST", "/auth/logout", "Session", "Mencabut token sesi aktif dan membersihkan cookie."],
        ["POST", "/auth/logout-all", "Session", "Menaikkan token_version untuk membatalkan seluruh sesi aktif user."],
        ["GET", "/auth/me", "Session", "Mengambil profil pengguna, daftar membership tenant, dan role aktif."],
        ["POST", "/auth/switch-tenant", "Session", "Mengubah konteks tenant aktif dan menerbitkan access token baru."],
        ["GET", "/auth/sessions", "Session", "Melihat daftar perangkat dan sesi login aktif milik pengguna."],
        ["DELETE", "/auth/sessions/{id}", "Session", "Mencabut sesi perangkat tertentu secara spesifik."]
    ]
    story.append(make_table(e1_headers, e1_rows, [50, 165, 85, USABLE_WIDTH - 300], is_code_col=[1]))
    story.append(Spacer(1, 6))

    story.append(h2("7.2 Tenant, Membership & RBAC"))
    e2_headers = ["Method", "Path", "Auth / Scope", "Deskripsi Fungsi"]
    e2_rows = [
        ["GET", "/tenants/current", "Member", "Mengambil detail organisasi aktif, paket aktif, dan kuota pemakaian."],
        ["PATCH", "/tenants/current", "tenant:manage", "Mengubah pengaturan nama, timezone, locale, dan metadata tenant."],
        ["GET", "/members", "members:read", "Mengambil daftar seluruh anggota organisasi dengan filter status/tim."],
        ["POST", "/members/invitations", "members:invite", "Mengirimkan undangan bergabung via email beserta penetapan role."],
        ["POST", "/members/invitations/{token}/accept", "User", "Menerima undangan organisasi dan mengaktifkan membership."],
        ["PATCH", "/members/{id}", "members:write", "Mengubah status anggota, assignment tim, atau batasan scope."],
        ["PUT", "/members/{id}/roles", "roles:assign", "Menetapkan custom role atau system role pada anggota."],
        ["DELETE", "/members/{id}", "members:delete", "Menghapus keanggotaan user dari organisasi secara permanen."],
        ["GET", "/roles", "roles:read", "Melihat daftar seluruh system role dan custom role yang tersedia."],
        ["POST", "/roles", "roles:write", "Membuat custom role baru dengan kombinasi granular permissions."]
    ]
    story.append(make_table(e2_headers, e2_rows, [50, 165, 85, USABLE_WIDTH - 300], is_code_col=[1]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 7 (CONT.): CHANNELS, CONTACTS, INBOX
    # -------------------------------------------------------------------------
    story.append(h2("7.3 Channels, Webhooks, dan Real-Time Ingress"))
    e3_headers = ["Method", "Path", "Auth / Scope", "Deskripsi Fungsi"]
    e3_rows = [
        ["GET", "/channels", "channels:read", "Mengambil daftar koneksi channel komunikasi aktif."],
        ["POST", "/channels/{provider}/connect", "channels:write", "Menginisialisasi konfigurasi koneksi provider (WhatsApp, IG, Web)."],
        ["GET", "/channels/{id}", "channels:read", "Melihat status kesehatan koneksi dan kuota provider channel."],
        ["PATCH", "/channels/{id}", "channels:write", "Mengubah routing default inbox, webhook secret, atau parameter operasional."],
        ["POST", "/channels/{id}/test", "channels:write", "Melakukan uji konektivitas dan validasi kredensial provider."],
        ["DELETE", "/channels/{id}", "channels:delete", "Memutuskan hubungan koneksi channel komunikasi."],
        ["GET", "/webhooks/{provider}", "Provider Challenge", "Endpoint verifikasi challenge handshake Meta / WhatsApp Cloud API."],
        ["POST", "/webhooks/{provider}", "Provider Signature", "Menerima event inbound pesan/status, validasi HMAC, simpan & enqueue."]
    ]
    story.append(make_table(e3_headers, e3_rows, [50, 165, 95, USABLE_WIDTH - 310], is_code_col=[1]))
    story.append(Spacer(1, 6))

    story.append(h2("7.4 Contacts, Companies & Leads"))
    e4_headers = ["Method", "Path", "Auth / Scope", "Deskripsi Fungsi"]
    e4_rows = [
        ["GET", "/contacts", "contacts:read", "Pencarian dan filter daftar kontak pelanggan berdasarkan nomor/email/tag."],
        ["POST", "/contacts", "contacts:write", "Membuat kontak baru secara manual."],
        ["GET", "/contacts/{id}", "contacts:read", "Melihat 360-degree customer view, riwayat channel, dan aktivitas percakapan."],
        ["PATCH", "/contacts/{id}", "contacts:write", "Memperbarui data profil, atribut kustom, atau lifecycle contact."],
        ["POST", "/contacts/{id}/merge", "contacts:merge", "Menggabungkan dua data kontak duplikat secara aman dan tercatat di audit."],
        ["GET", "/leads", "leads:read", "Mengambil daftar pipeline penjualan dan status lead prospek."],
        ["POST", "/leads", "leads:write", "Membuat lead baru yang diasosiasikan dengan kontak pelanggan."]
    ]
    story.append(make_table(e4_headers, e4_rows, [50, 160, 85, USABLE_WIDTH - 295], is_code_col=[1]))
    story.append(Spacer(1, 6))

    story.append(h2("7.5 Inbox, Conversations, Messages & Real-Time Sync"))
    e5_headers = ["Method", "Path", "Auth / Scope", "Deskripsi Fungsi"]
    e5_rows = [
        ["GET", "/inboxes", "inboxes:read", "Mengambil daftar inbox dan kebijakan aturan routing percakapan."],
        ["GET", "/conversations", "conversations:read", "Mengambil daftar percakapan aktif berbasis kursor, filter status/assignee."],
        ["GET", "/conversations/{id}", "conversations:read", "Melihat thread percakapan, ringkasan kontak, dan status AI terkini."],
        ["PATCH", "/conversations/{id}", "conversations:write", "Mengubah status tiket (open, pending, snoozed, resolved) atau prioritas."],
        ["POST", "/conversations/{id}/claim", "conversations:claim", "Atomic self-claim: agen mengambil alih penanganan percakapan."],
        ["POST", "/conversations/{id}/handoff", "conversations:handoff", "Transfer penanganan: AI-to-human atau antar departemen tim."],
        ["GET", "/conversations/{id}/messages", "messages:read", "Riwayat pesan percakapan berbasis pagination kursor."],
        ["POST", "/conversations/{id}/messages", "messages:send", "Mengirim pesan balasan (teks/media); mendukung Idempotency-Key."],
        ["POST", "/conversations/{id}/notes", "notes:write", "Menambahkan catatan internal yang hanya terlihat oleh agen/tim."],
        ["WS", "/conversations/ws", "Session / Token", "Koneksi WebSocket dua arah untuk update thread, status pesan, dan AI draft."],
        ["GET", "/conversations/stream", "Session / SSE", "Server-Sent Events fallback untuk client yang tidak mendukung WebSocket."]
    ]
    story.append(make_table(e5_headers, e5_rows, [50, 165, 95, USABLE_WIDTH - 310], is_code_col=[1]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 7 (CONT.): KNOWLEDGE, WORKFLOW, ANALYTICS
    # -------------------------------------------------------------------------
    story.append(h2("7.6 Knowledge Base dan RAG"))
    e6_headers = ["Method", "Path", "Auth / Scope", "Deskripsi Fungsi"]
    e6_rows = [
        ["GET", "/knowledge-bases", "knowledge:read", "Melihat daftar repositori knowledge base milik tenant."],
        ["POST", "/knowledge-bases", "knowledge:write", "Membuat knowledge base baru dengan konfigurasi profile ingestion."],
        ["POST", "/knowledge-bases/{id}/documents", "knowledge:write", "Standard Ingestion: ekstraksi teks via PyMuPDF."],
        ["POST", "/knowledge-bases/{id}/ingestions/high-accuracy", "knowledge:write", "High-Accuracy Ingestion: ekstraksi multimodal via model registry internal."],
        ["GET", "/documents/{id}", "knowledge:read", "Melihat status pemrosesan dokumen, jumlah chunk, dan error."],
        ["POST", "/documents/{id}/reindex", "knowledge:write", "Menjalankan ulang parsing, chunking, dan re-embedding dokumen."],
        ["DELETE", "/documents/{id}", "knowledge:delete", "Tombstone dokumen dan menghapus seluruh embedding vector terkait."],
        ["POST", "/knowledge-bases/{id}/search", "knowledge:query", "Endpoint debug pencarian hybrid (vector + text BM25) beserta skor."],
        ["POST", "/knowledge-bases/{id}/ask", "knowledge:query", "Eksekusi Q&A independen menghasilkan jawaban berlandaskan referensi sitasi."],
        ["POST", "/messages/{id}/feedback", "feedback:write", "Menyimpan evaluasi akurasi jawaban AI (jempol/revisi teks)."]
    ]
    story.append(make_table(e6_headers, e6_rows, [50, 165, 90, USABLE_WIDTH - 305], is_code_col=[1]))
    story.append(Spacer(1, 6))

    story.append(h2("7.7 Workflow Automation, Approvals & Tool Execution"))
    e7_headers = ["Method", "Path", "Auth / Scope", "Deskripsi Fungsi"]
    e7_rows = [
        ["GET", "/workflows", "workflows:read", "Melihat daftar alur otomatisasi yang terkonfigurasi."],
        ["POST", "/workflows", "workflows:write", "Membuat draft definisi workflow baru."],
        ["PATCH", "/workflows/{id}", "workflows:write", "Memperbarui graph_json logika workflow."],
        ["POST", "/workflows/{id}/validate", "workflows:write", "Validasi skema node, deteksi cycle tanpa akhir, dan kepatuhan tool."],
        ["POST", "/workflows/{id}/publish", "workflows:publish", "Membekukan versi graph menjadi versi immutable baru yang siap aktif."],
        ["POST", "/workflows/{id}/activate", "workflows:publish", "Mengaktifkan versi terbitan tertentu sebagai trigger aktif."],
        ["GET", "/workflow-runs", "workflows:read", "Monitoring riwayat eksekusi workflow, durasi, dan status."],
        ["GET", "/workflow-runs/{id}", "workflows:read", "Detail jejak node per node, timeline, input, dan output dari run tertentu."],
        ["GET", "/approvals", "approvals:read", "Inbox persetujuan aksi kritis yang sedang menunggu otorisasi supervisor."],
        ["POST", "/approvals/{id}/approve", "approvals:decide", "Menyetujui payload aksi yang ditangguhkan dan melanjutkan workflow."],
        ["POST", "/approvals/{id}/reject", "approvals:decide", "Menolak eksekusi aksi berisiko beserta alasan penolakan."]
    ]
    story.append(make_table(e7_headers, e7_rows, [50, 165, 95, USABLE_WIDTH - 310], is_code_col=[1]))
    story.append(Spacer(1, 6))

    story.append(h2("7.8 Analytics, Billing, Audit & Developer API"))
    e8_headers = ["Method", "Path", "Auth / Scope", "Deskripsi Fungsi"]
    e8_rows = [
        ["GET", "/analytics/overview", "analytics:read", "Ringkasan metrik volume pesan, kecepatan respon (FRT), dan resolusi."],
        ["GET", "/analytics/ai-quality", "analytics:read", "Evaluasi AI: tingkat defleksi, rata-rata skor confidence, feedback rating."],
        ["GET", "/billing/subscription", "billing:read", "Detail kuota percakapan bulanan, token RAG, dan siklus tagihan."],
        ["GET", "/audit-logs", "audit:read", "Pencarian jejak audit forensik menurut aktor, rentang waktu, dan aksi."],
        ["GET", "/api-keys", "api_keys:read", "Melihat daftar API Key aktif, scope akses, dan waktu penggunaan terakhir."],
        ["POST", "/api-keys", "api_keys:write", "Menerbitkan API Key baru (secret token hanya ditampilkan sekali)."],
        ["DELETE", "/api-keys/{id}", "api_keys:write", "Mencabut akses API Key secara permanen."]
    ]
    story.append(make_table(e8_headers, e8_rows, [50, 160, 85, USABLE_WIDTH - 295], is_code_col=[1]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 8: OMNICHANNEL, WEBHOOK & DEBOUNCING
    # -------------------------------------------------------------------------
    story.append(h1("8. Omnichannel, Webhook, dan Inbound Debouncing"))
    story.append(p(
        "Gateway omnichannel bertugas menyerap pesan dari berbagai channel pihak ketiga dengan karakteristik payload yang berbeda, "
        "menstandardisasinya menjadi model event tunggal, dan menjamin keandalan pengiriman pesan baik inbound maupun outbound."
    ))
    story.append(Spacer(1, 6))

    story.append(h2("8.1 Normalized Event Model"))
    norm_event = (
        "{\n"
        "  \"event_id\": \"evt_0199a4c5-8e2b-7000-8000-000000000010\",\n"
        "  \"tenant_id\": \"ten_0199a4c5-8e2b-7000-8000-000000000003\",\n"
        "  \"provider\": \"whatsapp\",\n"
        "  \"channel_account_id\": \"cha_0199a4c5-8e2b-7000-8000-000000000020\",\n"
        "  \"event_type\": \"message.received\",\n"
        "  \"external_message_id\": \"wamid.HBgLM...\",\n"
        "  \"sender\": {\n"
        "    \"external_id\": \"6281234567890\",\n"
        "    \"display_name\": \"Budi Santoso\"\n"
        "  },\n"
        "  \"message\": {\n"
        "    \"type\": \"text\",\n"
        "    \"text\": \"Halo, apakah unit tipe 36 di Cluster B masih tersedia?\",\n"
        "    \"attachments\": []\n"
        "  },\n"
        "  \"occurred_at\": \"2026-09-16T10:15:30Z\"\n"
        "}"
    )
    story.append(make_code_box(norm_event))
    story.append(Spacer(1, 6))

    story.append(h2("8.2 Inbound Flow & 8.2.1 Inbound Message Debouncing Pattern"))
    story.append(p(
        "Pada aplikasi pesan instan seperti WhatsApp dan DM Instagram, pengguna sering kali mengirimkan <b>beberapa pesan pendek "
        "beruntun (multi-bubble burst)</b> dalam hitungan detik (contoh: <i>'Halo min'</i> disusul <i>'Mau tanya'</i> lalu <i>'Harga unit berapa?'</i>). "
        "Jika setiap pesan langsung memicu LangGraph dan RAG, akan terjadi 3 eksekusi terpisah yang memboroskan token LLM "
        "dan menghasilkan jawaban parsial yang membingungkan."
    ))
    story.append(Spacer(1, 4))

    story.append(make_callout(
        "Spesifikasi Debounce Buffer (Redis Sliding Window)",
        ["1. <b>Instant Webhook Ingress:</b> Webhook masuk divalidasi signature-nya, disimpan ke <code>webhook_events</code>, dan di-ACK (&lt;200ms).<br/>"
         "2. <b>Persist Messages:</b> Seluruh pesan tetap langsung disimpan ke tabel <code>messages</code> dan dikirim ke dashboard agen via WebSocket secara instan.<br/>"
         "3. <b>Debounce Windowing:</b> Job automasi AI tidak langsung dipicu. Sistem menetapkan sliding window di Redis selama <b>3–5 detik</b> terikat pada <code>conversation_id</code>.<br/>"
         "4. <b>Accumulation:</b> Jika ada pesan lanjutan sebelum timer habis, timer di-reset dan teks diakumulasi ke dalam buffer percakapan.<br/>"
         "5. <b>Consolidated Dispatch:</b> Setelah jeda mengetik pengguna terpenuhi (idle &gt; 4s), satu task konsolidasi dikirim ke <code>workflow.run</code>."],
        kind="info"
    ))
    story.append(Spacer(1, 6))

    story.append(h2("8.3 Outbound Flow"))
    story.append(p("1. Request outbound diterima dengan <code>Idempotency-Key</code>; validasi hak akses agen, kuota tenant, dan consent 24-hour messaging window."))
    story.append(p("2. Record pesan dibuat di tabel <code>messages</code> dengan status <code>queued</code>, dan event ditulis ke <code>outbox_events</code> dalam transaksi yang sama."))
    story.append(p("3. Messaging worker mengambil job outbox, menerapkan rate limiting per-channel, dan memanggil API provider resmi."))
    story.append(p("4. Status pesan diperbarui menjadi <code>sent</code>, <code>delivered</code>, atau <code>read</code> saat callback provider diterima."))
    story.append(p("5. Retry otomatis dengan exponential backoff dan jitter untuk kegagalan sementara; kegagalan permanen dialihkan ke Dead-Letter Queue (DLQ)."))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 9: RAG DAN KNOWLEDGE BASE
    # -------------------------------------------------------------------------
    story.append(h1("9. RAG dan Knowledge Base"))
    story.append(h2("9.1 Public Ingestion Profiles vs Internal Model Registry"))
    story.append(p(
        "Arsitektur RAG memisahkan secara tegas antara <b>kontrak kapabilitas publik</b> yang dilihat oleh pengguna "
        "dan <b>model engine internal</b> yang dioperasikan tim platform."
    ))
    story.append(Spacer(1, 4))

    rag_prof_headers = ["Capability Profile", "Pipeline Teknis", "Peruntukan Dokumen & Karakteristik"]
    rag_prof_rows = [
        ["standard", "PyMuPDF -> text normalize -> semantic chunking -> vector embedding", "Default berbiaya rendah untuk PDF digital dengan text layer rapi. Jika teks tidak memadai (&lt; threshold), sistem menandai 'needs_high_accuracy'."],
        ["high_accuracy", "Page-aware multimodal parsing -> visual layout preservation -> multimodal vector embedding", "Khusus dokumen hasil scan, brosur properti berkatalog, denah unit, diagram alir, atau PDF berkualitas text-layer buruk. Latency pemrosesan lebih tinggi."]
    ]
    story.append(make_table(rag_prof_headers, rag_prof_rows, [95, 175, USABLE_WIDTH - 270]))
    story.append(Spacer(1, 6))

    story.append(h2("Internal Model Registry (Server-Side Isolation)"))
    reg_headers = ["Kapabilitas Internal", "Implementasi Model Aktif", "Kontrak Publik Terbuka"]
    reg_rows = [
        ["Standard PDF Extraction", "PyMuPDF library (native C)", "standard"],
        ["High-Accuracy Ingest Embedding", "Gemini Embedding 2 (gemini-embedding-2)", "high_accuracy"],
        ["Grounded Response Generation", "Gemini 2.5 Flash (gemini-2.5-flash)", "Internal server binding; tidak ada nama model di client"]
    ]
    story.append(make_table(reg_headers, reg_rows, [130, 200, USABLE_WIDTH - 330]))
    story.append(Spacer(1, 6))

    story.append(h2("9.2 Pipeline Pengolahan Dokumen"))
    story.append(p("• <b>Standard Pipeline:</b> Ekstraksi teks dan bounding box blok paragraf dengan PyMuPDF. Validasi rasio kepadatan karakter (invalid-character ratio). Normalisasi struktur, pembuatan chunk berbasis semantik dengan overlap 15%, dan pembuatan vector embedding."))
    story.append(p("• <b>High-Accuracy Multimodal Pipeline:</b> Memproses halaman per batch untuk mempertahankan konteks layout tabel, label diagram denah unit, dan visual infografis dalam ruang vektor representasi dokumen yang sama."))
    story.append(p("• <b>Atomic Version Swap:</b> Seluruh versi chunk baru dipublikasikan secara atomik; versi sebelumnya dipensiunkan secara instan untuk mencegah pembacaan data campuran."))

    story.append(Spacer(1, 6))
    story.append(h2("9.3 Retrieval & Confidence Scoring Policy"))
    story.append(p(
        "Kualitas jawaban ditentukan oleh <b>Confidence Scoring Policy</b> multi-faktor, yang menggabungkan kemiripan vector, "
        "skor BM25 full-text, konsistensi sumber rujukan, dan level risiko intent yang ditanyakan:"
    ))
    story.append(Spacer(1, 4))

    conf_headers = ["Confidence Band", "Rentang Skor", "Tindakan Sistem Otomatis"]
    conf_rows = [
        ["Tinggi (High)", ">= 0.82", "Kirim auto-response langsung ke pelanggan jika topik berisiko rendah dan kebijakan tenant mengizinkan."],
        ["Sedang (Medium)", "0.60 - 0.81", "Draftkan saran jawaban di layar agen untuk direview, diedit, dan dikirim secara manual."],
        ["Rendah (Low)", "< 0.60", "Sistem tidak boleh mengarang jawaban (hallucinate); lakukan eskalasi langsung ke agen (human handoff)."]
    ]
    story.append(make_table(conf_headers, conf_rows, [95, 95, USABLE_WIDTH - 190]))
    story.append(Spacer(1, 6))

    story.append(h2("9.4 Proteksi RAG dan Prompt Injection Defense"))
    story.append(p("• Dokumen yang di-ingest dianggap sebagai data yang <b>tidak tepercaya (untrusted data)</b>; instruksi teks di dalam dokumen dilarang menimpa system instruction."))
    story.append(p("• Pembatas konteks (source boundary markers) yang ketat disematkan antara system prompt, kutipan dokumen, dan input chat user."))
    story.append(p("• Sanitasi metadata dan pembersihan link berbahaya saat dokumen di-upload."))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 10: WORKFLOW DENGAN LANGGRAPH
    # -------------------------------------------------------------------------
    story.append(h1("10. Workflow Automation dengan LangGraph"))
    story.append(p(
        "Orbit Trace mengorkestrasi logika percakapan kompleks, pemicuan tool bisnis, dan eskalasi persetujuan "
        "menggunakan state graph <b>LangGraph</b>. Runtime mengeksekusi node terdaftar yang dikendalikan platform, "
        "bukan arbitrary code dari tenant."
    ))
    story.append(Spacer(1, 6))

    story.append(h2("10.1 State Graph Baseline"))
    wf_state_code = (
        "class WorkflowState(TypedDict):\n"
        "    tenant_id: UUID\n"
        "    conversation_id: UUID\n"
        "    message_id: UUID\n"
        "    intent: str | None\n"
        "    risk_level: Literal['low', 'medium', 'high', 'critical']\n"
        "    retrieved_chunk_ids: list[UUID]\n"
        "    proposed_action: dict | None\n"
        "    approval_id: UUID | None\n"
        "    draft_response: str | None\n"
        "    next_node: str | None\n"
        "    errors: list[dict]"
    )
    story.append(make_code_box(wf_state_code))
    story.append(Spacer(1, 6))

    story.append(h2("10.2 Node Eksekusi Graph"))
    node_headers = ["Nama Node", "Tanggung Jawab Eksekusi", "Transisi Node Selanjutnya"]
    node_rows = [
        ["load_context", "Memuat data percakapan, profil kontak, kebijakan tenant, dan pesan terakhir.", "classify_intent"],
        ["classify_intent", "Mengklasifikasikan maksud pengguna, mendeteksi entitas, bahasa, dan skor risiko.", "retrieve, tool_plan, human_handoff"],
        ["retrieve", "Menjalankan pencarian hybrid pada knowledge base yang terikat tenant_id.", "compose, clarify, human_handoff"],
        ["tool_plan", "Memilih aksi tool bisnis (misal: cek jadwal survei lokasi properti) dari allowlist.", "policy_gate"],
        ["policy_gate", "Memvalidasi permission, kuota, consent pengguna, dan idempotency key.", "execute_tool, approval_pause, deny"],
        ["approval_pause", "Menyimpan checkpoint graph ke PostgreSQL dan menghentikan run menunggu approval.", "execute_tool (setelah disetujui), denied"],
        ["execute_tool", "Mengeksekusi panggilan API tool bisnis tervalidasi dan mencatat hasilnya.", "compose, compensate_failure, human_handoff"],
        ["compose", "Menyusun draft respon ter-grounding dengan rujukan sitasi dokumen.", "quality_gate"],
        ["quality_gate", "Validasi kelayakan jawaban, kesesuaian fakta, dan aturan kanal pengiriman.", "send_message, human_handoff, clarify"],
        ["send_message", "Menerbitkan perintah pengiriman pesan outbound dan mengakhiri siklus graph.", "end"]
    ]
    story.append(make_table(node_headers, node_rows, [95, 230, USABLE_WIDTH - 325]))
    story.append(Spacer(1, 6))

    story.append(h2("10.3 Human-in-the-Loop & Resiliensi Checkpoint"))
    story.append(make_callout(
        "Ketetapan Manajemen Approval dan State",
        ["• <b>Graph Checkpoint Storage:</b> Saat node <code>approval_pause</code> tercapai, seluruh state graph di-serialize dan disimpan "
         "ke tabel <code>workflow_runs</code> dengan status <code>waiting_approval</code>.<br/>"
         "• <b>Version Pinning:</b> Jika versi definisi workflow diperbarui saat ada run yang sedang tertunda (in-flight), "
         "run yang di-resume wajib tetap menggunakan definisi versi saat run dimulai untuk menjaga konsistensi state.<br/>"
         "• <b>Approval Expiration & Escalation:</b> Setiap tiket persetujuan memiliki TTL kedaluwarsa (default 24 jam). "
         "Jika melewati batas tanpa tindakan, workflow mengeksekusi fallback timeout (notifikasi eskalasi supervisor)."],
        kind="info"
    ))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 11: QUEUE DAN BACKGROUND JOBS
    # -------------------------------------------------------------------------
    story.append(h1("11. Queue dan Background Jobs"))
    story.append(p(
        "Seluruh pekerjaan asinkron dan integrasi pihak ketiga diisolasi di luar siklus request-response API "
        "melalui antrean terdistribusi berbasis Redis Streams dan worker terpisah."
    ))
    story.append(Spacer(1, 6))

    story.append(h2("11.1 Topologi Antrean"))
    q_headers = ["Nama Antrean", "Fungsi Job", "Prioritas", "Strategi Retry & Concurrency"]
    q_rows = [
        ["webhook.process", "Normalisasi payload mentah webhook pihak ketiga.", "Tinggi", "8 retries; short backoff; timeout 5 detik."],
        ["message.debounce", "Penampungan pesan chat multi-bubble beruntun.", "Tinggi", "Sliding window delay 3–5 detik per percakapan."],
        ["message.send", "Pengiriman pesan outbound ke API provider channel.", "Tinggi", "Provider-aware rate limit; exponential backoff + jitter."],
        ["realtime.broadcast", "Distribusi event chat baru ke koneksi WebSocket agen.", "Tinggi", "At-most-once; low latency pub/sub via Redis."],
        ["workflow.run", "Memulai atau melanjutkan (resume) eksekusi LangGraph.", "Normal", "Checkpoint-based retry; dead-letter on permanent failure."],
        ["knowledge.ingest", "Parsing PDF, ekstraksi, chunking, dan embedding vector.", "Rendah", "Concurrency terkontrol per tenant; kuota token terjaga."],
        ["source.sync", "Sinkronisasi periodik sumber data eksternal (Drive, Web).", "Rendah", "Distributed lock per source ID agar tidak overlap."],
        ["analytics.aggregate", "Kompilasi metrik harian, SLA tim, dan penggunaan kuota.", "Rendah", "Idempotent upsert harian; berjalan off-peak."],
        ["maintenance", "Pembersihan token kedaluwarsa, rotasi partisi, retensi.", "Jadwal", "Singleton distributed lock; waktu terjadwal."]
    ]
    story.append(make_table(q_headers, q_rows, [105, 175, 55, USABLE_WIDTH - 335]))
    story.append(Spacer(1, 6))

    story.append(h2("11.2 Pola Keandalan (Reliability Patterns)"))
    story.append(p("• <b>Transactional Outbox:</b> Perubahan database dan event pengiriman pesan ditulis dalam satu transaksi database PostgreSQL atomik. Ini mencegah kondisi race condition di mana data tersimpan namun pesan gagal terkirim."))
    story.append(p("• <b>At-Least-Once Delivery:</b> Setiap worker konsumen dirancang idempotent. Pemrosesan pesan yang sama lebih dari satu kali tidak akan menghasilkan duplikasi pengiriman ke customer."))
    story.append(p("• <b>Per-Tenant Fairness:</b> Kapasitas worker pool diatur agar tenant bervolume besar tidak memonopoli antrean dan memblokir pesan dari tenant lainnya."))
    story.append(p("• <b>Dead-Letter Queue (DLQ):</b> Pesan yang gagal diproses setelah batas maksimal percobaan dipindahkan ke DLQ dengan pencatatan kode error, tersedia untuk audit dan manual replay."))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 12: SECURITY
    # -------------------------------------------------------------------------
    story.append(h1("12. Keamanan Sistem (Security)"))
    story.append(h2("12.1 Matriks Pengendalian Ancaman (Threat Controls)"))
    sec_headers = ["Vektor Ancaman", "Dampak Potensial", "Kontrol & Mitigasi Wajib"]
    sec_rows = [
        ["Cross-tenant Data Leak", "Kebocoran data privasi pelanggan antar tenant.", "PostgreSQL RLS FORCE, tenant context enforcement, composite FK, scoped Redis keys, automated isolation linting."],
        ["Account Takeover", "Akses ilegal ke akun admin atau agen tenant.", "Argon2id hashing, optional MFA, rate limiting login progresif, audit log login, deteksi penggunaan ulang refresh token."],
        ["Webhook Forgery / Replay", "Injeksi pesan palsu seolah dari WhatsApp/Meta.", "Verifikasi cryptographic signature HMAC-SHA256, timestamp window validation, deduplikasi external_event_id."],
        ["Prompt Injection", "Manipulasi instruksi bot AI melalui dokumen atau chat.", "Untrusted document boundaries, pemisahan system marker, allowlist skema tools, grounding gating ketat."],
        ["Server-Side Request Forgery", "Eksploitasi internal network melalui fetch URL.", "IP deny-list untuk private network (RFC 1918), verifikasi resolusi DNS, isolated egress proxy."],
        ["Malicious File Upload", "Injeksi file malware atau PDF exploit.", "MIME type sniffing, batasan ukuran file, presigned URL upload, isolated parsing container."],
        ["Secret Token Leakage", "Kredensial API eksternal bocor ke publik.", "Kredensial disimpan terenkripsi di rest, masking otomatis pada log, field-level encryption untuk access token channel."],
        ["Spam / Bot Flood", "Lonjakan biaya LLM akibat bot chat berulang-ulang.", "Inbound debounce buffer, sliding rate limit per phone number, hard cap kuota token bulanan per tenant."]
    ]
    story.append(make_table(sec_headers, sec_rows, [110, 130, USABLE_WIDTH - 240]))
    story.append(Spacer(1, 6))

    story.append(h2("12.2 Baseline Rate Limiting"))
    rl_headers = ["Endpoint / Operasi", "Batas Baseline Awal", "Kunci Pembatasan (Rate Limit Key)"]
    rl_rows = [
        ["POST /auth/login", "5 percobaan / menit + progressive delay", "IP Address + Normalized Email Hash"],
        ["POST /auth/password/forgot", "3 permohonan / jam", "IP Address + Email Hash"],
        ["API Umum (Dashboard)", "120 request / menit per user", "Tenant ID + User ID"],
        ["Pengiriman Pesan Outbound", "Sesuai limit channel (default 20/detik)", "Tenant ID + Channel Account ID"],
        ["Eksekusi RAG / Ask", "60 request / menit per tenant", "Tenant ID + User / API Key"],
        ["Webhook Ingress", "Burst 100 request / detik; cap payload 5MB", "Provider Account ID + Source IP"],
        ["Ekspor Data Pelanggan", "Maksimal 2 ekspor bersamaan", "Tenant ID"]
    ]
    story.append(make_table(rl_headers, rl_rows, [140, 160, USABLE_WIDTH - 300]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 13 & 14: OBSERVABILITY & DEPLOYMENT
    # -------------------------------------------------------------------------
    story.append(h1("13. Observability dan Analytics"))
    story.append(h2("13.1 Tiga Pilar Telemetry"))
    story.append(p("• <b>Structured Logging:</b> Setiap log berformat JSON terstruktur dan wajib menyertakan <code>tenant_id</code>, <code>request_id</code>, <code>service</code>, dan <code>timestamp</code>. Password, token, kredensial, dan isi lengkap pesan sensitif dilarang masuk ke log."))
    story.append(p("• <b>Metrics:</b> Pengukuran real-time RPS, latency p95/p99, error rate per status code, kedalaman antrean Redis (queue lag), saturasi connection pool database, dan konsumsi token model LLM."))
    story.append(p("• <b>Distributed Tracing:</b> OpenTelemetry tracing melacak siklus hidup permintaan: Ingress Webhook -> Database Insert -> Enqueue Outbox -> Worker Processing -> LLM Upstream -> WebSocket Dispatch."))

    story.append(Spacer(1, 6))
    story.append(h2("13.2 Target Service Level Objectives (SLO)"))
    slo_headers = ["Alur Pengguna (Journey)", "Target SLO p95", "Metrik Indikator"]
    slo_rows = [
        ["Query Dashboard API", "< 500 ms", "HTTP latency dan error rate pada endpoint web agen."],
        ["Webhook Handshake / ACK", "< 500 ms", "Durasi penerimaan webhook hingga ACK 200/202 ke provider."],
        ["Inbound Pesan Tampil di Agen", "< 2 detik", "Waktu sejak webhook diterima hingga tampil di dashboard via WebSocket."],
        ["Outbound Pesan Terkirim", "< 3 detik", "Waktu sejak agen menekan kirim hingga terkirim ke API provider."],
        ["RAG AI Draft Generated", "< 6 detik", "Durasi pencarian retrieval, rerank, dan generasi teks model LLM."],
        ["Ketersediaan Platform (Uptime)", "99.9%", "Synthetic monitoring ketersediaan endpoint API produksi."]
    ]
    story.append(make_table(slo_headers, slo_rows, [140, 100, USABLE_WIDTH - 240]))
    story.append(Spacer(1, 6))

    story.append(h1("14. Deployment dan Infrastruktur"))
    story.append(h2("14.1 Topologi Kontainer MVP"))
    topo_text = (
        "services:\n"
        "  web:              Next.js dashboard (Node.js runtime, SSR + static assets)\n"
        "  api:              FastAPI app (2+ replicas di balik reverse proxy / load balancer)\n"
        "  ws-gateway:       FastAPI WebSocket server (real-time agent messaging dispatch)\n"
        "  worker-message:   Asynchronous worker untuk pengiriman outbound dan handling webhook\n"
        "  worker-debounce:  Sliding window message aggregator worker (Redis delay queue)\n"
        "  worker-workflow:  LangGraph state graph runner & approval resume handler\n"
        "  worker-ingest:    Document processor (PyMuPDF parser & vector embedding generation)\n"
        "  scheduler:        Cron runner untuk SLA escalation, token cleanup, & metric aggregation\n"
        "  postgres:         PostgreSQL 16 + pgvector (Managed service dengan PgBouncer pooling)\n"
        "  redis:            Redis 7+ (Managed service untuk Pub/Sub, Queue, Cache, & Debounce)\n"
        "  object-storage:   S3-compatible storage untuk lampiran media chat dan dokumen knowledge base"
    )
    story.append(make_code_box(topo_text))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 15 & 16: TESTING & ROADMAP
    # -------------------------------------------------------------------------
    story.append(h1("15. Strategi Pengujian (Testing)"))
    story.append(h2("15.1 Matriks Uji Wajib Isolasi Multi-Tenant"))
    test_headers = ["Skenario Uji", "Kondisi Eksekusi", "Hasil yang Diharapkan"]
    test_rows = [
        ["Cross-Tenant Read", "Tenant A memanggil GET ID milik Tenant B.", "HTTP 404 / 403; sistem tidak mengungkapkan keberadaan resource."],
        ["Cross-Tenant Mutation", "Tenant A mengeksekusi UPDATE/DELETE ID milik Tenant B.", "Ditolak keras oleh aplikasi dan PostgreSQL RLS WITH CHECK."],
        ["Background Job Isolation", "Worker memproses job dengan pasangan tenant/resource tidak cocok.", "Gagal seketika (Fail-closed); catat insiden keamanan pada audit."],
        ["Vector Search Leakage", "Query vector similarity tanpa menyertakan tenant_id.", "Query builder menolak eksekusi; RLS mencegah kembalinya data."],
        ["Cache Namespace Collision", "Dua tenant menyimpan kunci konfigurasi dengan nama sama.", "Terisolasi sempurna oleh prefix tenant_id di namespace Redis."],
        ["Signed URL Hijacking", "User Tenant A mencoba mengunduh presigned URL Tenant B.", "Akses ditolak oleh object storage bucket policy."]
    ]
    story.append(make_table(test_headers, test_rows, [125, 150, USABLE_WIDTH - 275]))
    story.append(Spacer(1, 6))

    story.append(h1("16. Roadmap Implementasi"))
    story.append(p(
        "Roadmap 16 minggu yang telah ditajamkan untuk tim 3–5 software engineer dengan pendekatan "
        "<b>Vertical Slice MVP</b> (prioritas stabilitas core inbox, Web Chat, dan WhatsApp Cloud API)."
    ))
    story.append(Spacer(1, 4))

    road_headers = ["Fase", "Minggu", "Deliverable Teknis Utama"]
    road_rows = [
        ["0. Arsitektur Dasar", "Minggu 1", "Setup repo, CI/CD pipeline, migrasi awal PostgreSQL + RLS foundation, config, ADR."],
        ["1. Identitas & Tenancy", "Minggu 2–3", "User auth, JWT + refresh reuse detection, RBAC permissions, PgBouncer tenant scoping."],
        ["2. Core Inbox & Web Chat", "Minggu 4–5", "Kontak, inbox, percakapan, pesan, WebSocket dispatch real-time, Web Chat widget."],
        ["3. WhatsApp & Debouncer", "Minggu 6–7", "Koneksi WhatsApp Cloud API, webhook ingress, Redis debounce buffer multi-bubble."],
        ["4. Knowledge Base & RAG", "Minggu 8–9", "Upload PDF, PyMuPDF standard ingest, pgvector retrieval, confidence scoring band."],
        ["5. Workflow & HITL", "Minggu 10–11", "LangGraph baseline, auto-response policy, approval interface human-in-the-loop."],
        ["6. Dashboard & Analitik", "Minggu 12–13", "Agent dashboard Next.js, SLA tracking, audit log interface, kuota penggunaan."],
        ["7. Hardening & Keamanan", "Minggu 14–15", "Load testing antrean burst, audit keamanan OWASP, validasi isolasi RLS, disaster recovery."],
        ["8. Pilot Deployment", "Minggu 16", "Peluncuran pilot tertutup pada 1–3 tenant terpilih, evaluasi SLO real-time, monitoring bug."]
    ]
    story.append(make_table(road_headers, road_rows, [110, 65, USABLE_WIDTH - 175]))
    story.append(Spacer(1, 6))

    story.append(h2("16.1 Prioritas Rilis"))
    story.append(p("• <b>MVP (Release 1.0):</b> Core tenancy, Web Chat + WhatsApp, Real-time Inbox, Inbound Debouncer, Standard RAG, Human Handoff, Audit Logs."))
    story.append(p("• <b>v1.1 (Next Release):</b> Instagram DM, visual workflow builder sederhana, custom tools API connector, kuota penagihan otomatis."))
    story.append(p("• <b>Enterprise (Fase Lanjutan):</b> SAML/SSO login, database terdedikasi per-tenant, kepatuhan data residency, fine-tuning custom LLM."))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 17 & 18: DEFINITION OF DONE, LAMPIRAN & ADR
    # -------------------------------------------------------------------------
    story.append(h1("17. Definition of Done & Launch Checklist"))
    story.append(p("• <b>Tenant Isolation Teruji:</b> Seluruh pengujian negatif pada matriks RLS lulus 100% pada staging environment."))
    story.append(p("• <b>Kerahasiaan Model AI Terpenuhi:</b> Snapshot test membuktikan nama vendor, nama model asli, dan upstream error tidak bocor ke client."))
    story.append(p("• <b>Debouncing Berfungsi:</b> Pengujian pengiriman 5 pesan berturut-turut dalam 3 detik terbukti hanya menghasilkan 1 kali pemicuan LangGraph."))
    story.append(p("• <b>WebSocket Failover:</b> UI agen otomatis beralih ke mode reconnect dan sinkronisasi pesan kursor tanpa kehilangan data chat."))
    story.append(p("• <b>Idempotency Terverifikasi:</b> Webhook provider yang dikirim berulang (duplicate event) tidak menghasilkan pesan ganda di database."))

    story.append(Spacer(1, 6))
    story.append(h1("18. Lampiran Teknis dan Architectural Decision Records"))
    story.append(h2("18.1 Contoh Implementasi Scoped Transaction SQLAlchemy"))
    sql_example = (
        "# Dependency Injection aman untuk FastAPI & PgBouncer transaction mode\n"
        "async def get_tenant_db_session(context: TenantContext) -> AsyncGenerator[AsyncSession, None]:\n"
        "    async with async_session_factory() as session:\n"
        "        async with session.begin():\n"
        "            # SET LOCAL menjamin nilai reset otomatis saat transaksi selesai\n"
        "            await session.execute(\n"
        "                text(\"SET LOCAL app.current_tenant_id = :tid\"),\n"
        "                {\"tid\": str(context.tenant_id)}\n"
        "            )\n"
        "            yield session"
    )
    story.append(make_code_box(sql_example))
    story.append(Spacer(1, 6))

    story.append(h2("18.2 Architectural Decision Records (ADR) Wajib"))
    adr_headers = ["Kode ADR", "Topik Keputusan Arsitektur", "Keputusan Terpilih"]
    adr_rows = [
        ["ADR-001", "Pola Arsitektur Sistem", "Modular Monolith terlebih dahulu dengan worker queue terpisah (bukan microservices)."],
        ["ADR-002", "Isolasi Multi-Tenancy", "Shared DB / Shared Schema dengan penegakan mutlak PostgreSQL Row-Level Security."],
        ["ADR-003", "Strategi Autentikasi & Token", "Kombinasi HttpOnly cookie untuk Web dashboard dan Bearer Token untuk API server-to-server."],
        ["ADR-004", "Ketahanan Komunikasi Asinkron", "Penggunaan pola Transactional Outbox yang dikombinasikan dengan Redis Queue."],
        ["ADR-005", "Penyimpanan Vektor RAG", "PostgreSQL pgvector untuk menjaga transaksi data dan vector search dalam satu ACID DB."],
        ["ADR-006", "Stateful Workflow Engine", "LangGraph state machine dengan checkpoint storage persistent di PostgreSQL."],
        ["ADR-007", "Abstraksi Provider Eksternal", "Adapter pattern seragam untuk seluruh channel perpesanan, LLM, dan storage."],
        ["ADR-008", "Jejak Audit dan Retensi", "Audit log append-only dengan partisi bulanan dan retensi data terpisah."],
        ["ADR-009", "Profil Ingest Dokumen", "Pemisahan profil standard (PyMuPDF) dan high_accuracy (multimodal embedding)."],
        ["ADR-010", "Kerahasiaan Model AI", "Penggunaan public capability alias; melarang pengungkapan identitas model ke client."],
        ["ADR-011", "Protokol Sinkronisasi Real-Time", "WebSocket primer via Redis Pub/Sub dengan fallback Server-Sent Events (SSE)."],
        ["ADR-012", "Peredam Pesan Chat (Debouncer)", "Redis sliding window buffer 3–5 detik untuk mengonsolidasi chat multi-bubble."]
    ]
    story.append(make_table(adr_headers, adr_rows, [60, 160, USABLE_WIDTH - 220]))
    story.append(Spacer(1, 6))

    story.append(h2("18.3 Rekomendasi Keputusan Final Open Questions"))
    story.append(p("1. <b>Kanal Pertama:</b> Luncurkan <b>Web Chat</b> pada fase internal testing untuk verifikasi menyeluruh, disusul <b>WhatsApp Cloud API</b> sebagai kanal utama pilot production."))
    story.append(p("2. <b>Struktur User:</b> Desain 1 user dapat memiliki banyak organisasi (membership-based multi-tenancy) sejak awal agar tidak perlu migrasi ulang."))
    story.append(p("3. <b>Penagihan Pilot:</b> Gunakan <b>manual provisioning / invite-only</b> untuk pilot 1–3 tenant awal. Tunda payment gateway otomatis hingga stabilitas fitur tercapai."))
    story.append(p("4. <b>Perlindungan Biaya:</b> Terapkan hard quota bulanan untuk pemakaian LLM agar kebal dari resiko penggelembungan biaya akibat bot looping."))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully built: {filename}")

if __name__ == "__main__":
    output_pdf = "/Users/dinaskominfo/kiken/Project/next/edusetara/Orbit_Trace_Technical_Blueprint_v1.3.pdf"
    build_pdf(output_pdf)
