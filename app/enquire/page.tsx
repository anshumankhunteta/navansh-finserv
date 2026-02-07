import { SIPCalculator } from "@/components/custom/SIPCalculator";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us - Get a Quote | Navansh Finserv",
    description: "Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.",
};

export default function GetQuotePage() {
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "navanshfinserv@gmail.com";

    const contactInfo = [
        {
            icon: MapPin,
            title: "Location",
            details: "39, Mahatma Gandhi Road, Haridevpur, Tollygunge, Kolkata, West Bengal 700082",
        },
        {
            icon: Clock,
            title: "Hours",
            details: "Mon - Sat: 9AM - 7PM",
        },
        {
            icon: Mail,
            title: "Email",
            details: contactEmail,
            link: `mailto:${contactEmail}`
        },
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-20">
            <h2 className="text-2xl font-bold mb-6">Get a <span className="text-primary">Quote</span> - Send us a Message</h2>
            <div className="rounded-lg overflow-hidden">
                <iframe
                    src="https://tally.so/embed/zxYKoa?alignLeft=1&hideTitle=1&transparentBackground=1"
                    width="100%"
                    title="Contact Form"
                    loading="lazy"
                    style={{ border: 0, height: "600px" }}
                ></iframe>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                    <div className="space-y-6">
                        {contactInfo.map((info) => (
                            <div key={info.title} className="flex items-start gap-4">
                                <a href={`${info?.link}`}>
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <info.icon className="h-5 w-5" />
                                    </div>
                                </a>
                                <div>
                                    <h3 className="font-medium">{info.title}</h3>
                                    <p className="text-muted-foreground text-sm">{info.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <SIPCalculator />
            </div>
        </div>
    );
}