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
    discoveredFishIds,
    collectedRewards,
    setCollectedRewards
}) => {
    const t = TRANSLATIONS[language];

    const handleBuy = (rodId) => {
        const rod = ROD_DATA.find(r => r.id === rodId);
        if (!rod) return;

        if (wallet >= rod.price) {
            setWallet(prev => prev - rod.price);
            setCurrentRodLevel(rodId);
        }
    };

    const handleCollectReward = (rodId, amount) => {
        if (collectedRewards.has(rodId)) return;

        playSound('button');
        playSound('buyRod'); // Use buying sound as requested
        setWallet(prev => prev + amount);
        setCollectedRewards(prev => new Set([...prev, rodId]));
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
                    const isNext = rod.id === currentRodLevel + 1;

                    // New Fish Info
                    const minTier = Math.max(1, rod.catchTier - 2);
                    const maxTier = rod.catchTier;
                    const catchableRarities = [];
                    for (let i = minTier; i <= maxTier; i++) {
                        catchableRarities.push(t[`RARITY_${i}`] || RARITY_TIERS[i].name);
                    }

                    const fishInThisTier = FISH_DATA.filter(f => f.rarityId === rod.catchTier);
                    const caughtCount = fishInThisTier.filter(f => discoveredFishIds.has(f.id)).length;
                    const isCollectionComplete = caughtCount === fishInThisTier.length;
                    const hasReward = isCollectionComplete && !collectedRewards.has(rod.id);
                    const rewardAmount = Math.floor(fishInThisTier.reduce((sum, f) => sum + f.value, 0) * 2);

                    // Requirement check for next rod
                    const prevRod = ROD_DATA[index - 1];
                    let prevCollectionComplete = true;
                    if (prevRod) {
                        const fishInPrevTier = FISH_DATA.filter(f => f.rarityId === prevRod.catchTier);
                        prevCollectionComplete = fishInPrevTier.every(f => discoveredFishIds.has(f.id));
                    }

                    const isUnlockable = isNext && prevRod && rodProgress >= prevRod.masteryReq && prevCollectionComplete;

                    const showProgress = rod.id === currentRodLevel && rod.id < 12;
                    const progressPercent = showProgress
                        ? Math.min(100, (rodProgress / rod.masteryReq) * 100)
                        : 0;

                    return (
                        <div key={rod.id} className={`rod-card ${isOwned ? 'owned' : ''} ${isUnlockable ? 'unlockable' : ''} ${!isOwned && !isUnlockable ? 'locked' : ''}`}>
                            <div className="rod-info-left">
                                <div className="rod-image-container">
                                    <img src={rod.image} alt={rod.name} className="rod-image" />
                                </div>
                                <div className="rod-details">
                                    <div className="rod-name-row">
                                        <h3>{t[`rod_${rod.id}`] || rod.name}</h3>
                                        {isOwned && isCollectionComplete && (
                                            <span className="collection-badge">🏆</span>
                                        )}
                                    </div>
                                    <p className="rarity-info">
                                        <strong>{t.CATCHABLE_RARITIES}:</strong> {catchableRarities.join(', ')}
                                    </p>
                                    <p className="new-fish-info">
                                        <strong>{t.NEW_FISH_TYPES}:</strong> {caughtCount} / {fishInThisTier.length}
                                    </p>
                                    {!isOwned && <p className="rod-price">${rod.price}</p>}
                                </div>
                            </div>

                            <div className="rod-actions">
                                {isOwned ? (
                                    <div className="owned-actions">
                                        <div className="status-owned">
                                            {rod.id === currentRodLevel ? t.EQUIPPED : t.OWNED}
                                        </div>
                                        {hasReward && (
                                            <button
                                                className="collect-btn"
                                                onClick={() => handleCollectReward(rod.id, rewardAmount)}
                                            >
                                                🎁 {t.COLLECT} (+${rewardAmount})
                                            </button>
                                        )}
                                        {isCollectionComplete && collectedRewards.has(rod.id) && (
                                            <span className="collected-tag">{t.REWARD_COLLECTED}</span>
                                        )}
                                    </div>
                                ) : (
                                    isUnlockable ? (
                                        <button
                                            className="buy-btn"
                                            onClick={() => handleBuy(rod.id)}
                                            disabled={wallet < rod.price}
                                        >
                                            {t.BUY}
                                        </button>
                                    ) : (
                                        <div className="status-locked">{t.LOCKED}</div>
                                    )
                                )}
                            </div>

                            {/* Mastery Progress */}
                            {showProgress && (
                                <div className="rod-progress-section">
                                    <div className="progress-label">
                                        {t.MASTERY}: {rodProgress} / {rod.masteryReq} {t.FISH}
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Lock Reasons */}
                            {!isOwned && !isUnlockable && prevRod && (
                                <div className="lock-reasons">
                                    {rodProgress < prevRod.masteryReq && (
                                        <div className="lock-reason">
                                            ❌ {t.MASTER_FIRST_HINT.replace('{name}', t[`rod_${prevRod.id}`] || prevRod.name)}
                                        </div>
                                    )}
                                    {!prevCollectionComplete && (
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
