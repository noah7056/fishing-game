import React, { useState, useEffect, useRef, useCallback } from 'react';

const ReelingMinigame = ({ difficulty = 1, rarityId = 1, rodLevel = 1, activeBuffs = [], onCatch, onLose }) => {
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

                if (e.buttons === 1) {
                    isReelingRef.current = true;
                    setIsReeling(true);
                } else {
                    isReelingRef.current = false;
                    setIsReeling(false);
                }
            }
        };

        const handleMouseDown = () => { isReelingRef.current = true; setIsReeling(true); };
        const handleMouseUp = () => { isReelingRef.current = false; setIsReeling(false); };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Fish movement function — returns position 5-95 based on time and rarity
    const getFishPosition = useCallback((time) => {
        if (rarityId <= 3) {
            // LOW RARITY: Gentle swerve — slow sine, small amplitude
            const speed = 0.0008 + (rarityId * 0.0001);
            const pos = 50 + Math.sin(time * speed) * 30;
            // Small secondary wobble
            const wobble = Math.sin(time * speed * 2.7) * 5;
            return Math.max(5, Math.min(95, pos + wobble));
        } else if (rarityId <= 6) {
            // MID RARITY: Moderate swerve with direction changes
            const speed = 0.0012 + (rarityId * 0.00015);
            const primary = Math.sin(time * speed) * 35;
            const secondary = Math.sin(time * speed * 1.8 + 1.5) * 12;
            const tertiary = Math.cos(time * speed * 3.1) * 6;
            return Math.max(5, Math.min(95, 50 + primary + secondary + tertiary));
        } else if (rarityId <= 9) {
            // HIGH RARITY: Fast zigzag with sudden reversals
            const speed = 0.002 + (rarityId * 0.0002);
            const primary = Math.sin(time * speed) * 38;
            const zigzag = Math.sin(time * speed * 4.3) * 10;
            // Sharp reversals via sign function
            const sharpTurn = Math.sign(Math.sin(time * speed * 2.5)) * 8;
            return Math.max(5, Math.min(95, 50 + primary + zigzag + sharpTurn));
        } else {
            // TOP RARITY (10-12): Erratic darting with random impulse offsets
            const speed = 0.003 + ((rarityId - 10) * 0.0005);
            const primary = Math.sin(time * speed) * 30;
            const fast = Math.sin(time * speed * 5.7) * 12;

            // Update dart target every ~400-800ms
            const now = time;
            if (now - lastImpulseTimeRef.current > 400 + Math.sin(now * 0.001) * 200) {
                lastImpulseTimeRef.current = now;
                dartTargetRef.current = 10 + Math.abs(Math.sin(now * 0.0073) * 80);
            }
            // Lerp towards dart target
            const currentImpulse = impulseRef.current;
            impulseRef.current += (dartTargetRef.current - 50 - currentImpulse) * 0.08;

            return Math.max(5, Math.min(95, 50 + primary + fast + impulseRef.current * 0.3));
        }
    }, [rarityId]);

    // Main game loop — runs via requestAnimationFrame
    useEffect(() => {
        const gameLoop = () => {
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
    }, [getFishPosition, cursorWidth, onCatch]);

    return (
        <div className="minigame-ui">
            <p className="minigame-hint">Hold Click & Track the Light!</p>
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
                    <div className="bar-label">Progress</div>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%`, background: '#4DB6AC' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReelingMinigame;
