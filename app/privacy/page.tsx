export const metadata = {
    title: "Privacy Policy | Navansh Finserv",
    description: "Our commitment to protecting your personal data.",
};

export default function PrivacyPage() {
    return (
        <div className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-3xl font-bold text-primary mb-8">Privacy Policy</h1>

                <div className="prose prose-slate bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-500 mb-6">Last Updated: February 2026</p>

                    <h3>1. Introduction</h3>
                    <p>
                        Navansh Finserv ("we", "us", "our") is committed to protecting the privacy of our clients and website visitors. This Privacy Policy outlines how we collect, use, and safeguard your information.
                    </p>

                    <h3>2. Information We Collect</h3>
                    <p>
                        We collect basic personal information that you voluntarily provide to us via forms (such as Tally) or direct communication. This generally includes:
                    </p>
                    <ul>
                        <li>Name</li>
                        <li>Phone Number</li>
                        <li>Email Address</li>
                        <li>City/Location</li>
                    </ul>

                    <h3>3. How We Use Your Information</h3>
                    <p>
                        We use your data solely for the following purposes:
                    </p>
                    <ul>
                        <li>To provide you with requested quotes or financial consultations.</li>
                        <li>To communicate with you regarding your policies or inquiries.</li>
                        <li>To improve our services and website experience.</li>
                    </ul>

                    <h3>4. Data Protection</h3>
                    <p>
                        We implement standard security measures to protect your data. We do not sell, trade, or rent your personal identification information to third parties. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates.
                    </p>

                    <h3>5. Third-Party Links</h3>
                    <p>
                        Our website may contain links to other websites (e.g., Insurance Providers). We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site.
                    </p>

                    <h3>6. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us.
                    </p>
                </div>
            </div>
        </div>
    );
}
