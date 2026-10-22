# OffertPro – Nordic Craft & Quote (Fältoffert & BankID)

An end-to-end field estimation, documentation, and digital contract signing application crafted for Swedish builders, plumbers, electricians, and contractors. Enables tradespeople to capture on-site photos and voice memos, calculate work hours and materials with automated 30% ROT-avdrag deductions, generate certified quote PDFs, and obtain binding customer signatures via interactive Mobile BankID.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned via interactive clarification and will guide development:

- **Viewport & Device Mode**: Responsive multi-device support with an interactive device frame toggle allowing instant previewing in **Mobile Phone (390px/430px)**, **Tablet/iPad (820px)**, and **Full-width Desktop Workspace (1280px+)**.
- **BankID Signing Flow**: Complete end-to-end interactive simulation including on-site dynamic QR-code scanning, remote SMS/E-mail link distribution with real-time verification status, and interactive client-side PDF quote rendering.
- **Preloaded Trades & Datasets**: Multiple realistic Swedish trades preloaded with full documentation and line-item databases:
  1. **Villa Lindgren (Bromma)** – Kök & VVS (Drain relocation, water supply, LED lighting, 40 202 kr net).
  2. **Fastighet Sicklaön (Nacka)** – Takbyte & Solcellsförberedelse (Roof tiles, mounting brackets, main electrical cabinet).
  3. **Familjen Karlsson (Saltsjö-Duvnäs)** – Badrumsrenovering & Tätskikt (Wet room membrane, floor drain, tiling).

---

## 1. Overview & Core Concept

### What It Does
OffertPro streamlines the entire quoting process for tradespeople on the road:
1. **Kund & Plats (Step 1)**: GPS-assisted address lookup, customer details with Swedish personnummer verification, trade selection chips, and scheduled visit slots.
2. **Fältdokumentation (On-Site Protocol)**: Active visit timer, photo evidence manager with time-stamped annotations and zoom, AI-transcribed voice memos, and mandatory site inspection checklists.
3. **Kalkyl & ROT (Step 2)**: Dynamic line-item calculation (work hours at hourly rate + materials at cost) with instant 30% Swedish ROT-avdrag tax deduction calculations and live totals.
4. **Offertgranskning & BankID Signering (Step 3)**: Certified quote summary, PDF generator with embedded site photos, and legally binding BankID signing (on-site QR code or remote secure link) synchronized with Fortnox & Visma eEkonomi workflows.

### Target Audience & Persona
Swedish contractors, master plumbers, electricians, and project leaders who conduct on-site inspections and need to present, calculate, and sign legally binding quotes before leaving the client's driveway.

---

## 2. User Experience & Visual Design

### Screen Navigation & Flows

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DEVICE FRAME SWITCHER: [📱 Mobil (iPhone)]  [📟 Surfplatta (iPad)]  [💻 Skrivbord (1280px)]     │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
  ┌───────────────────────┬────────────────┴──────────────────────┬───────────────────────┐
  ▼                       ▼                                       ▼                       ▼
[1. Boka Besök]   [2. Fältprotokoll]                     [3. Kalkyl & ROT]       [4. BankID Granskning]
• GPS adress-sök  • Aktiv timer (24:22)                  • Snickeri / VVS rader  • 4-sidig PDF förhandsgranskning
• Sven Karlsson   • 4 foton med zoom & mätdata           • À-pris & timvolym     • Val: QR på plats vs E-post
• ROT-godkänd     • AI Transkriberat röstmemo            • 30% ROT-avdrag        • Simulerad BankID-inloggning
• Uppdragstaggar  • Checklista (Mått, skick, personnr)   • Total 40 202 kr       • Fortnox & Visma bekräftelse
```

### Visual Identity & Theme (Nordic Craft & Quote Design Tokens)
- **Design Tokens**: Direct implementation of the project's Atkinson Hyperlegible Next typography and authentic Scandinavian craft palette:
  - **Canvas Surface**: `#F9F9FE` with cards on `#FFFFFF` and subtle tonal dividers (`#EEEDF3`).
  - **Primary**: Slate blue `#4D5C78` / `#657592` (commanding, readable, trustworthy).
  - **Secondary**: Graphite `#555E72` / `#D7E0F6` (informative, balanced).
  - **BankID Signature**: Deep Navy `#002244` / `#194483` with high-contrast white text for official authentication.
  - **ROT & Approved State**: Nordic forest emerald `#0E7A4A` / `#DCFCE7` for verified deductions and signed contracts.
