import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TRANSLATIONS } from '../data/translations';

const ReelingMinigame = ({ difficulty = 1, rarityId = 1, rodLevel = 1, activeBuffs = [], onCatch, onLose, language = 'en', paused = false }) => {
    const t = TRANSLATIONS[language];
    const [fishPosition, setFishPosition] = useState(50);
    const [cursorPosition, setCursorPosition] = useState(50);
    const [progress, setProgress] = useState(0);
    const [isReeling, setIsReeling] = useState(false);
    const [caught, setCaught] = useState(false);

    const barRef = useRef(null);
    const requestRef = useRef();
    const progressRef = useRef(0);
    const fishPosRef = useRef(50);
    const cursorRef = useRef(50);
    const isReelingRef = useRef(false);
    const caughtRef = useRef(false);

    // Movement state refs (avoid stale closures)
    const impulseRef = useRef(0);
    const lastImpulseTimeRef = useRef(0);
    const dartTargetRef = useRef(50);

    // Calculate bonuses
    const accuracyBuff = activeBuffs.find(b => b.effect.type === 'accuracy');
    const speedBuff = activeBuffs.find(b => b.effect.type === 'speed');
    const doubleEverythingBuff = activeBuffs.find(b => b.effect.type === 'double_everything');

    const rodBarBonus = (rodLevel - 1) * 2;
    let cursorWidth = 60 + rodBarBonus;
    if (accuracyBuff || doubleEverythingBuff) {
        cursorWidth *= (accuracyBuff?.effect.multiplier || 2.0);
    }

    let progressGainRate = 0.4;
    if (speedBuff) progressGainRate *= speedBuff.effect.multiplier;
    if (doubleEverythingBuff) progressGainRate *= 2.0;
    progressGainRate += (rodLevel - 1) * 0.02;

    // Store gain rate in ref for game loop
    const gainRateRef = useRef(progressGainRate);
    gainRateRef.current = progressGainRate;

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (barRef.current) {
                const rect = barRef.current.getBoundingClientRect();
                const relativeX = e.clientX - rect.left;
                const pos = (relativeX / rect.width) * 100;
                const clamped = Math.max(0, Math.min(100, pos));
                cursorRef.current = clamped;
                setCursorPosition(clamped);
            }
        };

        const handleMouseUp = () => { isReelingRef.current = false; setIsReeling(false); };

        // Listen to global move/up to handle dragging outside
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent text selection
        isReelingRef.current = true;
        setIsReeling(true);
    };

    // Fish movement function — returns position 5-95 based on time and rarity
    const getFishPosition = useCallback((time) => {
        if (rarityId <= 2) {
            // PATTERN 1: Rod 1-2 (Dull, Common) - Very Easy
            const speed = 0.0008;
            const pos = 50 + Math.sin(time * speed) * 35;
            return Math.max(10, Math.min(90, pos));
        } else if (rarityId <= 5) {
            // PATTERN 2: Rod 3-5 (Uncommon, Rare, Exotic) - Varied, slightly faster
            const speed = 0.0012;
            const primary = Math.sin(time * speed) * 40;
            const secondary = Math.cos(time * speed * 2.5) * 10;
            return Math.max(10, Math.min(90, 50 + primary + secondary));
        } else if (rarityId <= 8) {
            // PATTERN 3: Rod 6-8 (Mythical, Legendary, Ethereal) - Challenging
            const speed = 0.0018;
            const primary = Math.sin(time * speed) * 40;
            const fastWobble = Math.sin(time * speed * 5) * 15;
            return Math.max(5, Math.min(95, 50 + primary + fastWobble));
        } else if (rarityId <= 11) {
            // PATTERN 4: Rod 9-11 (Celestial, Abyssal, Primordial) - Hard, erratic
            const speed = 0.0025;
            const primary = Math.sin(time * speed) * 35;
            const erratic = Math.sin(time * speed * 3.7 + Math.sin(time * 0.005)) * 20;
            return Math.max(5, Math.min(95, 50 + primary + erratic));
        } else {
            // PATTERN 5: Rod 12 (Cosmic/Special) - Master
            const speed = 0.003;
            // Darting behavior
            const now = time;
            if (now - lastImpulseTimeRef.current > 500) {
                lastImpulseTimeRef.current = now;
                dartTargetRef.current = Math.random() * 80 + 10;
            }
            // Lerp towards dart target
            const currentImpulse = impulseRef.current;
            impulseRef.current += (dartTargetRef.current - 50 - currentImpulse) * 0.1;

            const primary = Math.sin(time * speed) * 20;
            return Math.max(5, Math.min(95, 50 + primary + impulseRef.current));
        }
    }, [rarityId]);

    // Main game loop — runs via requestAnimationFrame
    // Main game loop — runs via requestAnimationFrame
    useEffect(() => {
        const gameLoop = () => {
            if (paused) {
                // Keep loop running but don't update state
                requestRef.current = requestAnimationFrame(gameLoop);
                return;
            }

            if (caughtRef.current) return;

            const time = Date.now();
            const newFishPos = getFishPosition(time);
            fishPosRef.current = newFishPos;
            setFishPosition(newFishPos);

            // Check overlap — tolerance in percentage points
            const barWidth = barRef.current ? barRef.current.getBoundingClientRect().width : 400;
            const cursorWidthPercent = (cursorWidth / barWidth) * 100;
            const tolerance = cursorWidthPercent / 2;
            const distance = Math.abs(fishPosRef.current - cursorRef.current);
            const inZone = distance < tolerance;

            // Progress logic
            let newProgress = progressRef.current;
            if (isReelingRef.current && inZone) {
                newProgress = Math.min(100, newProgress + gainRateRef.current);
            } else {
                newProgress = Math.max(0, newProgress - 0.15);
            }
            progressRef.current = newProgress;
            setProgress(newProgress);

            // Check win
            if (newProgress >= 100 && !caughtRef.current) {
                caughtRef.current = true;
                setCaught(true);
                // Brief delay so the bar visually fills to 100% before transitioning
                setTimeout(() => {
                    onCatch();
                }, 300);
                return;
            }

            requestRef.current = requestAnimationFrame(gameLoop);
        };

        requestRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [getFishPosition, cursorWidth, onCatch, paused]);


    return (
        <div className="minigame-ui" onMouseDown={handleMouseDown}>
            <p className="minigame-hint">{t.REELING_HINT}</p>
            <div className="game-bar-container" ref={barRef}>
                <div className="game-bar">
                    {/* The "Bright Spot" Fish */}
                    <div
                        className="fish-spot-indicator"
                        style={{
                            left: `${fishPosition}%`,
                            boxShadow: `0 0 ${15 + (Math.sin(Date.now() * 0.005) * 3)}px 8px rgba(255, 255, 200, 0.9)`
                        }}
                    ></div>

                    {/* Player Cursor */}
                    <div
                        className="cursor-indicator"
                        style={{
                            left: `${cursorPosition}%`,
                            width: `${cursorWidth}px`
                        }}
                    ></div>
                </div>

                <div className="stats-bars">
                    <div className="bar-label">{t.REELING_PROGRESS}</div>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%`, background: '#4DB6AC' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReelingMinigame;
