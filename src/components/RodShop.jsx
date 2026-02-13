import React from 'react';
import { ROD_DATA } from '../data/rodData';
import './RodShop.css';

const RodShop = ({ wallet, setWallet, currentRodLevel, setCurrentRodLevel, rodProgress }) => {

    const handleBuy = (rodId) => {
        const rod = ROD_DATA.find(r => r.id === rodId);
        if (!rod) return;

        if (wallet >= rod.price) {
            setWallet(prev => prev - rod.price);
            setCurrentRodLevel(rodId);
        }
    };

    return (
        <div className="rod-shop-container">
            <div className="rod-shop-header">
                <h2>Fishing Rods</h2>
                <div className="wallet-display">
                    <span className="coin-icon">💰</span> {wallet}
                </div>
            </div>

            <div className="rod-list">
                {ROD_DATA.map((rod, index) => {
                    const isOwned = rod.id <= currentRodLevel;
                    const isNext = rod.id === currentRodLevel + 1;

                    // Logic for unlocking:
                    // To unlock a rod, you must own the previous one and have mastered it.
                    // Rod 2 unlocks if I own Rod 1 and have mastered Rod 1.

                    const prevRod = ROD_DATA[index - 1];
                    const isUnlockable = isNext && prevRod && rodProgress >= prevRod.masteryReq;

                    // Progress for THIS rod (to unlock next)
                    // If this is the current rod, show its progress towards ITS masteryReq
                    const showProgress = rod.id === currentRodLevel && rod.id < 12; // Max level check
                    const progressPercent = showProgress
                        ? Math.min(100, (rodProgress / rod.masteryReq) * 100)
                        : 0;

                    return (
                        <div key={rod.id} className={`rod-card ${isOwned ? 'owned' : ''} ${isUnlockable ? 'unlockable' : ''} ${!isOwned && !isUnlockable ? 'locked' : ''}`}>
                            <div className="rod-info-left">
                                <img src={rod.image} alt={rod.name} className="rod-image" />
                                <div className="rod-details">
                                    <h3>{rod.name}</h3>
                                    <p className="rod-tier">Catch Tier: {Math.max(1, rod.catchTier - 2)} - {rod.catchTier}</p>
                                    {!isOwned && <p className="rod-price">${rod.price}</p>}
                                </div>
                            </div>

                            <div className="rod-actions">
                                {isOwned ? (
                                    <div className="status-owned">
                                        {rod.id === currentRodLevel ? "EQUIPPED" : "OWNED"}
                                    </div>
                                ) : (
                                    isUnlockable ? (
                                        <button
                                            className="buy-btn"
                                            onClick={() => handleBuy(rod.id)}
                                            disabled={wallet < rod.price}
                                        >
                                            BUY
                                        </button>
                                    ) : (
                                        <div className="status-locked">LOCKED</div>
                                    )
                                )}
                            </div>

                            {/* Progress Bar for Current Rod to show mastery */}
                            {showProgress && (
                                <div className="rod-progress-section">
                                    <div className="progress-label">
                                        Mastery: {rodProgress} / {rod.masteryReq} Fish
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* If locked, show requirement hint */}
                            {!isOwned && !isUnlockable && prevRod && (
                                <div className="lock-reason">
                                    Master {prevRod.name} first
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
