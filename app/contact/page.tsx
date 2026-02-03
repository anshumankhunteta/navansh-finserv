import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
    title: "Contact Us | Navansh Finserv",
    description: "Get in touch for a comprehensive financial audit.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-bold text-primary mb-6">Get in Touch</h1>
                                <p className="text-lg text-slate-600">
                                    Ready to secure your future? Fill out the form or reach out to us directly for a personalized consultation.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <MapPin className="h-5 w-5 text-secondary-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary">Visit Us</h3>
                                        <p className="text-slate-600">India (Placeholder Address)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <Phone className="h-5 w-5 text-secondary-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary">Call Us</h3>
                                        <p className="text-slate-600">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <Mail className="h-5 w-5 text-secondary-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary">Email Us</h3>
                                        <p className="text-slate-600">contact@navansh-finserv.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                                <h4 className="font-semibold text-blue-900 mb-2">Why Book a Consultation?</h4>
                                <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                                    <li>Free comprehensive financial audit</li>
                                    <li>Personalized insurance recommendations</li>
                                    <li>Investment portfolio review</li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
