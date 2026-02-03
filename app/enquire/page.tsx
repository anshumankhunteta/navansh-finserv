import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - Get a Quote | Navansh Finserv",
    description: "Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.",
};

export default function GetQuotePage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-20">
            <h2 className="text-2xl font-bold mb-6">Get a <span className="text-primary">Quote</span> - Send us a Message</h2>
            <div className="rounded-lg overflow-hidden">
                <iframe
                    src="https://tally.so/embed/zxYKoa?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                    width="100%"
                    height="1000"
                    title="Contact Form"
                    loading="lazy"
                    style={{ border: 0 }}
                ></iframe>
            </div>
        </div>
    );
}