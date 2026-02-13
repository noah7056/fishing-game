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
    startBGM, toggleBGM, toggleWaves, toggleSFX,
    isSfxEnabled, isBgmEnabled, isWavesEnabled,
    setBgmVolume, setWavesVolume, setSfxVolume, getVolumes
} from '../audioManager';
import { TRANSLATIONS } from '../data/translations';

// Asset Imports
import idleImg from '../assets/idle.png';
import castingImg from '../assets/launching fishing rod.png';
import fishingImg from '../assets/fishing.png';
import hookedImg from '../assets/hooked.png';
import reelingImg from '../assets/reeling.png';
import settingsIcon from '../assets/settings.png';
import volumeIcon from '../assets/volume.png';
import muteIcon from '../assets/mute.png';

// Help & UI Icons
import castingIcon from '../assets/casting icon.png';
import waitingIcon from '../assets/waiting icon.png';
import hookingIcon from '../assets/hooking icon.png';
import reelingIcon from '../assets/reeling icon.png';
import sellingIcon from '../assets/selling icon.png';
import saveIcon from '../assets/save.png';
import warningIcon from '../assets/warning.png';

const GameScreen = () => {
    // Persistent State Initializers
    const [caughtFishIds, setCaughtFishIds] = useState(() => {
        const saved = localStorage.getItem('fishing_inventory');
        return saved ? JSON.parse(saved) : [];
    });
    const [wallet, setWallet] = useState(() => {
        const saved = localStorage.getItem('fishing_wallet');
        return saved ? Number(saved) : 0;
    });
    const [currentRodLevel, setCurrentRodLevel] = useState(() => {
        const saved = localStorage.getItem('fishing_rod_level');
        return saved ? Number(saved) : 1;
    });
    const [rodProgress, setRodProgress] = useState(() => {
        const saved = localStorage.getItem('fishing_rod_progress');
        return saved ? Number(saved) : 0;
    });
    const [discoveredFishIds, setDiscoveredFishIds] = useState(() => {
        const saved = localStorage.getItem('fishing_discovered');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [sfxOn, setSfxOn] = useState(() => {
        const saved = localStorage.getItem('fishing_sfx_enabled');
        return saved !== null ? JSON.parse(saved) : isSfxEnabled();
    });
    const [bgmOn, setBgmOn] = useState(() => {
        const saved = localStorage.getItem('fishing_bgm_enabled');
        return saved !== null ? JSON.parse(saved) : isBgmEnabled();
    });
    const [wavesOn, setWavesOn] = useState(() => {
        const saved = localStorage.getItem('fishing_waves_enabled');
        return saved !== null ? JSON.parse(saved) : isWavesEnabled();
    });
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('fishing_language');
        return saved || 'en';
    });

    // Settings UI State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState('volume'); // 'volume', 'howto', 'progress', or 'language'
    const [volumes, setVolumes] = useState(() => getVolumes());
    const [importString, setImportString] = useState('');
    const [progressMessage, setProgressMessage] = useState('');

    // Temp UI/Game State
    const [gameState, setGameState] = useState(GAME_STATES.IDLE);
    const [lastCaughtFish, setLastCaughtFish] = useState(null);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory');
    const [activeBuffs, setActiveBuffs] = useState([]);
    const [showHelp, setShowHelp] = useState(false);

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('fishing_inventory', JSON.stringify(caughtFishIds));
        localStorage.setItem('fishing_wallet', wallet.toString());
        localStorage.setItem('fishing_rod_level', currentRodLevel.toString());
        localStorage.setItem('fishing_rod_progress', rodProgress.toString());
        localStorage.setItem('fishing_discovered', JSON.stringify([...discoveredFishIds]));
        localStorage.setItem('fishing_sfx_enabled', JSON.stringify(sfxOn));
        localStorage.setItem('fishing_bgm_enabled', JSON.stringify(bgmOn));
        localStorage.setItem('fishing_language', language);
    }, [caughtFishIds, wallet, currentRodLevel, rodProgress, discoveredFishIds, sfxOn, bgmOn, language]);

    // Game loop refs
    const gameLoopRef = useRef(null);
    const hookTimersRef = useRef([]);
    const prevBuffCountRef = useRef(0);

    // Get current rod data for display
    const currentRod = ROD_DATA.find(r => r.id === currentRodLevel);
    const t = TRANSLATIONS[language];

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
        showFloatingText(t.ROD_LABEL + " UPGRADED!");
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
                showFloatingText(t.NEW_DISCOVERY);
            } else {
                showFloatingText(t.CAUGHT_LABEL);
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
        showFloatingText(t.LOST_LABEL);
        setGameState(GAME_STATES.LOST);
        // Automatically go back to idle after 1 second
        setTimeout(resetGame, 1000);
    };

    const resetGame = () => {
        // Clear any lingering hook timers
        hookTimersRef.current.forEach(t => clearTimeout(t));
        hookTimersRef.current = [];
        setGameState(GAME_STATES.IDLE);
    };

    const handleCast = () => {
        if (gameState === GAME_STATES.IDLE) {
            setGameState(GAME_STATES.CASTING);
            showFloatingText(t.CASTING + "...");
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
            playSound('hook');

            // Clear any old timers just in case
            hookTimersRef.current.forEach(t => clearTimeout(t));
            hookTimersRef.current = [];

            // Schedule dot sequence
            const intervals = [1000, 2000, 3000];
            const dots = [".", "..", "..."];

            intervals.forEach((ms, idx) => {
                const t = setTimeout(() => {
                    setGameState(prev => {
                        if (prev === GAME_STATES.HOOKED) {
                            showFloatingText(dots[idx]);
                        }
                        return prev;
                    });
                }, ms);
                hookTimersRef.current.push(t);
            });

            // Final Fail Timeout
            const failT = setTimeout(() => {
                setGameState(prev => {
                    if (prev === GAME_STATES.HOOKED) {
                        showFloatingText("...!");
                        playSound('hook');
                        setTimeout(resetGame, 1000);
                        return GAME_STATES.LOST;
                    }
                    return prev;
                });
            }, FISHING_CONFIG.HOOK_TIMEOUT);
            hookTimersRef.current.push(failT);
        }, waitTime);
    };

    const handleHook = () => {
        if (gameState === GAME_STATES.HOOKED) {
            // Clear all dot/fail timers
            hookTimersRef.current.forEach(t => clearTimeout(t));
            hookTimersRef.current = [];

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

    const handleToggleWaves = () => {
        playSound('button');
        const nowOn = toggleWaves();
        setWavesOn(nowOn);
    };

    const handleVolumeChange = (type, value) => {
        const v = parseFloat(value);
        if (type === 'bgm') setBgmVolume(v);
        if (type === 'waves') setWavesVolume(v);
        if (type === 'sfx') setSfxVolume(v);
        setVolumes(getVolumes());
    };

    const handleResetProgress = () => {
        const confirmText = t.ARE_YOU_SURE;
        if (window.confirm(confirmText)) {
            localStorage.clear();
            setCaughtFishIds([]);
            setWallet(0);
            setCurrentRodLevel(1);
            setRodProgress(0);
            setDiscoveredFishIds(new Set());
            setActiveBuffs([]);
            setGameState(GAME_STATES.IDLE);
            setProgressMessage(t.RESET_SUCCESS);
            playSound('button');
            setTimeout(() => setProgressMessage(''), 3000);
        }
    };

    const handleExportSave = () => {
        const saveData = {
            inventory: caughtFishIds,
            wallet: wallet,
            rodLevel: currentRodLevel,
            rodProgress: rodProgress,
            discovered: [...discoveredFishIds],
            timestamp: Date.now()
        };
        const encoded = btoa(JSON.stringify(saveData));
        navigator.clipboard.writeText(encoded);
        setProgressMessage(t.SAVE_COPIED);
        playSound('button');
        setTimeout(() => setProgressMessage(''), 3000);
    };

    const handleImportSave = () => {
        if (!importString) return;
        try {
            const decoded = JSON.parse(atob(importString));
            const hasExistingProgress = wallet > 0 || currentRodLevel > 1 || caughtFishIds.length > 0;

            const apply = () => {
                setCaughtFishIds(decoded.inventory || []);
                setWallet(decoded.wallet || 0);
                setCurrentRodLevel(decoded.rodLevel || 1);
                setRodProgress(decoded.rodProgress || 0);
                setDiscoveredFishIds(new Set(decoded.discovered || []));
                setImportString('');
                setProgressMessage(t.SAVE_APPLIED);
                playSound('buyRod');
                setTimeout(() => setProgressMessage(''), 3000);
            };

            if (hasExistingProgress) {
                if (window.confirm(t.IMPORT_CONFIRM)) {
                    apply();
                }
            } else {
                apply();
            }
        } catch (e) {
            setProgressMessage(t.INVALID_SAVE);
            setTimeout(() => setProgressMessage(''), 3000);
        }
    };

    return (
        <div className="game-screen">
            {/* Top-left buttons */}
            <div className="top-buttons">
                <button
                    className="settings-btn"
                    onClick={() => { playSound('button'); setIsSettingsOpen(true); }}
                >
                    <img src={settingsIcon} alt="Settings" />
                </button>
            </div>

            {/* Settings Overlay */}
            {isSettingsOpen && (
                <div className="settings-overlay" onClick={() => setIsSettingsOpen(false)}>
                    <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="settings-tabs">
                            <button
                                className={`settings-tab-btn ${settingsTab === 'volume' ? 'active' : ''}`}
                                onClick={() => { playSound('button'); setSettingsTab('volume'); }}
                            >{t.VOLUME}</button>
                            <button
                                className={`settings-tab-btn ${settingsTab === 'howto' ? 'active' : ''}`}
                                onClick={() => { playSound('button'); setSettingsTab('howto'); }}
                            >{t.HOW_TO}</button>
                            <button
                                className={`settings-tab-btn ${settingsTab === 'progress' ? 'active' : ''}`}
                                onClick={() => { playSound('button'); setSettingsTab('progress'); }}
                            >{t.PROGRESS}</button>
                            <button
                                className={`settings-tab-btn ${settingsTab === 'language' ? 'active' : ''}`}
                                onClick={() => { playSound('button'); setSettingsTab('language'); }}
                            >{t.LANGUAGE}</button>
                            <button className="settings-tab-close-x" onClick={() => setIsSettingsOpen(false)}>×</button>
                        </div>

                        <div className="settings-content">
                            {settingsTab === 'volume' ? (
                                <div className="volume-settings">
                                    <div className="volume-row">
                                        <div className="volume-label-row">
                                            <span>{t.MUSIC}</span>
                                            <button
                                                className={`toggle-icon-btn ${bgmOn ? 'on' : 'off'}`}
                                                onClick={handleToggleBgm}
                                            >
                                                <img src={bgmOn ? volumeIcon : muteIcon} alt="Toggle Music" />
                                            </button>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.05"
                                            value={volumes.bgm}
                                            onChange={(e) => handleVolumeChange('bgm', e.target.value)}
                                        />
                                    </div>
                                    <div className="volume-row">
                                        <div className="volume-label-row">
                                            <span>{t.SEA_WAVES}</span>
                                            <button
                                                className={`toggle-icon-btn ${wavesOn ? 'on' : 'off'}`}
                                                onClick={handleToggleWaves}
                                            >
                                                <img src={wavesOn ? volumeIcon : muteIcon} alt="Toggle Waves" />
                                            </button>
                                        </div>
                                        <input
                                            type="range" min="0" max="0.5" step="0.01"
                                            value={volumes.waves}
                                            onChange={(e) => handleVolumeChange('waves', e.target.value)}
                                        />
                                    </div>
                                    <div className="volume-row">
                                        <div className="volume-label-row">
                                            <span>{t.SOUND_EFFECTS}</span>
                                            <button
                                                className={`toggle-icon-btn ${sfxOn ? 'on' : 'off'}`}
                                                onClick={handleToggleSfx}
                                            >
                                                <img src={sfxOn ? volumeIcon : muteIcon} alt="Toggle SFX" />
                                            </button>
                                        </div>
                                        <input
                                            type="range" min="0" max="2" step="0.1"
                                            value={volumes.sfx}
                                            onChange={(e) => handleVolumeChange('sfx', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : settingsTab === 'howto' ? (
                                <div className="howto-content">
                                    <div className="help-section">
                                        <h3><img src={castingIcon} alt="" className="help-heading-icon" /> {t.CASTING}</h3>
                                        <p>{t.CAST_DESC}</p>
                                    </div>
                                    <div className="help-section">
                                        <h3><img src={waitingIcon} alt="" className="help-heading-icon" /> {t.WAITING}</h3>
                                        <p>{t.WAIT_DESC}</p>
                                    </div>
                                    <div className="help-section">
                                        <h3><img src={hookingIcon} alt="" className="help-heading-icon" /> {t.HOOKING}</h3>
                                        <p>{t.HOOK_DESC}</p>
                                    </div>
                                    <div className="help-section">
                                        <h3><img src={reelingIcon} alt="" className="help-heading-icon" /> {t.REELING}</h3>
                                        <p>{t.REEL_DESC}</p>
                                    </div>
                                    <div className="help-section">
                                        <h3><img src={sellingIcon} alt="" className="help-heading-icon" /> {t.SELLING}</h3>
                                        <p>{t.SELL_DESC}</p>
                                    </div>
                                </div>
                            ) : settingsTab === 'progress' ? (
                                <div className="progress-settings">
                                    <div className="progress-section">
                                        <h3><img src={saveIcon} alt="" className="help-heading-icon" /> {t.SAVE_STATE}</h3>
                                        <p>{t.SAVE_STATE_DESC}</p>
                                        <div className="progress-actions">
                                            <button className="export-btn" onClick={handleExportSave}>{t.EXPORT_BTN}</button>
                                            <div className="import-row">
                                                <input
                                                    type="text"
                                                    placeholder={t.IMPORT_PLACEHOLDER}
                                                    value={importString}
                                                    onChange={(e) => setImportString(e.target.value)}
                                                />
                                                <button className="import-btn" onClick={handleImportSave}>{t.IMPORT_BTN}</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="progress-section danger">
                                        <h3><img src={warningIcon} alt="" className="help-heading-icon" /> {t.RESET_PROGRESS}</h3>
                                        <p>{t.RESET_PROGRESS_DESC}</p>
                                        <button className="reset-btn" onClick={handleResetProgress}>{t.RESET_BTN}</button>
                                    </div>

                                    {progressMessage && (
                                        <div className="progress-status-message">{progressMessage}</div>
                                    )}
                                </div>
                            ) : (
                                <div className="language-settings">
                                    <div className="language-section">
                                        <h3>🌐 {t.LANGUAGE}</h3>
                                        <div className="language-options">
                                            <button
                                                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                                                onClick={() => { playSound('button'); setLanguage('en'); }}
                                            >English</button>
                                            <button
                                                className={`lang-btn ${language === 'zh' ? 'active' : ''}`}
                                                onClick={() => { playSound('button'); setLanguage('zh'); }}
                                            >简体中文</button>
                                            <button
                                                className={`lang-btn ${language === 'es' ? 'active' : ''}`}
                                                onClick={() => { playSound('button'); setLanguage('es'); }}
                                            >Español</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
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
                            language={language}
                        />
                    </div>
                )}

                <div className="status-row">
                    {currentRod && (
                        <img src={currentRod.image} alt={currentRod.name} className="equipped-rod-img" />
                    )}
                    <div className="status-display-panel">
                        <p>{t.STATUS}: {t[`STATUS_${gameState}`] || gameState}</p>
                        <p>{t.ROD_LABEL}: {currentRod ? (t[`rod_${currentRod.id}`] || currentRod.name) : 'None'}</p>
                        {activeBuffs.length > 0 && (
                            <p className="active-buffs-indicator">⚡ {t.BUFFS_LABEL}: {activeBuffs.length}</p>
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
                    >{t.INVENTORY}</button>
                    <button
                        className={`tab-btn ${activeTab === 'rod_shop' ? 'active' : ''}`}
                        onClick={() => { playSound('button'); setActiveTab('rod_shop'); }}
                    >{t.FISHING_ROD}</button>
                    <button
                        className={`tab-btn ${activeTab === 'potion_shop' ? 'active' : ''}`}
                        onClick={() => { playSound('button'); setActiveTab('potion_shop'); }}
                    >{t.POTIONS}</button>
                </div>

                <div className="panel-content">
                    {activeTab === 'inventory' ? (
                        <Diary
                            caughtFishIds={caughtFishIds}
                            setCaughtFishIds={setCaughtFishIds}
                            wallet={wallet}
                            setWallet={setWallet}
                            activeBuffs={activeBuffs}
                            language={language}
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
                            language={language}
                        />
                    ) : (
                        <PotionShop
                            wallet={wallet}
                            setWallet={setWallet}
                            activeBuffs={activeBuffs}
                            setActiveBuffs={setActiveBuffs}
                            language={language}
                        />
                    )}
                </div>

                {/* Result Overlay - Only for success now */}
                {(gameState === GAME_STATES.CAUGHT) && (
                    <div className="result-overlay">
                        <div className="result-content">
                            {gameState === GAME_STATES.CAUGHT && (
                                <div className="catch-details">
                                    <p>{t.CAUGHT_FISH_DESC.replace('{name}', t[`fish_${lastCaughtFish.id}`] || lastCaughtFish.name)}</p>
                                    <img src={lastCaughtFish.image} alt={lastCaughtFish.name} className="catch-image" />
                                    <p>{t.VALUE}: ${lastCaughtFish.value}</p>
                                </div>
                            )}
                            <button onClick={() => { playSound('button'); resetGame(); }}>{t.FISH_AGAIN}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameScreen;
