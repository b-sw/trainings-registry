import { useEffect, useState } from 'react';
import { publicApi } from '../utils/api';
import movingSvg from '../welcome/moving.svg';
import { GoogleLoginButton } from './GoogleLoginButton';

export function Landing() {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const [totalKilometers, setTotalKilometers] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;
        publicApi
            .getTotalKilometers()
            .then((res) => {
                if (isMounted) setTotalKilometers(res.totalKilometers);
            })
            .catch((err) => {
                console.error('Failed to load total kilometers', err);
            });
        return () => {
            isMounted = false;
        };
    }, []);
    return (
        <div
            className="min-h-screen flex flex-col justify-center relative gap-8"
            style={{ backgroundColor: '#ffec3d', fontFamily: 'Oswald, sans-serif' }}
        >
            {/* Main row: left and right columns */}
            <div className="flex flex-col">
                <div className="flex justify-center gap-24">
                    {/* Left side - Main text */}
                    <div className="hidden sm:flex flex-col leading-none">
                        <h1
                            className="font-black text-blue-600"
                            style={{
                                fontFamily: 'Oswald, sans-serif',
                                fontSize: 'clamp(48px, 12vw, 208px)',
                            }}
                        >
                            MOVE
                            <br />
                            FOR
                            <br />
                            UKRAINE
                        </h1>
                    </div>

                    {/* Right side - Info and actions */}
                    <div className="flex flex-col justify-between">
                        {/* Top right - Donation info */}
                        <div
                            className="hidden sm:block text-right"
                            style={{ fontSize: 'clamp(18px, 2.5vw, 48px)' }}
                        >
                            <p className="font-semibold text-black leading-tight text-left uppercase inline-block">
                                <span className="font-bold" style={{ color: '#0161D5' }}>
                                    Box.org
                                </span>{' '}
                                will make
                                <br />a donation to the
                                <br />
                                <span className="font-bold" style={{ color: '#0161D5' }}>
                                    Rehabilitation Center
                                </span>
                                <br />
                                <a
                                    href="https://superhumans.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold underline"
                                    style={{ color: '#0161D5' }}
                                >
                                    Superhumans
                                </a>{' '}
                                for
                                <br />
                                every kilometer
                                <br />
                                you move!
                            </p>
                        </div>

                        {/* Middle right - Fit-content Login button */}
                        <div className="row-start-2 justify-self-center sm:justify-self-end text-center sm:text-right">
                            <div className="inline-block w-auto">
                                <GoogleLoginButton className="!bg-[#0161D5] hover:!bg-[#0152b5] !text-white !font-bold !rounded-full !shadow-lg hover:!shadow-xl !p-[clamp(12px,3vw,48px)]">
                                    TRACK YOUR MOVEMENT
                                </GoogleLoginButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar - Left and right blocks together (in flow) */}
            <div className="flex flex-col">
                <div className="hidden sm:flex justify-center items-center gap-24">
                    <div
                        className="font-black text-black"
                        style={{
                            fontFamily: 'Oswald, sans-serif',
                            fontSize: 'clamp(32px, 8vw, 128px)',
                            lineHeight: 1,
                        }}
                    >
                        AUGUST 12-26
                    </div>
                    <div
                        className="flex flex-col font-semibold text-black text-left"
                        style={{ fontSize: 'clamp(16px, 2vw, 36px)' }}
                    >
                        <div>
                            Share your achievements at{' '}
                            <span className="text-[#0161D5] font-bold">#move-for-ukraine</span>
                        </div>
                        <div>
                            As of {today}, we've moved for{' '}
                            <span className="text-[#0161D5] font-bold">
                                {totalKilometers !== null ? `${totalKilometers}km` : '...'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle - SVG illustration (top half) */}
            <div className="absolute left-1/2 top-1/4 sm:top-0 items-center justify-center transform -translate-x-1/2 scale-90">
                <img
                    src={movingSvg}
                    alt="Person running"
                    className="w-full h-auto max-h-full object-contain"
                />
            </div>
        </div>
    );
}
