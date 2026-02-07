import { Button } from "@/components/ui/button";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us - Get a Quote | Navansh Finserv",
    description: "Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.",
};

const contactInfo = [
    {
        icon: MapPin,
        title: "Location",
        details: "39, Mahatma Gandhi Road, Haridevpur, Tollygunge, Kolkata, West Bengal 700082",
    },
    {
        icon: Mail,
        title: "Email",
        details: "navanshfinserv@gmail.com",
    },
    {
        icon: Phone,
        title: "Phone",
        details: "Available on request",
    },
    {
        icon: Clock,
        title: "Hours",
        details: "Mon - Sat: 9AM - 7PM",
    },
];

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
                            Ready to secure your future? Reach out to us and we&apos;ll get
                            back to you within 24 hours.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 mx-auto">
                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                        <div className="space-y-6">
                            {contactInfo.map((info) => (
                                <div key={info.title} className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <info.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{info.title}</h3>
                                        <p className="text-muted-foreground text-sm">{info.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Google Maps */}
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                        <div className="p-4 border-b border-border/50">
                            <h3 className="text-xl font-bold">Our Location</h3>
                        </div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d460.82518860936966!2d88.33799571472095!3d22.481604322024946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027091f2ff6159%3A0xb27ac9c8999c622c!2s39%2C%20Mahatma%20Gandhi%20Rd%2C%20Haridevpur%2C%20Paschim%20Putiary%2C%20Kolkata%2C%20West%20Bengal%20700082!5e0!3m2!1sen!2sin!4v1770227001040!5m2!1sen!2sin"
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Navansh Finserv Location"
                            className="w-full"
                        />
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
                        We are ready to help you with your financial planning needs.
                    </p>
                    <Button asChild variant={'default'} className="text-lg px-8 py-6">
                        <Link href="/enquire">Get a Quote</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
