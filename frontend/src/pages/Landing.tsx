import { GoogleLoginButton } from '../components/GoogleLoginButton'

export const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Mobile-only centered layout */}
            <div className="lg:hidden min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center text-white p-6">
                <div className="text-center space-y-8 max-w-sm">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black leading-tight">
                            <span className="text-yellow-300">TRAIN</span>
                            <br />
                            <span className="text-white">FOR SUCCESS</span>
                        </h1>
                        <p className="text-lg">
                            Join our training community and achieve your goals!
                        </p>
                    </div>

                    <div className="py-4">
                        <GoogleLoginButton>
                            Sign in to start training!
                        </GoogleLoginButton>
                    </div>
                </div>
            </div>

            {/* Desktop layout */}
            {/* Left Panel - Brand/Content */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-100 to-gray-50 p-10 items-center justify-center">
                <div className="max-w-2xl">
                    <div className="space-y-4 mb-12">
                        <h1 className="text-6xl xl:text-8xl font-black leading-none tracking-tighter">
                            <span className="text-yellow-500">TRAIN</span>
                            <br />
                            <span className="text-blue-600">FOR</span>
                            <br />
                            <span className="text-blue-600">SUCCESS</span>
                        </h1>

                        <div className="flex flex-col space-y-3 ml-12">
                            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl inline-block max-w-fit">
                                <p className="text-xl font-medium">
                                    Build your skills with
                                </p>
                            </div>
                            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl inline-block max-w-fit ml-8">
                                <p className="text-xl font-medium">
                                    personalized training!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl xl:text-4xl font-bold text-blue-600">
                            START YOUR JOURNEY TODAY
                        </h2>
                        <p className="text-lg xl:text-xl font-semibold text-blue-600">
                            Track progress • Join challenges • Achieve goals
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 p-10 flex-col justify-center items-center text-white">
                <div className="text-center space-y-8 max-w-lg">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold">
                            Join our training community!
                        </h3>
                        <div className="text-xl leading-relaxed space-y-2">
                            <p>Track your training progress,</p>
                            <p>compete in challenges, and</p>
                            <p>connect with fellow learners</p>
                            <p>on your journey to excellence.</p>
                        </div>
                    </div>

                    <div className="py-8">
                        <GoogleLoginButton>
                            Sign in to start training!
                        </GoogleLoginButton>
                    </div>

                    <div className="text-lg">
                        <p>Ready to transform your skills?</p>
                        <p className="text-2xl font-bold mt-2">
                            Let's get started!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing
