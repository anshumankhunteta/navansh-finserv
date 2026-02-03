import { Award, Users, TrendingUp } from "lucide-react";

export const metadata = {
    title: "About Us | Navansh Finserv",
    description: "Learn about our journey from a sales manager to a trusted financial firm. 15+ Years of Experience.",
};

export default function AboutPage() {
    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Narrative Section */}
                <div className="max-w-4xl mx-auto mb-20 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-primary mb-8">About Navansh Finserv</h1>
                    <div className="prose prose-lg text-slate-700 mx-auto md:mx-0">
                        <p className="mb-6">
                            Welcome to Navansh Finserv. My journey began 15 years ago, not as a firm owner, but as a sales manager working tirelessly to understand the complex world of finance.
                        </p>
                        <p className="mb-6">
                            As a single mother, I understood early on that <strong>financial security is not just about numbers—it&apos;s about family, resilience, and sleep-filled nights.</strong> I built this firm from the ground up, valuing every rupee my clients entrust to me, because I know what it takes to earn it.
                        </p>
                        <p className="mb-6">
                            Today, Navansh Finserv is more than just a business; it&apos;s a promise of "Motherly Protection" for your wealth. We don&apos;t just sell policies; we build comprehensive safety nets tailored to your unique life stage.
                        </p>
                        <p>
                            Whether you are looking to secure your child&apos;s education, protect your health, or grow your wealth, we are here with expert advice that comes from a place of care and experience.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Award className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-4xl font-extrabold text-secondary mb-2">15+</h3>
                        <p className="text-slate-600 font-medium">Years of Experience</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-4xl font-extrabold text-secondary mb-2">500+</h3>
                        <p className="text-slate-600 font-medium">Happy Families</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-4xl font-extrabold text-secondary mb-2">100%</h3>
                        <p className="text-slate-600 font-medium">Claims Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
