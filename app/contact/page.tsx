import { SIPCalculator } from "@/components/custom/SIPCalculator";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - Get a Quote | Navansh Finserv",
    description: "Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.",
};

export default function ContactPage() {
    return (
        <div className="flex flex-col">
            {/* Header */}
            <section className="bg-gradient-to-br from-background via-background to-primary/5 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Get in <span className="text-primary">Touch</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Schedule a free consultation and let's discuss your financial goals
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <a href="mailto:info@navanshfinserv.com" className="text-muted-foreground hover:text-primary transition-colors">
                                            info@navanshfinserv.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        <a href="tel:+91XXXXXXXXXX" className="text-muted-foreground hover:text-primary transition-colors">
                                            +91-XXXXXXXXXX
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Location</h3>
                                        <p className="text-muted-foreground">
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                                <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                                <p className="mt-4 text-sm font-medium text-primary">
                                    24/7 Claims Support Available
                                </p>
                            </div>
                        </div>

                        {/* Tally.so Form Embed */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Our Location</h2>
                            <div className="rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
                                <iframe className="gmap_iframe" width="500" height="400"
                                    src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=41 pally club&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Schedule Consultation Section */}
            <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Schedule a Free Consultation
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Our financial experts are ready to help you navigate your insurance and wealth management needs
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Fill out the form above and we'll get back to you within 24 hours
                    </p>
                </div>
            </section>
        </div>
    );
}
