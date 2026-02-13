import React, { useState, useEffect, useRef } from 'react';
import { GAME_STATES, FISHING_CONFIG } from '../game-logic/constants';
import { FISH_DATA } from '../data/fishData';
import { ROD_DATA } from '../data/rodData';
import ReelingMinigame from './ReelingMinigame';
import Diary from './Diary';
import RodShop from './RodShop';
import PotionShop from './PotionShop';
import {
    playSound, startReeling, stopReeling,
    startBGM, toggleBGM, toggleSFX,
    isSfxEnabled, isBgmEnabled
} from '../audioManager';

// Asset Imports
import idleImg from '../assets/idle.png';
import castingImg from '../assets/launching fishing rod.png';
import fishingImg from '../assets/fishing.png';
import hookedImg from '../assets/hooked.png';
import reelingImg from '../assets/reeling.png';

const GameScreen = () => {
    const [gameState, setGameState] = useState(GAME_STATES.IDLE);
    const [caughtFishIds, setCaughtFishIds] = useState([]);
    const [wallet, setWallet] = useState(0);
    const [lastCaughtFish, setLastCaughtFish] = useState(null);
    const [floatingTexts, setFloatingTexts] = useState([]);

    // Progression State
    const [currentRodLevel, setCurrentRodLevel] = useState(1);
    const [rodProgress, setRodProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('inventory');

    // Buff State
    const [activeBuffs, setActiveBuffs] = useState([]);

    // UI State
    const [showHelp, setShowHelp] = useState(false);
    const [sfxOn, setSfxOn] = useState(true);
    const [bgmOn, setBgmOn] = useState(true);

    // Discovery tracking — fish IDs the player has caught at least once
    const [discoveredFishIds, setDiscoveredFishIds] = useState(new Set());

    // Game loop refs
    const gameLoopRef = useRef(null);
    const prevBuffCountRef = useRef(0);

    // Get current rod data for display
    const currentRod = ROD_DATA.find(r => r.id === currentRodLevel);

    // Start BGM on first user interaction
    useEffect(() => {
        const startAudio = () => {
            startBGM();
            window.removeEventListener('click', startAudio);
            window.removeEventListener('keydown', startAudio);
        };
        window.addEventListener('click', startAudio);
        window.addEventListener('keydown', startAudio);
        return () => {
            window.removeEventListener('click', startAudio);
            window.removeEventListener('keydown', startAudio);
        };
    }, []);

    // Cleanup expired buffs and play sound when a buff expires
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setActiveBuffs(prev => {
                const filtered = prev.filter(buff => buff.expiresAt > now);
                if (filtered.length < prev.length) {
                    playSound('potionEnd');
                }
                return filtered;
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Start/stop reeling sound with game state
    useEffect(() => {
        if (gameState === GAME_STATES.REELING) {
            startReeling();
        } else {
            stopReeling();
        }
    }, [gameState]);

    const showFloatingText = (text) => {
        const id = Date.now();
        setFloatingTexts(prev => [...prev, { id, text }]);
        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
        }, 1500);
    };

    const handleLevelUp = (newLevel) => {
        setCurrentRodLevel(newLevel);
        setRodProgress(0);
        showFloatingText("ROD UPGRADED!");
        playSound('buyRod');
    };

    const handleCatch = () => {
        setGameState(GAME_STATES.CAUGHT);
        playSound('catch');
        if (lastCaughtFish) {
            // Check for first-time discovery
            if (!discoveredFishIds.has(lastCaughtFish.id)) {
                setDiscoveredFishIds(prev => new Set([...prev, lastCaughtFish.id]));
                playSound('newItem');
                showFloatingText('✨ NEW DISCOVERY!');
            } else {
                showFloatingText('CAUGHT!');
            }

            const doubleLootBuff = activeBuffs.find(b => b.effect.type === 'double_loot');
            const doubleEverythingBuff = activeBuffs.find(b => b.effect.type === 'double_everything');
            const lootCount = (doubleLootBuff || doubleEverythingBuff) ? 2 : 1;

            for (let i = 0; i < lootCount; i++) {
                setCaughtFishIds(prev => [...prev, lastCaughtFish.id]);
            }
            setRodProgress(prev => prev + 1);
        }
    };

    const handleLose = () => {
        showFloatingText("LOST...");
        setGameState(GAME_STATES.LOST);
    };

    const resetGame = () => {
        setGameState(GAME_STATES.IDLE);
    };

    const handleCast = () => {
        if (gameState === GAME_STATES.IDLE) {
            setGameState(GAME_STATES.CASTING);
            showFloatingText("CASTING...");
            playSound('cast');
            setTimeout(() => {
                setGameState(GAME_STATES.WAITING);
                startWaitingForBite();
            }, FISHING_CONFIG.CAST_DURATION);
        }
    };

    const startWaitingForBite = () => {
        const rodBonus = (currentRodLevel - 1) * 500;
        const doubleEverythingBuff = activeBuffs.find(b => b.effect.type === 'double_everything');
        const speedMultiplier = doubleEverythingBuff ? 0.5 : 1.0;

        const baseWait = Math.random() * (FISHING_CONFIG.MAX_WAIT_TIME - FISHING_CONFIG.MIN_WAIT_TIME) + FISHING_CONFIG.MIN_WAIT_TIME;
        const waitTime = Math.max(800, (baseWait - rodBonus) * speedMultiplier);

        const currentRodData = ROD_DATA.find(r => r.id === currentRodLevel);
        const maxTier = currentRodData ? currentRodData.catchTier : 1;
        const baseLowTier = Math.max(1, maxTier - 2);

        const luckBuffs = activeBuffs.filter(b => b.effect.type === 'luck');
        const highestLuckOffset = luckBuffs.reduce((max, buff) => Math.max(max, buff.effect.tierOffset || 0), 0);
        const lowTier = Math.min(maxTier, baseLowTier + highestLuckOffset);

        let pool = FISH_DATA.filter(f => f.rarityId >= lowTier && f.rarityId <= maxTier);

        if (pool.length === 0) pool = FISH_DATA.filter(f => f.rarityId <= maxTier);
        if (pool.length === 0) pool = FISH_DATA;

        const randomFish = pool[Math.floor(Math.random() * pool.length)];
        setLastCaughtFish(randomFish);

        gameLoopRef.current = setTimeout(() => {
            setGameState(GAME_STATES.HOOKED);
            showFloatingText("!");
            setTimeout(() => playSound('hook'), 1000);
        }, waitTime);
    };

    const handleHook = () => {
        if (gameState === GAME_STATES.HOOKED) {
            setGameState(GAME_STATES.REELING);
            showFloatingText("HOOKED!");
        }
    };

    // Input handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                handleCast();
            }
        };
        const handleMouseDown = () => {
            if (gameState === GAME_STATES.HOOKED) {
                handleHook();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [gameState]);

    const getPlayerImage = () => {
        switch (gameState) {
            case GAME_STATES.CASTING: return castingImg;
            case GAME_STATES.WAITING: return fishingImg;
            case GAME_STATES.HOOKED: return hookedImg;
            case GAME_STATES.REELING: return reelingImg;
            case GAME_STATES.CAUGHT: return fishingImg;
            default: return idleImg;
        }
    };

    const handleToggleSfx = () => {
        playSound('button');
        const nowOn = toggleSFX();
        setSfxOn(nowOn);
    };

    const handleToggleBgm = () => {
        playSound('button');
        const nowOn = toggleBGM();
        setBgmOn(nowOn);
    };

    return (
        <div className="game-screen">
            {/* Top-left buttons */}
            <div className="top-buttons">
                <button className="help-btn" onClick={() => { playSound('button'); setShowHelp(true); }}>?</button>
                <button className={`toggle-btn ${sfxOn ? 'on' : 'off'}`} onClick={handleToggleSfx}>
                    {sfxOn ? '🔊' : '🔇'}
                </button>
                <button className={`toggle-btn ${bgmOn ? 'on' : 'off'}`} onClick={handleToggleBgm}>
                    {bgmOn ? '🎵' : '🎵'}
                </button>
            </div>

            {/* Help Popup */}
            {showHelp && (
                <div className="help-overlay" onClick={() => setShowHelp(false)}>
                    <div className="help-popup" onClick={(e) => e.stopPropagation()}>
                        <h2>HOW TO PLAY</h2>
                        <div className="help-section">
                            <h3>🎣 CASTING</h3>
                            <p>Press <strong>[SPACE]</strong> to cast your line into the water.</p>
                        </div>
                        <div className="help-section">
                            <h3>⏳ WAITING</h3>
                            <p>Wait for a fish to bite. A <strong>"!"</strong> will appear when something is hooked.</p>
                        </div>
                        <div className="help-section">
                            <h3>🖱️ HOOKING</h3>
                            <p><strong>Click</strong> when the fish bites to start the reeling minigame.</p>
                        </div>
                        <div className="help-section">
                            <h3>🎯 REELING</h3>
                            <p>Move your mouse to track the <strong>white spot</strong> with your <strong>green bar</strong>. Hold <strong>left click</strong> while overlapping to fill the progress bar. Reach <strong>100%</strong> to catch the fish!</p>
                        </div>
                        <div className="help-section">
                            <h3>💰 SELLING</h3>
                            <p>Switch to the <strong>Inventory</strong> tab to sell your catches for coins.</p>
                        </div>
                        <button className="help-close-btn" onClick={() => { playSound('button'); setShowHelp(false); }}>GOT IT!</button>
                    </div>
                </div>
            )}

            {/* Left Panel - Character & Minigame */}
            <div className="left-panel">
                <div className="character-area">
                    <img src={getPlayerImage()} alt="Player Character" className="character-img" />
                    {floatingTexts.map(ft => (
                        <div key={ft.id} className="floating-text">{ft.text}</div>
                    ))}
                </div>

                {gameState === GAME_STATES.REELING && lastCaughtFish && (
                    <div className="minigame-container">
                        <ReelingMinigame
                            difficulty={lastCaughtFish.difficulty}
                            rarityId={lastCaughtFish.rarityId}
                            rodLevel={currentRodLevel}
                            activeBuffs={activeBuffs}
                            onCatch={handleCatch}
                            onLose={handleLose}
                        />
                    </div>
                )}

                <div className="status-row">
                    {currentRod && (
                        <img src={currentRod.image} alt={currentRod.name} className="equipped-rod-img" />
                    )}
                    <div className="status-display-panel">
                        <p>STATUS: {gameState}</p>
                        <p>ROD: {currentRod ? currentRod.name : 'None'}</p>
                        {activeBuffs.length > 0 && (
                            <p className="active-buffs-indicator">⚡ BUFFS: {activeBuffs.length}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel - Tabs & Content */}
            <div className="right-panel">
                <div className="panel-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                        onClick={() => { playSound('button'); setActiveTab('inventory'); }}
                    >INVENTORY</button>
                    <button
                        className={`tab-btn ${activeTab === 'rod_shop' ? 'active' : ''}`}
                        onClick={() => { playSound('button'); setActiveTab('rod_shop'); }}
                    >FISHING ROD</button>
                    <button
                        className={`tab-btn ${activeTab === 'potion_shop' ? 'active' : ''}`}
                        onClick={() => { playSound('button'); setActiveTab('potion_shop'); }}
                    >POTIONS</button>
                </div>

                <div className="panel-content">
                    {activeTab === 'inventory' ? (
                        <Diary
                            caughtFishIds={caughtFishIds}
                            setCaughtFishIds={setCaughtFishIds}
                            wallet={wallet}
                            setWallet={setWallet}
                            activeBuffs={activeBuffs}
                            onClose={() => { }}
                            isAlwaysOpen={true}
                        />
                    ) : activeTab === 'rod_shop' ? (
                        <RodShop
                            wallet={wallet}
                            setWallet={setWallet}
                            currentRodLevel={currentRodLevel}
                            setCurrentRodLevel={handleLevelUp}
                            rodProgress={rodProgress}
                        />
                    ) : (
                        <PotionShop
                            wallet={wallet}
                            setWallet={setWallet}
                            activeBuffs={activeBuffs}
                            setActiveBuffs={setActiveBuffs}
                        />
                    )}
                </div>

                {/* Result Overlay */}
                {(gameState === GAME_STATES.CAUGHT || gameState === GAME_STATES.LOST) && (
                    <div className="result-overlay">
                        <div className="result-content">
                            <h2>{gameState === GAME_STATES.CAUGHT ? "FISH CAUGHT!" : "FISH LOST!"}</h2>
                            {gameState === GAME_STATES.CAUGHT && lastCaughtFish && (
                                <div className="catch-details">
                                    <p>You caught a {lastCaughtFish.name}!</p>
                                    <img src={lastCaughtFish.image} alt={lastCaughtFish.name} className="catch-image" />
                                    <p>Value: ${lastCaughtFish.value}</p>
                                </div>
                            )}
                            <button onClick={() => { playSound('button'); resetGame(); }}>FISH AGAIN</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameScreen;
