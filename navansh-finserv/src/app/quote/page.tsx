import { Metadata } from "next";
import { SIPCalculator } from "@/components/SIPCalculator";

export const metadata: Metadata = {
    title: "Enquire Now | Navansh Finserv",
    description:
        "Request a personalized quote for insurance, wealth management, or loan solutions. Fill out our simple form and our experts will get back to you.",
};

export default function QuotePage() {
    return (
        <div className="py-20 md:py-28">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Enquire <span className="text-primary">Now</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Fill out the form below and our financial experts will provide you
                        with a personalized quote within 24 hours.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Tally Form */}
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden order-1 lg:order-1">
                        <div className="p-4 md:p-6 border-b border-border/50">
                            <h2 className="text-xl md:text-2xl font-bold">
                                Request Your Quote
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1">
                                Complete the form to get started
                            </p>
                        </div>
                        <div className="p-4 md:p-6">
                            <iframe
                                src="https://tally.so/embed/w7Xk1q?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                                width="100%"
                                height="500"
                                loading="lazy"
                                title="Get a Quote Form"
                                className="w-full"
                                style={{
                                    border: 0,
                                    overflow: "hidden",
                                }}
                                scrolling="no"
                            />
                        </div>
                    </div>

                    {/* SIP Calculator */}
                    <div className="order-2 lg:order-2">
                        <SIPCalculator />
                    </div>
                </div>
            </div>
        </div>
    );
}

