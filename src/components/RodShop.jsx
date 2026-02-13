import React from 'react';
import { ROD_DATA } from '../data/rodData';
import { FISH_DATA, RARITY_TIERS } from '../data/fishData';
import { playSound } from '../audioManager';
import { TRANSLATIONS } from '../data/translations';
import moneyIcon from '../assets/money icon.png';
import './RodShop.css';

const RodShop = ({
    wallet,
    setWallet,
    currentRodLevel,
    setCurrentRodLevel,
    rodProgress,
    language = 'en',
    discoveredFishIds
}) => {
    const t = TRANSLATIONS[language];

    const handleBuy = (rodId) => {
        const rod = ROD_DATA.find(r => r.id === rodId);
        if (!rod) return;

        if (wallet >= rod.price) {
            setWallet(prev => prev - rod.price);
            setCurrentRodLevel(rodId);
            playSound('buyRod');
        }
    };

    return (
        <div className="rod-shop-container">
            <div className="rod-shop-header">
                <h2>{t.FISHING_ROD}</h2>
                <div className="wallet-display">
                    <img src={moneyIcon} alt="Coins" className="wallet-coin-icon" /> {wallet}
                </div>
            </div>

            <div className="rod-list">
                {ROD_DATA.map((rod, index) => {
                    const isOwned = rod.id <= currentRodLevel;
                    const isCurrent = rod.id === currentRodLevel;
                    const isNext = rod.id === currentRodLevel + 1;

                    // 1. Data Analysis
                    const fishInThisTier = FISH_DATA.filter(f => f.rarityId === rod.catchTier);
                    const caughtCount = fishInThisTier.filter(f => discoveredFishIds.has(f.id)).length;
                    const isCollectionComplete = fishInThisTier.length > 0 && caughtCount === fishInThisTier.length;

                    const isMasteryComplete =
                        rod.id < currentRodLevel ||
                        (isCurrent && (rod.masteryReq === 0 || rodProgress >= rod.masteryReq));

                    // Final Mastered state: both collection finished AND mastery reached
                    const isFullyCompleted = isCollectionComplete && isMasteryComplete;

                    // 2. Unlock Requirements for Next Rod
                    const prevRod = ROD_DATA[index - 1];
                    let prevCollectionComplete = true;
                    if (prevRod) {
                        const fishInPrevTier = FISH_DATA.filter(f => f.rarityId === prevRod.catchTier);
                        prevCollectionComplete = fishInPrevTier.every(f => discoveredFishIds.has(f.id));
                    }
                    const isUnlockable = isNext && prevRod && rodProgress >= prevRod.masteryReq && prevCollectionComplete;

                    // 3. UI Helper Data
                    const minTier = Math.max(1, rod.catchTier - 2);
                    const maxTier = rod.catchTier;
                    const catchableRarities = [];
                    for (let i = minTier; i <= maxTier; i++) {
                        catchableRarities.push(t[`RARITY_${i}`] || RARITY_TIERS[i].name);
                    }

                    const showMasteryProgress = isCurrent && rod.id < 12;
                    const masteryPercent = showMasteryProgress ? Math.min(100, (rodProgress / rod.masteryReq) * 100) : 0;

                    const showDiscoveryProgress = isOwned || isUnlockable;
                    const discoveryPercent = fishInThisTier.length > 0 ? (caughtCount / fishInThisTier.length) * 100 : 0;

                    return (
                        <div
                            key={rod.id}
                            className={`rod-card ${isOwned ? 'owned' : ''} ${isUnlockable ? 'unlockable' : ''} ${!isOwned && !isUnlockable ? 'locked' : ''} ${isFullyCompleted ? 'mastered' : ''}`}
                        >
                            <div className="rod-info-left">
                                <div className="rod-image-container">
                                    <img src={rod.image} alt={rod.name} className="rod-image" />
                                </div>
                                <div className="rod-details">
                                    <div className="rod-name-row">
                                        <h3 className={isFullyCompleted ? 'mastered-text' : ''}>
                                            {t[`rod_${rod.id}`] || rod.name}
                                        </h3>
                                    </div>
                                    <p className="rarity-info">
                                        <strong>{t.CATCHABLE_RARITIES}:</strong> {catchableRarities.join(', ')}
                                    </p>
                                    {!isOwned && <p className="rod-price">${rod.price}</p>}
                                </div>
                            </div>

                            <div className="rod-actions">
                                {isOwned ? (
                                    <div className={`status-owned ${isFullyCompleted ? 'mastered-text' : ''}`}>
                                        {isCurrent ? t.EQUIPPED : t.OWNED}
                                    </div>
                                ) : (
                                    <div className="buy-actions">
                                        {isUnlockable ? (
                                            <button
                                                className="buy-btn"
                                                onClick={() => handleBuy(rod.id)}
                                                disabled={wallet < rod.price}
                                            >
                                                {t.BUY}
                                            </button>
                                        ) : (
                                            <div className="status-locked">{t.LOCKED}</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Discover/Collection Progress (New Fish Types) */}
                            {showDiscoveryProgress && (
                                <div className="rod-progress-section discovery">
                                    <div className="progress-label">
                                        {t.NEW_FISH_TYPES}: {caughtCount} / {fishInThisTier.length}
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill discovery-fill" style={{ width: `${discoveryPercent}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Mastery Progress */}
                            {showMasteryProgress && (
                                <div className="rod-progress-section mastery">
                                    <div className="progress-label">
                                        {t.MASTERY}: {rodProgress} / {rod.masteryReq} {t.FISH}
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill mastery-fill" style={{ width: `${masteryPercent}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Lock Reasons */}
                            {!isOwned && !isUnlockable && prevRod && (
                                <div className="lock-reasons">
                                    {(rod.id > currentRodLevel + 1 || rodProgress < prevRod.masteryReq) && (
                                        <div className="lock-reason">
                                            ❌ {t.MASTER_FIRST_HINT.replace('{name}', t[`rod_${prevRod.id}`] || prevRod.name)}
                                        </div>
                                    )}
                                    {(rod.id > currentRodLevel + 1 || !prevCollectionComplete) && (
                                        <div className="lock-reason">
                                            ❌ {t.REQ_CATCH_ALL.replace('{rarity}', t[`RARITY_${prevRod.catchTier}`] || RARITY_TIERS[prevRod.catchTier].name)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RodShop;