- **Typography**: Atkinson Hyperlegible Next + Plus Jakarta Sans display weights, paired with `tabular-nums` for mathematical vertical alignment of Swedish Kronor (`kr`), VAT (25% moms), and ROT subsidies.
- **Ergonomics**: Generous touch targets ($\ge 48\text{px}$), sticky action bars respecting the 15% mobile viewport guideline, and full responsiveness across mobile sheets and desktop dashboards.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Trade-offs |
| :--- | :--- | :--- |
| **Device Frame Switcher** | In-app floating device frame toolbar (Mobile / Tablet / Responsive) | Allows testing the exact mobile screens from the reference images while maintaining responsive desktop support without requiring browser devtools resizing. |
| **BankID Interactivity** | Full interactive simulation with QR code generator, countdown timer, and simulated mobile handshake | Gives users a realistic, production-like feel of signing with Swedish BankID without requiring real Swedish government banking credentials. |
| **PDF Generation** | Visual in-app PDF preview modal with download & print capabilities | Contractors can inspect the exact customer-facing quote layout (specifications, terms, photos, ROT-avdrag breakdown) in real-time. |
| **Audio Memo Feature** | Working browser MediaRecorder with realistic simulated AI transcription (Swedish trade vocabulary) | Recreates the on-site contractor experience of dictating notes while checking pipes or electrical boxes. |

---

## 4. Technical Architecture & Component Model

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ App.tsx (Root State Store: Active Project, Navigation Step, Device Viewport Mode)       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ├── DeviceToolbar.tsx (Device Switcher, Trade Switcher, Reset Data)                    │
│ ├── Header.tsx (Brand, Synk-status "Fortnox/Visma OK", User Profile)                   │
│ │                                                                                      │
│ ├── Views:                                                                             │
│ │   ├── BookingView.tsx (Step 1: Adress-sökning, GPS, Kunddetaljer, Uppdragskategorier) │
│ │   ├── FieldProtocolView.tsx (Fältdokumentation, Timer, 4 foton, Röstmemo, Checklista)│
│ │   ├── QuoteCalculatorView.tsx (Step 2: Poster, À-priser, 30% ROT-kalkyl, Sammanställning)│
│ │   └── BankIdReviewView.tsx (Step 3: Offertgranskning, PDF-rendering, BankID Signering) │
│ │                                                                                      │
│ ├── Modals & Overlays:                                                                 │
│ │   ├── BankIdModal.tsx (Live QR-kod animation, Säkerhetstext, BankID-app öppning)     │
│ │   ├── PdfPreviewModal.tsx (Fler-sidig entreprenadoffert med bilagor och företagslogotyp) │
│ │   ├── PhotoLightboxModal.tsx (Högkvalitativ bildzoom med mätdata & källaranteckningar)│
│ │   └── LineItemEditorModal.tsx (Lägg till / redigera arbetsmoment och material)       │
│ │                                                                                      │
│ └── BottomNav.tsx (Fasta flikar: Besök, Ny Offert, Arkiv, Inställningar)              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Data Entities
- **ProjectQuote**: id, quoteNumber, client (name, personnummer, email, phone, address, propertyId), status (`utkast`, `granskad`, `signerad`), visitTimer, checkList (`measuresChecked`, `conditionPhotographed`, `ssnVerified`), voiceMemos, photos (url, caption, timestamp, tag), lineItems (id, type: work|material, description, volume, unit, unitPrice, isRotEligible), rotPercent (30%), discount.
- **Calculations**: Total work exkl. moms, total material, moms 25%, calculated ROT reduction, customer net total payable.

---

## Implementation Stages

1. **Tokens & Assets Setup**: Configure Atkinson Hyperlegible Next fonts, material symbols, and Tailwind design tokens matching the project specification. Ensure image assets and photorealistic trade references load crisply with fallbacks.
2. **State Store & Trade Templates**: Implement comprehensive initial state with the three preloaded Swedish trade projects (Villa Lindgren, Sicklaön, and Saltsjö-Duvnäs).
3. **Step 1 – Boka Kundbesök**: Build responsive address search with GPS distance badges, customer details card, job type multi-select tags, and date/time selector.
4. **Step 2 – Fältdokumentation (Protocol)**: Live inspection timer, 4-photo grid with zoom/inspection modal, audio recorder with trade-specific transcription, and 3-step checklist.
5. **Step 3 – Kalkyl & ROT Calculator**: Interactive line item builder, volume & à-pris adjustments, toggleable ROT-avdrag calculation (30% on labor), and sticky financial summary.
6. **Step 4 – Offertgranskning & BankID Flow**: Direct on-site vs. remote signing selection, legal eIDAS disclaimer, animated QR code BankID modal, signed status toast, and full PDF preview.
7. **Verification & Polish**: Test navigation across mobile, tablet, and desktop viewport frames, verify math integrity, and run applet compilation.
