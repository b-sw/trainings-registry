export default function About() {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-oswald font-bold text-gray-900">
                    ABOUT MOVE FOR UKRAINE 2025
                </h1>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6 text-sm">
                    <p className="text-gray-700">
                        The war in Ukraine is not over. Every day, Ukrainians — both defenders and
                        civilians — continue to suffer. Many are injured, displaced, and living
                        through the unimaginable. Among them are thousands who have lost limbs and
                        are now beginning the long journey of physical and emotional recovery.
                    </p>

                    <p className="text-gray-700">
                        <strong>Move for Ukraine 2025</strong> is our collective response — a
                        two-week movement to show solidarity, raise awareness, and generate
                        life-changing support. From August 12 to 26, every kilometer walked, run, or
                        moved will help fund critical rehabilitation for those affected by the war.
                    </p>

                    <p className="text-gray-700">
                        Last year, our community came together across countries and time zones,
                        moving thousands of kilometers and raising meaningful support. This year,
                        we’re back — stronger and more determined.
                    </p>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">How it works</h2>
                        <p className="text-gray-700 mb-2">
                            For every kilometer logged during the campaign, Box.org will donate to
                            Superhumans — a Ukrainian nonprofit building a world-class center for
                            physical and psychological rehabilitation. Superhumans provides:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>Advanced prosthetics</li>
                            <li>Reconstructive surgery</li>
                            <li>Mental health support</li>
                            <li>Long-term care for war victims and veterans</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                            Their mission is simple yet profound: help Ukrainians not just survive —
                            but thrive again.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Be a part of it
                        </h2>
                        <p className="text-gray-700 mb-2">
                            This year, we’re recognizing top contributors in three categories:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>🏃 Running</li>
                            <li>🚴 Cycling</li>
                            <li>🚶 Walking and moving</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                            We'll celebrate 3 winners and 9 top contributors — but every single step
                            matters. Whether it’s a daily walk or a weekend bike ride, your movement
                            can fuel someone else’s healing.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Why we move</h2>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>Because the war is still real.</li>
                            <li>Because healing takes more than time — it takes action.</li>
                            <li>Because hope is built together.</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            Let’s turn our everyday movement into momentum for recovery. Let’s help
                            rebuild lives, step by step!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
