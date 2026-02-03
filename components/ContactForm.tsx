"use client";

import { TallyEmbed } from "@/components/TallyEmbed";

export function ContactForm() {
    return (
        <div className="w-full h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <TallyEmbed
                url="https://tally.so/embed/w7Xk1q?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                title="Contact Navansh Finserv"
            />
        </div>
    );
}
