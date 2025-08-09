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
            className="min-h-screen flex flex-col justify-center relative"
            style={{ backgroundColor: '#ffec3d', fontFamily: 'Oswald, sans-serif' }}
        >
            {/* Main row: left and right columns */}
            <div className="flex w-full">
                {/* Left side - Main text */}
                <div className="hidden sm:flex w-1/2 flex flex-col items-start pl-16 pr-8 py-12 gap-8">
                    <h1
                        className="font-black text-blue-600"
                        style={{
                            fontFamily: 'Oswald, sans-serif',
                            fontSize: 'clamp(48px, 12vw, 216px)',
                            lineHeight: 1,
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
                <div className="w-full sm:w-1/2 grid grid-rows-[auto_1fr] gap-y-6 sm:gap-y-22 pr-6 sm:pr-16 pl-6 sm:pl-8 py-12">
                    {/* Top right - Donation info */}
                    <div
                        className="hidden sm:block text-right"
                        style={{ fontSize: 'clamp(18px, 3.5vw, 48px)' }}
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
                            <GoogleLoginButton className="!w-auto !bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-12 !px-12 !rounded-full !border-0 !shadow-lg hover:!shadow-xl">
                                TRACK YOUR MOVEMENT
                            </GoogleLoginButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar - Left and right blocks together (in flow) */}
            <div className="hidden sm:flex w-full px-16 py-6 justify-between items-center">
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
                <div className="text-right" style={{ fontSize: 'clamp(16px, 2.5vw, 36px)' }}>
                    <p className="font-semibold text-black leading-tight inline-block text-left">
                        Share your achievements at{' '}
                        <span className="text-blue-600 font-bold">#move-for-ukraine</span>
                        <br />
                        As of {today}, we've moved for{' '}
                        <span className="text-blue-600 font-bold">
                            {totalKilometers !== null ? `${totalKilometers}km` : '...'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Middle - SVG illustration (top half) */}
            <div className="hidden sm:flex absolute left-1/2 top-0 items-center justify-center transform -translate-x-1/2">
                <img
                    src={movingSvg}
                    alt="Person running"
                    className="w-full h-auto max-h-full object-contain"
                />
            </div>
        </div>
    );
}
