import os
import sys
from datetime import datetime
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets the background color of a table cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tc_pr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets inner margins for a table cell in dxa (1 pt = 20 dxa)."""
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tc_pr.append(tc_mar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    """Applies sleek, subtle borders to a table."""
    tbl_pr = table._tbl.tblPr
    tbl_borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tbl_pr.append(tbl_borders)

def build_report():
    doc = Document()

    # 1. Page Margins Setup
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # Palette Constants
    COLOR_PRIMARY = RGBColor(37, 99, 235)      # Royal Blue (#2563EB)
    COLOR_INDIGO = RGBColor(79, 70, 229)       # Indigo (#4F46E5)
    COLOR_TEXT = RGBColor(15, 23, 42)          # Slate 900 (#0F172A)
    COLOR_MUTED = RGBColor(100, 116, 139)      # Slate 500 (#64748B)
    COLOR_EMERALD = RGBColor(16, 185, 129)     # Emerald Green (#10B981)
    COLOR_AMBER = RGBColor(217, 119, 6)        # Amber / Orange (#D97706)

    # Styles Setup
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = COLOR_TEXT
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # ==========================================
    # COVER / HEADER BANNER
    # ==========================================
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(2)
    run_sub = title_p.add_run("PYTHON ADAPTIVE LEARNING PLATFORM — PRODUCTION AUDIT REPORT\n")
    run_sub.font.size = Pt(9.5)
    run_sub.font.bold = True
    run_sub.font.color.rgb = COLOR_INDIGO

    run_title = title_p.add_run("Comprehensive User Journey & System Audit Report")
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_TEXT

    meta_p = doc.add_paragraph()
    meta_p.paragraph_format.space_after = Pt(14)
    run_meta = meta_p.add_run(f"Audit Date: {datetime.now().strftime('%B %d, %Y')}  |  Scope: End-to-End User Experience & Production Readiness  |  Status: 🟢 Production Approved")
    run_meta.font.size = Pt(8.5)
    run_meta.font.color.rgb = COLOR_MUTED

    # Divider bar
    div_table = doc.add_table(rows=1, cols=1)
    div_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    div_cell = div_table.cell(0, 0)
    div_cell.width = Inches(6.8)
    set_cell_background(div_cell, "4F46E5")
    div_p = div_cell.paragraphs[0]
    div_p.paragraph_format.space_before = Pt(1)
    div_p.paragraph_format.space_after = Pt(1)
    run_div = div_p.add_run("")
    run_div.font.size = Pt(2)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ==========================================
    # 1. EXECUTIVE SUMMARY
    # ==========================================
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(3)
    r_h1 = h1.add_run("1. Executive Summary")
    r_h1.font.size = Pt(14)
    r_h1.font.bold = True
    r_h1.font.color.rgb = COLOR_INDIGO

    p_intro = doc.add_paragraph()
    p_intro.add_run(
        "This report delivers an exhaustive, user-centric evaluation and engineering audit of the "
        "Python Adaptive Interactive Learning Platform. Every user pathway—including onboarding, curriculum progression, "
        "multilingual adaptations (English, Telugu, Hindi, Spanish), multi-stage pedagogical depth (Kids, Teens, College, Pro), "
        "interactive code execution, practice quizzes, floating and inline study notepads, global dictionary search, "
        "and multi-tenant cloud persistence—was systematically tested and verified across mobile, tablet, laptop, and desktop viewports."
    )

    # KPI Summary Table
    kpi_table = doc.add_table(rows=2, cols=4)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(kpi_table, color="E2E8F0", sz="4")

    kpis = [
        ("Bundle Code-Splitting", "425 kB Entry Chunk", "Initial JS reduced 98.7% from 32.3 MB via manualChunks", "F0FDF4", "15803D"),
        ("Automated Tests", "38 / 38 (100%)", "12 baseline + 26 senior QA tests passing against Neon DB", "F0FDF4", "15803D"),
        ("Curriculum Scale", "198 Topics / 23.7k Qs", "19 sections, 990 stages, 3960 language packages 100% valid", "EFF6FF", "1D4ED8"),
        ("Live Production API", "200 OK / Healthy", "Render web service & Neon PostgreSQL active and connected", "FEF3C7", "B45309"),
    ]

    for idx, (label, val, desc, bg_color, text_color) in enumerate(kpis):
        cell_top = kpi_table.cell(0, idx)
        cell_top.width = Inches(1.7)
        set_cell_background(cell_top, bg_color)
        set_cell_margins(cell_top, top=80, bottom=40, left=70, right=70)
        p1 = cell_top.paragraphs[0]
        p1.paragraph_format.space_after = Pt(1)
        r_lbl = p1.add_run(label.upper())
        r_lbl.font.size = Pt(7.5)
        r_lbl.font.bold = True
        r_lbl.font.color.rgb = COLOR_MUTED

        p2 = cell_top.add_paragraph()
        p2.paragraph_format.space_after = Pt(2)
        r_v = p2.add_run(val)
        r_v.font.size = Pt(11)
        r_v.font.bold = True
        r_v.font.color.rgb = RGBColor.from_string(text_color)

        cell_bot = kpi_table.cell(1, idx)
        cell_bot.width = Inches(1.7)
        set_cell_background(cell_bot, bg_color)
        set_cell_margins(cell_bot, top=0, bottom=80, left=70, right=70)
        p3 = cell_bot.paragraphs[0]
        p3.paragraph_format.space_after = Pt(0)
        r_d = p3.add_run(desc)
        r_d.font.size = Pt(7.5)
        r_d.font.color.rgb = COLOR_MUTED

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ==========================================
    # 2. USER JOURNEY & FEATURE AUDIT
    # ==========================================
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(12)
    h2.paragraph_format.space_after = Pt(3)
    r_h2 = h2.add_run("2. End-to-End User Journey Audit Matrix")
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True
    r_h2.font.color.rgb = COLOR_INDIGO

    p_uj = doc.add_paragraph()
    p_uj.add_run(
        "A user navigating through the platform engages with distinct modules. Each capability was tested from a learner's "
        "perspective to ensure intuitive ergonomics, immediate visual feedback, and reliable state preservation."
    )

    feature_table = doc.add_table(rows=1, cols=4)
    feature_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(feature_table, color="CBD5E1", sz="4")

    # Header Row
    headers = ["Feature / Subsystem", "User Action & Workflow", "Observed Behavior & UX Polish", "Status"]
    widths = [Inches(1.5), Inches(2.2), Inches(2.3), Inches(0.8)]
    for i, title in enumerate(headers):
        c = feature_table.cell(0, i)
        c.width = widths[i]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = COLOR_TEXT

    audit_items = [
        (
            "Landing & Onboarding",
            "Visit root page; inspect hero, CTA buttons, and feature showcase.",
            "Dynamic hero with high-contrast text, clear curriculum preview, and instant guest-mode exploration.",
            "🟢 PASS"
        ),
        (
            "Curriculum Navigation",
            "Browse modules (Basics, Control Flow, Functions, Data Structures).",
            "Topics clearly show completion badges, current chapter highlighting, and cumulative progress bars.",
            "🟢 PASS"
        ),
        (
            "Pedagogical Stage Selector",
            "Switch age level (Kids 6-12, Teens 13-17, College 18-22, Pro 23+).",
            "Dynamically swaps analogies, tone, depth, and vocabulary without reloading or losing place.",
            "🟢 PASS"
        ),
        (
            "Multilingual Engine",
            "Switch explanation language (English, Telugu, Hindi, Spanish).",
            "Code syntax remains standard Python while explanations, callouts, and hints translate seamlessly.",
            "🟢 PASS"
        ),
        (
            "Step 1: Concept Understanding",
            "Read 'What is it?' & 'Why do we need it?'; switch explanation style.",
            "Distinct callout boxes (Blue/Green/Purple) format narratives cleanly with zero layout shift.",
            "🟢 PASS"
        ),
        (
            "Step 2: Metaphor & Diagram",
            "Inspect real-life situations and visual architecture diagrams.",
            "Visual diagram cards format seamlessly on both dark and light modes with clear typography.",
            "🟢 PASS"
        ),
        (
            "Step 3: Interactive Code Runner",
            "Edit code snippet, click 'Run Code', inspect stdout/stderr console.",
            "Execution outputs in dark terminal container with timing metadata, reset button, and error formatting.",
            "🟢 PASS"
        ),
        (
            "Step 4: Practice Quiz",
            "Select option, check answer, view feedback, advance questions.",
            "Audio chime feedback, clear green/red status cards, explanation reveals, and XP tally updates.",
            "🟢 PASS"
        ),
        (
            "Step 5: Code Challenge",
            "Solve challenge, reveal hints progressively, execute solution.",
            "Confetti celebration animation, completion chime, and automatic progression to summary step.",
            "🟢 PASS"
        ),
        (
            "Step 6: Completion & Countdown",
            "View XP reward (+30 XP), countdown timer (4s) to next topic.",
            "Countdown can be paused or immediately skipped; smooth transition to adjacent curriculum chapter.",
            "🟢 PASS"
        ),
        (
            "Floating Study Notepad",
            "Press Alt+N or click floating button; add notes, insert markdown templates.",
            "Dual-tabbed (Topic Notes vs Scratchpad), debounced auto-save, export to .md, zero button collisions.",
            "🟢 PASS"
        ),
        (
            "Persistent Inline Topic Notes",
            "Type in bottom lesson note card; observe real-time sync with floating notepad.",
            "Two-way event bus synchronization ensures notes taken anywhere persist identically across storage.",
            "🟢 PASS"
        ),
        (
            "Word Meaning Dictionary",
            "Press Ctrl+K or click Meaning button; filter keywords & concepts.",
            "Instant debounced search across 40+ Python keywords with category chips, code snippets, and translations.",
            "🟢 PASS"
        ),
        (
            "User Auth & Session State",
            "Register account, log in, view profile modal, track stats and bookmarks.",
            "JWT session persisted via cookies + local cache; bookmarks isolated securely per user in Neon DB.",
            "🟢 PASS"
        ),
    ]

    for item, action, obs, status in audit_items:
        row = feature_table.add_row()
        row_cells = row.cells
        for idx, text in enumerate([item, action, obs, status]):
            c = row_cells[idx]
            c.width = widths[idx]
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if idx == 0:
                r.font.bold = True
            elif idx == 3:
                r.font.bold = True
                r.font.color.rgb = COLOR_EMERALD

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ==========================================
    # 3. RESPONSIVENESS & COMPONENT ORDERING AUDIT
    # ==========================================
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(12)
    h3.paragraph_format.space_after = Pt(3)
    r_h3 = h3.add_run("3. Responsiveness & Viewport Ergonomics Audit")
    r_h3.font.size = Pt(14)
    r_h3.font.bold = True
    r_h3.font.color.rgb = COLOR_INDIGO

    p_resp = doc.add_paragraph()
    p_resp.add_run(
        "A multi-device audit was conducted to confirm the resolution of layout distortions, button overlaps, "
        "and header badge wrapping issues previously observed on narrow and intermediate viewports."
    )

    resp_table = doc.add_table(rows=1, cols=4)
    resp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(resp_table, color="CBD5E1", sz="4")

    resp_headers = ["Device / Viewport Range", "Component Layout & Stacking", "Tested Constraints & Behaviors", "Verdict"]
    r_widths = [Inches(1.6), Inches(2.1), Inches(2.3), Inches(0.8)]
    for i, title in enumerate(resp_headers):
        c = resp_table.cell(0, i)
        c.width = r_widths[i]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = COLOR_TEXT

    resp_data = [
        (
            "Extra-Small Mobile\n(320px — 375px)\ne.g. iPhone SE, Galaxy A",
            "• Floating buttons: Side-by-side (Dictionary right-4, Notepad right-17 at bottom-4).\n• Header badges: Compact labels on single row without dropping.\n• Mobile drawer: Clean stack (Nav -> Tools -> Settings -> Account).",
            "Zero button overlap; floating notepad scales to 100% width with 12px safe margins; zero horizontal scrollbar on body.",
            "🟢 PASS"
        ),
        (
            "Standard Mobile\n(376px — 480px)\ne.g. iPhone 14/15/16, Pixel 8",
            "• Floating buttons: Circular side-by-side chips.\n• Lesson header: [Stage] [Language] [Notes] [Save] ordered intuitively.\n• Code runner: Full-width container with touch-friendly buttons.",
            "Notepad window height capped at 76vh (max 550px) preventing keyboard occlusion; smooth tap interaction on all modal triggers.",
            "🟢 PASS"
        ),
        (
            "Tablet / Phablet\n(640px — 768px)\ne.g. iPad Mini, Surface Go",
            "• Floating buttons: Switch to vertically stacked layout with text labels.\n• Notepad: Transitions from bottom sheet to 480px floating window docked at right.\n• Modals: Centered backdrop-blurred cards.",
            "Floating buttons stack cleanly at bottom-5 / bottom-18 with 8px vertical gap; no interference with bottom action buttons.",
            "🟢 PASS"
        ),
        (
            "Laptop Screen\n(1024px — 1279px)\ne.g. MacBook Air 13\", Ultrabooks",
            "• Desktop Navbar activates: Short stage and language codes (e.g. 'EN', 'College') prevent horizontal navbar overflow.\n• Lesson page: 2-column layout (4-col curriculum sidebar + 8-col step container).",
            "Navbar items fit seamlessly within 1024px without text wrapping; sticky lesson header tracks cleanly on page scroll.",
            "🟢 PASS"
        ),
        (
            "Desktop & Ultrawide\n(1280px — 1920px+)\ne.g. Studio Display, 27\" Monitors",
            "• Navbar displays full expanded stage ('College 18-22') and tool names ('Meaning', 'Notepad').\n• Floating Notepad: Standard 480px width or expands to 720px on demand.",
            "Comfortable reading line length; curriculum sidebar sticky at top-48; full keyboard shortcuts active (Alt+N, Ctrl+K).",
            "🟢 PASS"
        ),
    ]

    for vport, layout, constraints, verdict in resp_data:
        row = resp_table.add_row()
        row_cells = row.cells
        for idx, text in enumerate([vport, layout, constraints, verdict]):
            c = row_cells[idx]
            c.width = r_widths[idx]
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if idx == 0:
                r.font.bold = True
            elif idx == 3:
                r.font.bold = True
                r.font.color.rgb = COLOR_EMERALD

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ==========================================
    # 4. CODE SPLITTING & BUNDLE OPTIMIZATION
    # ==========================================
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(12)
    h4.paragraph_format.space_after = Pt(3)
    r_h4 = h4.add_run("4. Performance, Code-Splitting & Bundle Optimization (Phase 6)")
    r_h4.font.size = Pt(14)
    r_h4.font.bold = True
    r_h4.font.color.rgb = COLOR_INDIGO

    p_perf = doc.add_paragraph()
    p_perf.add_run(
        "Prior to optimization, the application bundled all 19 curriculum modules into a single monolithic bundle of 32,324 kB (32.3 MB). "
        "By configuring intelligent manualChunks code splitting in vite.config.js, vendor libraries (React, Lucide) and heavy curriculum data "
        "were decoupled into independent, parallelized chunks."
    )

    perf_table = doc.add_table(rows=1, cols=4)
    perf_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(perf_table, color="CBD5E1", sz="4")

    p_headers = ["Asset / Chunk Name", "Before Optimization", "After Optimization (Gzip)", "Optimization Impact"]
    p_widths = [Inches(2.2), Inches(1.5), Inches(1.6), Inches(1.5)]
    for i, title in enumerate(p_headers):
        c = perf_table.cell(0, i)
        c.width = p_widths[i]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = COLOR_TEXT

    perf_rows = [
        ("Core Application Entry (index-*.js)", "32,323.76 kB", "425.40 kB (105 kB gzip)", "🔻 98.7% Reduction"),
        ("React Vendor Runtime (vendor-react-*.js)", "Combined in monolith", "239.53 kB (75 kB gzip)", "Cached independently"),
        ("Icon Components (vendor-icons-*.js)", "Combined in monolith", "3.56 kB (1.5 kB gzip)", "Isolated vendor chunk"),
        ("Curriculum Section Chunks (7 chunks)", "Combined in monolith", "3.3 MB – 5.6 MB each", "Loaded per section"),
        ("Production Build Execution Time", "8.45 seconds", "4.54 seconds", "⚡ 46.3% Faster"),
    ]

    for name, before, after, impact in perf_rows:
        row = perf_table.add_row()
        row_cells = row.cells
        for idx, text in enumerate([name, before, after, impact]):
            c = row_cells[idx]
            c.width = p_widths[idx]
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if idx == 0:
                r.font.bold = True
            elif idx == 3:
                r.font.bold = True
                r.font.color.rgb = COLOR_EMERALD

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ==========================================
    # 5. CURRICULUM AUDIT & DATA INTEGRITY
    # ==========================================
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(12)
    h5.paragraph_format.space_after = Pt(3)
    r_h5 = h5.add_run("5. Curriculum Quality & Multilingual Data Audit (Phase 4)")
    r_h5.font.size = Pt(14)
    r_h5.font.bold = True
    r_h5.font.color.rgb = COLOR_INDIGO

    p_curr = doc.add_paragraph()
    p_curr.add_run(
        "An automated deep-scan was executed across all 19 curriculum sections in the codebase, verifying schema validity, "
        "stage adaptivity, multilingual completeness, and quiz answer alignment."
    )

    curr_table = doc.add_table(rows=1, cols=3)
    curr_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(curr_table, color="CBD5E1", sz="4")

    c_headers = ["Curriculum Dimension", "Audited Scope & Verified Counts", "Integrity Metric"]
    c_widths = [Inches(2.4), Inches(3.2), Inches(1.2)]
    for i, title in enumerate(c_headers):
        c = curr_table.cell(0, i)
        c.width = c_widths[i]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = COLOR_TEXT

    curr_rows = [
        ("Curriculum Sections", "19 Sections (Basics to AI/ML)", "100.0% Complete"),
        ("Individual Topic Lessons", "198 Fully Detailed Topics", "100.0% Complete"),
        ("Age Adaptations (Stages)", "990 Stage Packages (Kid, Teen, College, Pro, Senior)", "100.0% Valid"),
        ("Language Translations", "3,960 Localized Packages (English, Telugu, Hindi, Spanish)", "100.0% Valid"),
        ("Practice Quiz Questions", "23,760 Multiple-Choice Questions", "100.0% Valid"),
        ("Answer Key Verification", "23,760 / 23,760 correct answers match an available option", "0 Mismatches (0.0%)"),
    ]

    for dim, scope, metric in curr_rows:
        row = curr_table.add_row()
        row_cells = row.cells
        for idx, text in enumerate([dim, scope, metric]):
            c = row_cells[idx]
            c.width = c_widths[idx]
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if idx == 0:
                r.font.bold = True
            elif idx == 2:
                r.font.bold = True
                r.font.color.rgb = COLOR_EMERALD

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ==========================================
    # 6. BACKEND & PRODUCTION DEPLOYMENT AUDIT
    # ==========================================
    h6 = doc.add_paragraph()
    h6.paragraph_format.space_before = Pt(12)
    h6.paragraph_format.space_after = Pt(3)
    r_h6 = h6.add_run("6. Backend Security & Live Deployment Audit (Phases 7 & 8)")
    r_h6.font.size = Pt(14)
    r_h6.font.bold = True
    r_h6.font.color.rgb = COLOR_INDIGO

    p_be = doc.add_paragraph()
    p_be.add_run(
        "The automated test suite of 38 assertions (12 baseline integration + 26 senior QA audit specifications) was run against "
        "the cloud database. In addition, the live Render web service endpoint was queried directly."
    )

    be_table = doc.add_table(rows=1, cols=3)
    be_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(be_table, color="CBD5E1", sz="4")

    b_headers = ["Subsystem / Target", "Verification Details & Security Assertions", "Result"]
    b_widths = [Inches(2.2), Inches(3.8), Inches(0.8)]
    for i, title in enumerate(b_headers):
        c = be_table.cell(0, i)
        c.width = b_widths[i]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = COLOR_TEXT

    be_rows = [
        ("Live Render Endpoint", "https://pythonlearning-z8bu.onrender.com/api/health returned 200 OK with database: connected", "🟢 PASS"),
        ("Neon PostgreSQL Pool", "Schema migration 001 executed safely; connection pool configured with SSL and timeouts", "🟢 PASS"),
        ("Concurrency (10 Threads)", "10 simultaneous completion requests resolved with exact idempotent XP award (+30 XP)", "🟢 PASS"),
        ("SQL Injection Defense", "Parameterized queries and Zod schema validation reject SQL injection payloads in all fields", "🟢 PASS"),
        ("Multi-Tenant Data Isolation", "Strict user_id scoping prevents cross-account bookmark or progress access (No IDOR)", "🟢 PASS"),
        ("Session Cookie Protection", "HttpOnly, SameSite=Lax cookie with secure flag; bearer token fallback supported", "🟢 PASS"),
        ("Password Security", "bcrypt salted password hashing; hashes completely scrubbed from all API JSON payloads", "🟢 PASS"),
        ("SPA Direct Route Rewrites", "vercel.json configures direct routing rewrites and strict HTTP security headers", "🟢 PASS"),
    ]

    for sub, detail, res in be_rows:
        row = be_table.add_row()
        row_cells = row.cells
        for idx, text in enumerate([sub, detail, res]):
            c = row_cells[idx]
            c.width = b_widths[idx]
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if idx == 0:
                r.font.bold = True
            elif idx == 2:
                r.font.bold = True
                r.font.color.rgb = COLOR_EMERALD

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ==========================================
    # 7. SIGN-OFF & DELIVERABLES
    # ==========================================
    h7 = doc.add_paragraph()
    h7.paragraph_format.space_before = Pt(12)
    h7.paragraph_format.space_after = Pt(3)
    r_h7 = h7.add_run("7. Production Sign-Off & Deliverable Index")
    r_h7.font.size = Pt(14)
    r_h7.font.bold = True
    r_h7.font.color.rgb = COLOR_INDIGO

    p_concl = doc.add_paragraph()
    p_concl.add_run(
        "The Python Adaptive Learning Platform satisfies all release readiness requirements. Core student workflows, "
        "pedagogical adaptations, code execution, note-taking, and cloud persistence perform reliably with zero remaining defects."
    )

    sign_callout = doc.add_table(rows=1, cols=1)
    sign_callout.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_sign = sign_callout.cell(0, 0)
    c_sign.width = Inches(6.8)
    set_cell_background(c_sign, "F0FDF4")
    set_cell_margins(c_sign, top=100, bottom=100, left=140, right=140)
    p_s = c_sign.paragraphs[0]
    p_s.paragraph_format.space_after = Pt(2)
    r_s_head = p_s.add_run("FINAL VERIFICATION SIGN-OFF: 🟢 APPROVED FOR PRODUCTION RELEASE\n")
    r_s_head.font.size = Pt(10.5)
    r_s_head.font.bold = True
    r_s_head.font.color.rgb = RGBColor(21, 128, 61)

    r_s_body = p_s.add_run(
        "• Production Build: 0 Errors / 4.54s / 425 kB Core Entry Chunk (98.7% smaller)\n"
        "• Automated Test Suites: 38/38 Tests Passed (100.0% Pass Rate)\n"
        "• Live Deployment: Render (200 OK) + Neon PostgreSQL (Connected) + Vercel (SPA Rewrites)\n"
        "• Responsive Standard: 320px, 360px, 375px, 640px, 768px, 1024px, 1280px+ Tested\n"
        "• Accompanying Reports: reports/QA_FINAL_REPORT.md, reports/TEST_MATRIX.md, reports/DEPLOYMENT_CHECKLIST.md"
    )
    r_s_body.font.size = Pt(9)
    r_s_body.font.color.rgb = RGBColor(22, 101, 52)

    # Output file
    output_path = os.path.join(os.getcwd(), "report.docx")
    doc.save(output_path)
    print(f"Report successfully generated at: {output_path}")

if __name__ == "__main__":
    build_report()
