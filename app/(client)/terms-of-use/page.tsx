import React from 'react';

export default function TermsOfUsePage() {
    return (
        <main className="min-h-screen flex flex-col items-center w-full">
            {/* Hero Section */}
            <div className="bg-[url('/blog/blog-bg.png')] w-full bg-cover bg-center text-white md:min-h-[40vh] flex flex-col justify-center items-center relative">
                <div className="absolute inset-0 bg-primary/45" />
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Terms of Use
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
                                Welcome to the Electoral Peace Hub (&quot;the Platform&quot;).
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms of Use (&quot;Terms&quot;) govern your access to and use of the Platform, developed by FIAP to promote collaboration, visibility, and resource sharing among Civil Society Organisations (CSOs) working on peacebuilding and governance across West Africa.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing or using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms.
                            </p>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                If you do not agree, please discontinue use of the Platform.
                            </p>
                        </div>

                        {/* Definitions */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                2. Definitions
                            </h2>
                            <ul className="space-y-3 list-none">
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">Platform:</strong> Electoral Peace Hub, a regional online database and collaboration hub for CSOs.
                                </li>
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">User:</strong> Any individual or organisation registered to use the Platform.
                                </li>
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">CSO Representative:</strong> An authorised representative of a registered civil society organisation.
                                </li>
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">Administrator:</strong> A person authorised to manage and maintain Platform operations, moderation, and updates.
                                </li>
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">Data:</strong> Any personal or organisational information submitted, uploaded, or collected through the Platform.
                                </li>
                                <li className="text-gray-700">
                                    <strong className="text-gray-900">Services:</strong> The functionalities and features provided, including profiles, search, forums, stories, and resource sharing.
                                </li>
                            </ul>
                        </div>

                        {/* Eligibility and Registration */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                3. Eligibility and Registration
                            </h2>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>Users must provide accurate, truthful, and up-to-date information during registration.</li>
                                <li>Only verified CSOs or their authorised representatives may create organisational profiles.</li>
                                <li>The Platform reserves the right to verify, edit, or reject any submitted information before publication.</li>
                                <li>Users are responsible for maintaining the confidentiality of their login credentials and all activities under their accounts.</li>
                                <li>Users must comply with applicable laws, regulations, and community standards while using the Platform.</li>
                            </ul>
                        </div>

                        {/* User Responsibilities and Conduct */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                4. User Responsibilities and Conduct
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Users agree to:
                            </p>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>Use the Platform solely for lawful, professional, and peacebuilding-related purposes.</li>
                                <li>Avoid uploading or distributing content that is defamatory, discriminatory, obscene, fraudulent, or violates privacy or intellectual property rights.</li>
                                <li>Refrain from disrupting or attempting to gain unauthorised access to any part of the Platform, servers, or networks.</li>
                                <li>Ensure that uploaded content (stories, posts, documents) is accurate, respectful, and relevant to the Platform&apos;s objectives.</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                Administrators may remove content that violates these Terms or community guidelines.
                            </p>
                        </div>

                        {/* Data Privacy and Security */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                5. Data Privacy and Security
                            </h2>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>All data is processed in accordance with the Privacy Policy and applicable data protection laws (including NDPR and GDPR).</li>
                                <li>Users retain responsibility for the accuracy and legality of the data they submit.</li>
                                <li>The Platform employs administrative, technical, and physical safeguards to protect data, though absolute security cannot be guaranteed.</li>
                                <li>By using the Platform, Users consent to the collection and processing of their data as described in the Privacy Policy.</li>
                            </ul>
                        </div>

                        {/* Intellectual Property Rights */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                6. Intellectual Property Rights
                            </h2>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>The Platform, including its design, software, layout, and content, is owned by FIAP and protected by copyright and other intellectual property laws.</li>
                                <li>Users retain ownership of the content they upload but grant the Platform a non-exclusive, royalty-free, worldwide license to display, distribute, and promote such content for collaboration and visibility purposes.</li>
                                <li>Unauthorised use, reproduction, or redistribution of Platform materials is prohibited.</li>
                            </ul>
                        </div>

                        {/* Availability and Maintenance */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                7. Availability and Maintenance
                            </h2>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>While the Platform strives to provide continuous service, temporary interruptions may occur during maintenance, updates, or technical issues.</li>
                                <li>The Platform team will make reasonable efforts to notify users of planned downtimes.</li>
                                <li>Technical support is available through the Platform&apos;s contact page or official support email.</li>
                            </ul>
                        </div>

                        {/* Disclaimer and Limitation of Liability */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                8. Disclaimer and Limitation of Liability
                            </h2>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis.</li>
                                <li>FIAP makes no warranties, express or implied, regarding the operation, availability, or reliability of the services.</li>
                                <li>Under no circumstances shall FIAP or its partners be liable for loss of data, business interruption, or indirect damages resulting from Platform use.</li>
                            </ul>
                        </div>

                        {/* Suspension or Termination */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                9. Suspension or Termination
                            </h2>
                            <ul className="space-y-3 list-disc pl-6 text-gray-700">
                                <li>The Platform reserves the right to suspend or terminate access to any User who violates these Terms or engages in misuse.</li>
                                <li>Termination does not affect rights or obligations accrued before termination.</li>
                                <li>Users may request account deactivation or data deletion by contacting the Platform administrators.</li>
                            </ul>
                        </div>

                        {/* Modifications to the Terms */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                10. Modifications to the Terms
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                FIAP may update or revise these Terms as needed. The most recent version will always be accessible on the Platform. Continued use signifies acceptance of any updates.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                12. Contact Information
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                For inquiries, feedback, or support regarding these Terms:
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
                                By using the Electoral Peace Hub, you acknowledge that you have read and understood these Terms of Use and agree to be bound by them.
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
                            Have Questions About Our Terms?
                        </h3>
                        <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                            Our team is here to help clarify any aspect of our Terms of Use. Don&apos;t hesitate to reach out.
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

