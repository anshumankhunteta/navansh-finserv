# 🚀 Navansh Finserv

**Modern. Trustworthy. Resilient.** A high-performance financial services landing page built for a veteran insurance sales professional. This project uses the latest web technologies to provide a seamless, mobile-first experience for clients seeking insurance and wealth management solutions.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Components:** [Shadcn/UI](https://ui.shadcn.com/) 
* **Icons:** [Lucide React](https://lucide.dev/)
* **Lead Gen Form:** [Tally.so](https://tally.so/) - Secure, no-code form iframe integration.

---

## 🎨 Design System

| Role | Color | Hex |
| :--- | :--- | :--- |
| **Primary (Action)** | Teal | `#4ECCA3` |
| **Background (Dark)** | Deep Charcoal | `#232931` |
| **Surface** | Soft Charcoal | `#393E46` |
| **Text/Light** | Off-White | `#EEEEEE` |

---

## 🛡️ Key Features

-   **Island Architecture:** Server components by default for maximum SEO and instant loading.
-   **Local SEO:** Integrated JSON-LD Schema for `FinancialService` to boost Google Search rankings.
-   **Mobile First:** Fully responsive navigation using Shadcn's Sheet (Hamburger) menu.
-   **Secure Lead Flow:** Tally form responses automatically sync to Google Sheets, triggering real-time WhatsApp alerts.

---

## 📁 Project Structure

```text
└── anshumankhunteta-navansh-finserv/
    ├── app/               # Next.js App Router (Pages & Layout)
    │   ├── about/         # Founder story and credentials
    │   ├── services/      # Detailed product offerings (Insurance, Mutual Funds, Loans)
    │   └── contact/       # Lead capture via Tally.so
    ├── components/
    │   ├── layout/        # Navbar and Footer (Shared UI)
    │   └── ui/            # Shadcn Primitives (Button, Sheet, etc.)
    └── lib/               # Utility functions (Tailwind Merge, etc.)
