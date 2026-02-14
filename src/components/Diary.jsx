import React, { useMemo, useState } from 'react';
import { FISH_DATA, RARITY_TIERS } from '../data/fishData';
import { CHEST_DATA } from '../data/chestData';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../audioManager';
import './Diary.css';

import sellingIcon from '../assets/selling icon.png';
import moneyIcon from '../assets/money icon.png';

const Diary = ({ caughtFishIds, setCaughtFishIds, wallet, setWallet, activeBuffs = [], onClose, isAlwaysOpen, language = 'en', sortBy, setSortBy }) => {
    const t = TRANSLATIONS[language];

    // Check for double money buff
    const doubleEverythingBuff = activeBuffs.find(b => b.effect.type === 'double_everything');
    const moneyMultiplier = doubleEverythingBuff ? 2.0 : 1.0;

    const [chestReward, setChestReward] = useState(null);

    // Combine all potential items
    const ALL_ITEMS = useMemo(() => [...FISH_DATA, ...CHEST_DATA], []);

    // Group fish by ID and count them
    const inventory = useMemo(() => {
        const counts = {};
        caughtFishIds.forEach(id => {
            counts[id] = (counts[id] || 0) + 1;
        });
        return counts;
    }, [caughtFishIds]);

    // Get unique fish objects that we have at least one of
    const uniqueCaughtFish = ALL_ITEMS
        .filter(fish => inventory[fish.id] > 0)
        .sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = t[`fish_${a.id}`] || a.name;
                const nameB = t[`fish_${b.id}`] || b.name;
                return nameA.localeCompare(nameB, language);
            } else {
                // Rarity Descending (12 -> 1)
                return b.rarityId - a.rarityId;
            }
        });

    const handleSell = (fishId, amount) => {
        const fishParams = FISH_DATA.find(f => f.id === fishId);
        if (!fishParams) return;

        let countToRemove = 0;

        if (amount === 'all') {
            countToRemove = inventory[fishId];
        } else {
            countToRemove = 1;
        }

        // Calculate value with money multiplier
        const totalValue = Math.floor(fishParams.value * countToRemove * moneyMultiplier);

        // Remove from inventory array
        let removedCount = 0;
        const newCaughtIds = caughtFishIds.filter(id => {
            if (id === fishId && removedCount < countToRemove) {
                removedCount++;
                return false; // Remove this one
            }
            return true; // Keep this one
        });

        setCaughtFishIds(newCaughtIds);
        setWallet(prev => prev + totalValue);
        playSound('sell');
        setCaughtFishIds(newCaughtIds);
        setWallet(prev => prev + totalValue);
        playSound('sell');
    };

    const handleOpenChest = (chestId) => {
        const chest = CHEST_DATA.find(c => c.id === chestId);
        if (!chest) return;

        // Remove one chest
        const index = caughtFishIds.indexOf(chestId);
        if (index === -1) return;

        let newIds = [...caughtFishIds];
        newIds.splice(index, 1);

        // Generate Gold
        const gold = Math.floor(Math.random() * (chest.goldMax - chest.goldMin + 1)) + chest.goldMin;

        // Generate Fish (2-4 items)
        const fishCount = Math.floor(Math.random() * 3) + 2;
        const fishRewards = [];

        for (let i = 0; i < fishCount; i++) {
            const rarityId = chest.dropTable[Math.floor(Math.random() * chest.dropTable.length)];
            const potentialFish = FISH_DATA.filter(f => f.rarityId === rarityId);
            const rewardFish = potentialFish[Math.floor(Math.random() * potentialFish.length)];
            fishRewards.push(rewardFish);
            newIds.push(rewardFish.id);
        }

        // Add Rewards
        setCaughtFishIds(newIds);
        setWallet(prev => prev + gold);

        setChestReward({
            chestId: chest.id,
            chestName: chest.name,
            gold,
            fishRewards
        });
        playSound('newItem');
    };

    const closeRewardPopup = () => {
        setChestReward(null);
    };

    const handleSellEverything = () => {
        let totalValue = 0;
        const chestIds = new Set(CHEST_DATA.map(c => c.id));

        // Only sell fish, keep chests
        const idsToKeep = [];

        caughtFishIds.forEach(id => {
            if (chestIds.has(id)) {
                idsToKeep.push(id);
            } else {
                const fish = FISH_DATA.find(f => f.id === id);
                if (fish) totalValue += fish.value;
            }
        });

        // Apply money multiplier
        totalValue = Math.floor(totalValue * moneyMultiplier);

        setCaughtFishIds(idsToKeep);
        setWallet(prev => prev + totalValue);
        playSound('sell');
    };

    return (
        <div className={`diary-overlay ${isAlwaysOpen ? 'always-open' : ''}`}>

            {chestReward && (
                <div className="result-overlay" style={{ zIndex: 2000, position: 'fixed' }}>
                    <div className="result-content" style={{ minWidth: '350px', background: '#050510', border: '2px solid #ffd700' }}>
                        <h3 style={{ marginTop: 0, color: '#ffd700', textTransform: 'uppercase' }}>
                            {t.OPEN_CHEST} {t[chestReward.chestId] || chestReward.chestName}
                        </h3>

                        <div className="reward-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                            gap: '15px',
                            margin: '20px 0',
                            justifyContent: 'center'
                        }}>
                            {/* Gold Reward */}
                            <div className="reward-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img src={moneyIcon} alt="Gold" style={{ width: '40px', marginBottom: '5px' }} />
                                <span style={{ color: 'gold', fontWeight: 'bold' }}>+{chestReward.gold}</span>
                            </div>

                            {/* Fish Rewards */}
                            {chestReward.fishRewards.map((fish, idx) => (
                                <div key={idx} className="reward-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={fish.image} alt={fish.name} style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '5px', imageRendering: 'pixelated' }} />
                                    <span style={{ fontSize: '0.7rem', textAlign: 'center' }}>{t[`fish_${fish.id}`] || fish.name}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={closeRewardPopup} style={{ border: '1px solid #ffd700', color: '#ffd700' }}>
                            {t.TUTORIAL_GOT_IT || 'Got it!'}
                        </button>
                    </div>
                </div>
            )}

            <div className="diary-container">
                <div className="diary-header">
                    <h2>{t.INVENTORY}</h2>
                    <div className="wallet-display">
                        <img src={moneyIcon} alt="Coins" className="wallet-coin-icon" /> {wallet}
                    </div>
                </div>

                <div className="inventory-controls">
                    <span>{t.SORT_BY}:</span>
                    <button
                        className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                        onClick={() => { playSound('button'); setSortBy('name'); }}
                    >{t.SORT_NAME}</button>
                    <button
                        className={`sort-btn ${sortBy === 'rarity' ? 'active' : ''}`}
                        onClick={() => { playSound('button'); setSortBy('rarity'); }}
                    >{t.SORT_RARITY}</button>
                </div>

                {uniqueCaughtFish.length === 0 ? (
                    <div className="empty-state">
                        <p>{t.NO_FISH_CAUGHT || 'No fish caught yet.'}</p>
                    </div>
                ) : (
                    <>
                        <div className="inventory-actions">
                            <button className="sell-all-btn" onClick={handleSellEverything}>
                                {t.SELL_ALL} (${caughtFishIds.reduce((sum, id) => sum + (FISH_DATA.find(f => f.id === id)?.value || 0), 0)})
                            </button>
                        </div>
                        <div className="fish-grid">
                            {uniqueCaughtFish.map(item => {
                                const isChest = item.rarityId === 13;
                                const rarity = isChest ? { name: t.RARITY_13, color: '#ffd700' } : RARITY_TIERS[item.rarityId];

                                return (
                                    <div
                                        key={item.id}
                                        className={`fish-card caught ${isChest ? 'chest-card' : ''}`}
                                        style={{ borderColor: rarity.color }}
                                    >
                                        <div className="fish-count">x{inventory[item.id]}</div>
                                        <img src={item.image} alt={item.name} className="fish-thumb" />
                                        <div className="fish-info">
                                            <h3>{isChest ? (t[item.id] || item.name) : (t[`fish_${item.id}`] || item.name)}</h3>
                                            <p className="fish-rarity" style={{ color: rarity.color }}>
                                                {isChest ? (t.RARITY_13 || 'Special') : (t[`RARITY_${item.rarityId}`] || rarity.name)}
                                            </p>
                                            <p className="fish-value">
                                                {isChest ? `${t.GOLD_RANGE}: ${item.goldMin}-${item.goldMax}` : `$${item.value}`}
                                            </p>
                                        </div>
                                        <div className="fish-actions">
                                            {isChest ? (
                                                <button className="open-btn" onClick={() => handleOpenChest(item.id)}>{t.OPEN_CHEST}</button>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleSell(item.id, 1)}>{t.SELL_ONE || 'Sell 1'}</button>
                                                    <button onClick={() => handleSell(item.id, 'all')}>{t.SELL_ALL_BTN || 'Sell All'}</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Diary;
