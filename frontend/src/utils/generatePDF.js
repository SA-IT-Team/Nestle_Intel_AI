import { jsPDF } from 'jspdf'

// ── Colour palette ────────────────────────────────────────────────────────────
const BROWN      = [99, 81, 61]
const CREAM      = [245, 237, 227]
const CREAM_DARK = [221, 208, 192]
const TEXT_DARK  = [30, 22, 12]
const TEXT_MID   = [100, 85, 70]
const TEXT_LIGHT = [155, 140, 125]
const WHITE      = [255, 255, 255]

const PAGE_W   = 210
const MARGIN   = 18
const BODY_W   = PAGE_W - MARGIN * 2

// ── Sanitise text so jsPDF (latin-1) never sees broken characters ─────────────
function safe(str = '') {
  return String(str)
    .replace(/Rs\.|₹/g, 'Rs.')
    .replace(/→|➜|▸|►/g, '->')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/–/g, '-')
    .replace(/—/g, '--')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xFF]/g, '')   // drop anything outside latin-1
    .trim()
}

// ── Typography helpers ────────────────────────────────────────────────────────
function font(doc, size, style = 'normal', rgb = TEXT_DARK) {
  doc.setFont('helvetica', style)
  doc.setFontSize(size)
  doc.setTextColor(...rgb)
}

function fill(doc, x, y, w, h, rgb) {
  doc.setFillColor(...rgb)
  doc.rect(x, y, w, h, 'F')
}

function rule(doc, x, y, w, rgb = CREAM_DARK, lw = 0.3) {
  doc.setDrawColor(...rgb)
  doc.setLineWidth(lw)
  doc.line(x, y, x + w, y)
}

// ── Page chrome ───────────────────────────────────────────────────────────────
function header(doc) {
  fill(doc, 0, 0, PAGE_W, 14, BROWN)
  font(doc, 8, 'bold', WHITE)
  doc.text('NESTLE  |  AI CONSUMER RESEARCH REPORT', MARGIN, 9.5)
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  font(doc, 8, 'normal', [210, 190, 165])
  doc.text(safe(date), PAGE_W - MARGIN, 9.5, { align: 'right' })
  return 22
}

function footer(doc, pageNum, total) {
  const pH = doc.internal.pageSize.getHeight()
  fill(doc, 0, pH - 10, PAGE_W, 10, CREAM)
  rule(doc, 0, pH - 10, PAGE_W)
  font(doc, 7, 'normal', TEXT_LIGHT)
  doc.text('Nestle AI Research Platform  |  Confidential', MARGIN, pH - 4)
  doc.text(`Page ${pageNum} of ${total}`, PAGE_W - MARGIN, pH - 4, { align: 'right' })
}

// Add new page and return the starting y position
function newPage(doc) {
  doc.addPage()
  return header(doc)
}

// Guard: if remaining space < needed, add new page
function guard(doc, y, needed = 18) {
  const pH = doc.internal.pageSize.getHeight()
  if (y + needed > pH - 16) return newPage(doc)
  return y
}

// ── Section heading ───────────────────────────────────────────────────────────
function sectionTitle(doc, text, y) {
  y = guard(doc, y, 16)
  fill(doc, MARGIN, y, BODY_W, 9, CREAM)
  fill(doc, MARGIN, y, 3, 9, BROWN)
  font(doc, 9, 'bold', BROWN)
  doc.text(safe(text).toUpperCase(), MARGIN + 7, y + 6.2)
  return y + 14
}

// ── Wrapped paragraph ─────────────────────────────────────────────────────────
function paragraph(doc, text, y, { size = 9, style = 'normal', color = TEXT_DARK, indent = 0, lineH = 5.5 } = {}) {
  font(doc, size, style, color)
  const lines = doc.splitTextToSize(safe(text), BODY_W - indent)
  for (const line of lines) {
    y = guard(doc, y, lineH + 2)
    doc.text(line, MARGIN + indent, y)
    y += lineH
  }
  return y
}

