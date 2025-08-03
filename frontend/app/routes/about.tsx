export default function About() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">About Trainings Registry</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <p className="text-gray-600">
                    Trainings Registry is a comprehensive platform designed to help professionals
                    and organizations discover, manage, and track training courses and
                    certifications.
                </p>

                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
                    <p className="text-gray-600">
                        We believe that continuous learning is essential for professional growth.
                        Our mission is to make it easier for individuals and organizations to find,
                        access, and manage high-quality training programs.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">What We Offer</h2>
                    <p className="text-gray-600">
                        Our platform provides a centralized registry of training courses across
                        various industries and skill areas. Whether you're looking to enhance your
                        technical skills, develop leadership capabilities, or earn industry
                        certifications, we've got you covered.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Technology</h2>
                    <p className="text-gray-600">
                        This application is built with modern web technologies including React,
                        TypeScript, React Router, and Vite with Server-Side Rendering for optimal
                        performance and SEO.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Typography</h2>
                    <p className="text-gray-600">
                        We use <strong>Kumbh Sans</strong> for beautiful, readable text and{' '}
                        <code className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                            JetBrains Mono
                        </code>{' '}
                        for code snippets and technical content. These fonts provide excellent
                        readability and a modern, professional appearance.
                    </p>
                </div>
            </div>
        </div>
    )
}
