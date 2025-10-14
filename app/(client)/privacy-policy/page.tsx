import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen flex flex-col items-center w-full">
            {/* Hero Section */}
            <div className="bg-[url('/blog/blog-bg.png')] w-full bg-cover bg-center text-white md:min-h-[40vh] flex flex-col justify-center items-center relative">
                <div className="absolute inset-0 bg-primary/45" />
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-blue-100">
                            Last Updated: October 1st, 2025
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="w-full py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-8">
                        
                        {/* Introduction */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                1. Introduction
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Welcome to the Electoral Peace Hub (&quot;the Platform&quot;), developed under the FIIAP project to support collaboration, visibility, and resource sharing among Civil Society Organisations (CSOs) across West Africa.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                This Privacy Policy explains how we collect, use, store, and protect personal and organisational information shared on this platform.
                            </p>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                By using our services, you agree to the data practices described here.
                            </p>
                        </div>

                        {/* Who We Are */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                2. Who We Are
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Electoral Peace Hub enables Civil Society Organisations (CSOs), policy actors, donors, and media to collaborate, share resources, and connect across regions. Our goal is to provide a secure, multilingual (English, French, and Spanish) digital environment where CSOs and their partners can work together to strengthen civic engagement and peacebuilding.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                We collect and process data to:
                            </p>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>Create and manage verified organisational profiles.</li>
                                <li>Facilitate communication between registered organisations.</li>
                                <li>Provide visibility for projects, events, and opportunities.</li>
                                <li>Ensure secure access to user accounts.</li>
                                <li>Improve platform performance and user experience.</li>
                                <li>Comply with applicable data protection and regional regulations.</li>
                            </ul>
                        </div>

                        {/* Information We Collect */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                3. Information We Collect
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We collect both personal and organisational information necessary to operate the Platform effectively.
                            </p>
                            
                            {/* 3.1 */}
                            <div className="mt-6 space-y-3">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    3.1 Information You Provide Directly
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    When registering or using the Platform, you may provide:
                                </p>
                                <ul className="space-y-2 list-disc pl-6 text-gray-700">
                                    <li>Organisation name and contact details</li>
                                    <li>Mission, thematic focus, and geographic scope</li>
                                    <li>Names and contact information of CSO representatives</li>
                                    <li>Uploaded media (logos, reports, photos, PDFs)</li>
                                    <li>Forum posts, updates, or stories</li>
                                    <li>Login credentials (email and password)</li>
                                </ul>
                            </div>

                            {/* 3.2 */}
                            <div className="mt-6 space-y-3">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    3.2 Automatically Collected Information
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    When you use the Platform, we may collect:
                                </p>
                                <ul className="space-y-2 list-disc pl-6 text-gray-700">
                                    <li>Log files (IP address, browser type, operating system, device type)</li>
                                    <li>Usage data (pages visited, searches performed, time spent on site)</li>
                                    <li>Analytics data (number of posts, profile views, engagement metrics)</li>
                                </ul>
                            </div>

                            {/* 3.3 */}
                            <div className="mt-6 space-y-3">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    3.3 User-Generated Content
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We also process content that you create or upload, including:
                                </p>
                                <ul className="space-y-2 list-disc pl-6 text-gray-700">
                                    <li>Posts, comments, and uploads shared in forums or stories</li>
                                    <li>Publicly visible organisation information</li>
                                </ul>
                            </div>

                            {/* 3.4 */}
                            <div className="mt-6 space-y-3">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    3.4 Cookies
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We use cookies and similar technologies to:
                                </p>
                                <ul className="space-y-2 list-disc pl-6 text-gray-700">
                                    <li>Maintain user sessions</li>
                                    <li>Save preferences (e.g., language settings)</li>
                                    <li>Improve performance and analytics</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mt-3">
                                    You can disable cookies in your browser settings, though this may limit some functionality.
                                </p>
                            </div>
                        </div>

                        {/* Legal Basis for Processing */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                4. Legal Basis for Processing
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We process your information under the following legal bases:
                            </p>
                            <ul className="space-y-3 list-none">
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">Consent:</strong> When you create an account or voluntarily submit data.
                                </li>
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">Legitimate interest:</strong> To operate and improve the platform, and facilitate collaboration among CSOs.
                                </li>
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">Legal compliance:</strong> When processing is required to meet regional or international data protection laws.
                                </li>
                            </ul>
                        </div>

                        {/* How We Use Your Information */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                5. How We Use Your Information
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your information may be used to:
                            </p>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>Create and manage organisation profiles in the regional database.</li>
                                <li>Enable collaboration and communication through forums and posts.</li>
                                <li>Verify authenticity of CSO information before publication.</li>
                                <li>Provide multilingual and localised user experiences.</li>
                                <li>Maintain security, detect fraud, and enforce our Terms of Use.</li>
                                <li>Generate anonymised analytics for platform improvement.</li>
                                <li>Respond to user support requests and improve user experience.</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4 font-medium">
                                We do not sell or rent your personal data to any third parties.
                            </p>
                        </div>

                        {/* Data Sharing and Disclosure */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                6. Data Sharing and Disclosure
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We respect your privacy and share data only as necessary to operate the Platform:
                            </p>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li><strong>With administrators and moderators</strong> for reviewing and approving submitted content.</li>
                                <li><strong>With verified users</strong>, through publicly accessible organisation profiles and posts.</li>
                                <li><strong>With third-party service providers</strong> (e.g., hosting, analytics, or translation tools) bound by strict data protection agreements.</li>
                                <li><strong>When required by law</strong>, or to protect the rights, property, or safety of users and the platform.</li>
                            </ul>
                        </div>

                        {/* Data Security */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                7. Data Security
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We take appropriate technical and organisational measures to safeguard your data, including:
                            </p>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>Role-based access control for administrators and users</li>
                                <li>Email verification during sign-up</li>
                                <li>Encrypted data transmission (HTTPS)</li>
                                <li>Regular system backups and security audits</li>
                                <li>Spam and fraud prevention systems</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                All data is stored securely on servers that comply with local and international data protection standards, including NDPR and GDPR.
                            </p>
                        </div>

                        {/* Data Retention */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                8. Data Retention
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We retain your information:
                            </p>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>For as long as your organisation maintains an active account.</li>
                                <li>For up to <strong>12 months</strong> after account deletion for audit or compliance purposes. After this period, your data will be <strong>securely deleted or anonymised</strong>.</li>
                            </ul>
                        </div>

                        {/* Your Rights */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                9. Your Rights
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                As a registered user or organisational representative, you have the right to:
                            </p>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>Access and review your personal or organisational data.</li>
                                <li>Request correction of inaccurate or incomplete information.</li>
                                <li>Request deletion of your data (&quot;right to be forgotten&quot;).</li>
                                <li>Withdraw consent at any time and deactivate your profile.</li>
                                <li>Opt out of marketing or notification emails.</li>
                                <li>Request a copy of your data in a portable format.</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                To exercise these rights, please contact:{' '}
                                <a 
                                    href="mailto:info@fiap.gob.es" 
                                    className="text-primary hover:underline font-medium"
                                >
                                    info@fiap.gob.es
                                </a>
                            </p>
                        </div>

                        {/* Third-Party Links */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                10. Third-Party Links
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                The Platform may include links to external websites (e.g., donor platforms, partner CSOs, or funding opportunities).
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                We are not responsible for the privacy practices or content of third-party websites. Please review their privacy policies separately.
                            </p>
                        </div>

                        {/* Children's Privacy */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                11. Children&apos;s Privacy
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                This Platform is intended for organisational and professional use only. We do not knowingly collect personal data from individuals under 18 years of age.
                            </p>
                        </div>

                        {/* Updates to This Policy */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                12. Updates to This Policy
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time to reflect:
                            </p>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>New features or functionality</li>
                                <li>Legal or regulatory changes</li>
                                <li>Best practice updates</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                The latest version will always be available on the Privacy Policy page of the Platform. Continued use of the Platform constitutes acceptance of the updated terms.
                            </p>
                        </div>

                        {/* Contact Us */}
                        <div className="space-y-4 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                13. Contact Us
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions, concerns, or data-related requests, please contact us at:
                            </p>
                            <div className="flex flex-col gap-2 text-gray-700">
                                <a 
                                    href="mailto:info@fiap.gob.es" 
                                    className="text-primary hover:underline font-medium"
                                >
                                    info@fiap.gob.es
                                </a>
                                <a 
                                    href="tel:+34915914600" 
                                    className="text-primary hover:underline font-medium"
                                >
                                    +34 915 914 600
                                </a>
                            </div>
                        </div>

                        {/* Bottom Notice */}
                        <div className="pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600 text-center">
                                By using the Electoral Peace Hub, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and processing of your data as described herein.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="w-full py-16 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Have Questions About Your Privacy?
                        </h3>
                        <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                            We&apos;re committed to protecting your data and being transparent about our practices. If you have any questions or concerns, please don&apos;t hesitate to reach out.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:info@fiap.gob.es"
                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Contact Us
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Visit Contact Page
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