// ── Stat row (no tables — just a horizontal strip of labelled values) ─────────
function statStrip(doc, stats, y) {
  const colW = BODY_W / stats.length
  stats.forEach(({ label, value }, i) => {
    const x = MARGIN + i * colW
    fill(doc, x, y, colW - 2, 18, i % 2 === 0 ? CREAM : WHITE)
    // top accent line
    fill(doc, x, y, colW - 2, 2, BROWN)
    font(doc, 10, 'bold', BROWN)
    doc.text(safe(value), x + (colW - 2) / 2, y + 10, { align: 'center' })
    font(doc, 6.5, 'normal', TEXT_MID)
    doc.text(safe(label), x + (colW - 2) / 2, y + 16, { align: 'center' })
  })
  return y + 22
}

// ── Main export ───────────────────────────────────────────────────────────────
export function generatePDF(insightText, productQuery) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = 0

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ══════════════════════════════════════════════════════════════════════════
  fill(doc, 0, 0, PAGE_W, 58, BROWN)

  // Logo box
  fill(doc, MARGIN, 13, 20, 20, [120, 100, 80])
  font(doc, 14, 'bold', WHITE)
  doc.text('N', MARGIN + 10, 26.5, { align: 'center' })

  font(doc, 13, 'bold', WHITE)
  doc.text('NESTLE', MARGIN + 25, 21)
  font(doc, 8, 'normal', [210, 190, 165])
  doc.text('AI Research Platform', MARGIN + 25, 28)

  font(doc, 20, 'bold', WHITE)
  doc.text('Consumer Market Research', MARGIN, 44)
  font(doc, 10, 'normal', [210, 190, 165])
  doc.text('Executive Intelligence Report', MARGIN, 51)

  y = 68

  // Research brief
  fill(doc, MARGIN, y, BODY_W, 20, CREAM)
  doc.setDrawColor(...CREAM_DARK)
  doc.setLineWidth(0.3)
  doc.rect(MARGIN, y, BODY_W, 20, 'S')
  font(doc, 7, 'bold', TEXT_MID)
  doc.text('RESEARCH BRIEF', MARGIN + 4, y + 6)
  const briefLines = doc.splitTextToSize(safe(productQuery || 'High-protein coffee with 15g protein per serving for Indian market'), BODY_W - 10)
  font(doc, 9, 'normal', TEXT_DARK)
  doc.text(briefLines.slice(0, 2), MARGIN + 4, y + 13)
  y += 27

  // Date
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  fill(doc, MARGIN, y, BODY_W, 13, WHITE)
  doc.setDrawColor(...CREAM_DARK)
  doc.rect(MARGIN, y, BODY_W, 13, 'S')
  font(doc, 7, 'bold', TEXT_LIGHT)
  doc.text('REPORT DATE', MARGIN + 4, y + 5.5)
  font(doc, 9, 'bold', TEXT_DARK)
  doc.text(safe(today), MARGIN + 4, y + 11)
  y += 20

  // ── Key Metrics ──────────────────────────────────────────────────────────
  font(doc, 8, 'bold', TEXT_MID)
  doc.text('KEY METRICS AT A GLANCE', MARGIN, y)
  y += 5

  y = statStrip(doc, [
    { label: 'Global TAM (2024)',  value: '$2.9B' },
    { label: 'India SAM',          value: '$420M' },
    { label: 'YoY Growth (India)', value: '48%' },
    { label: 'Nestle Target SOM',  value: '$42M' },
    { label: 'Opportunity Score',  value: '8.7 / 10' },
  ], y)

  y += 4

  // ── Survey Highlights ────────────────────────────────────────────────────
  font(doc, 8, 'bold', TEXT_MID)
  doc.text('CONSUMER SURVEY HIGHLIGHTS', MARGIN, y)
  y += 5

  y = statStrip(doc, [
    { label: 'Purchase Intent',   value: '73%' },
    { label: 'Preferred Format',  value: 'Sachet' },
    { label: 'Price Sweet Spot',  value: 'Rs.30-50' },
    { label: 'Top Channel',       value: 'Supermarket' },
    { label: 'Sample Size',       value: '1,200' },
  ], y)

  // footer on page 1
  footer(doc, 1, '?')

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — EXECUTIVE BRIEFING
  // ══════════════════════════════════════════════════════════════════════════
  y = newPage(doc)

  y = sectionTitle(doc, 'Executive Briefing  —  AI Synthesis', y)

  // Clean and split the insight text
  const SECTION_HEADERS = [
    'Market Verdict',
    'Competitive Moat',
    'Consumer Signal',
    'Recommended Launch',
    'Time-to-Market Advantage',
  ]

  const rawInsight = safe(insightText || '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/`/g, '')

  const lines = rawInsight.split('\n').map(l => l.trim()).filter(Boolean)

  for (const line of lines) {
    const isHeader = SECTION_HEADERS.some(h => line.startsWith(h))

    if (isHeader) {
      y = guard(doc, y, 16)
      y += 3
      fill(doc, MARGIN, y - 1, BODY_W, 8, CREAM)
      font(doc, 9, 'bold', BROWN)
      doc.text(line.replace(/:$/, ''), MARGIN + 5, y + 5)
      y += 11
    } else if (line.length > 2) {
      y = paragraph(doc, line, y, { size: 9, lineH: 5.5 })
      y += 2
    }
  }

  // ── Strategic Recommendations ────────────────────────────────────────────
  y = guard(doc, y, 20)
  y += 4
  y = sectionTitle(doc, 'Strategic Recommendations', y)

  const recs = [
    { heading: 'Product Strategy', body: 'Launch NESCAFE Protein+ as an instant coffee sachet with 15g protein per serving at Rs.35-40 MRP. Offer a 10-pack at Rs.320. Initial flavors: Classic Coffee, Mocha, and Vanilla Protein.' },
    { heading: 'Go-to-Market', body: 'Phase 1: Modern trade and gyms across 6 metro cities. Phase 2: E-commerce on Amazon, Flipkart, and Blinkit. Phase 3: Kirana network using the existing NESCAFE supply chain.' },
    { heading: 'Target Audience', body: 'Primary audience: Urban professionals aged 25-40 who are fitness-aware. Secondary: Gen Z health seekers and college students. Geographic focus: Tier 1 cities first, followed by the top 15 Tier 2 cities.' },
    { heading: 'Revenue Outlook', body: 'Expected Year-1 revenue of Rs.85-120 Crore at 3% India market share. Break-even projected at Month 14. The 12-18 month window before a D2C competitor achieves scale makes speed critical.' },
  ]

  for (const { heading, body } of recs) {
    y = guard(doc, y, 22)
    // Small heading dot
    fill(doc, MARGIN, y + 1.5, 3, 3, BROWN)
    font(doc, 9, 'bold', TEXT_DARK)
    doc.text(safe(heading), MARGIN + 6, y + 4)
    y += 7
    y = paragraph(doc, body, y, { size: 8.5, color: TEXT_MID, indent: 6, lineH: 5.2 })
    y += 4
  }

  // ── Closing band ─────────────────────────────────────────────────────────
  y = guard(doc, y, 18)
  y += 4
  fill(doc, 0, y, PAGE_W, 14, BROWN)
  font(doc, 8, 'bold', WHITE)
  doc.text('Generated by Nestle AI Research Platform  |  Confidential', PAGE_W / 2, y + 6, { align: 'center' })
  font(doc, 7, 'normal', [210, 190, 165])
  doc.text('Consumer research compressed from years to minutes.', PAGE_W / 2, y + 11, { align: 'center' })

  // ── Apply footer to every page ────────────────────────────────────────────
  const total = doc.internal.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    footer(doc, p, total)
  }

  doc.save(`Nestle_Research_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
}
