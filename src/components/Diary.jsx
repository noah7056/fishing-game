import React, { useMemo, useState } from 'react';
import { FISH_DATA, RARITY_TIERS } from '../data/fishData';
import { TRANSLATIONS } from '../data/translations';
import './Diary.css';

import sellingIcon from '../assets/selling icon.png';
import moneyIcon from '../assets/money icon.png';

const Diary = ({ caughtFishIds, setCaughtFishIds, wallet, setWallet, activeBuffs = [], onClose, isAlwaysOpen, language = 'en' }) => {
    const t = TRANSLATIONS[language];
    const [sortBy, setSortBy] = useState('rarity'); // 'rarity' or 'name'

    // Check for double money buff
    const doubleEverythingBuff = activeBuffs.find(b => b.effect.type === 'double_everything');
    const moneyMultiplier = doubleEverythingBuff ? 2.0 : 1.0;

    // Group fish by ID and count them
    const inventory = useMemo(() => {
        const counts = {};
        caughtFishIds.forEach(id => {
            counts[id] = (counts[id] || 0) + 1;
        });
        return counts;
    }, [caughtFishIds]);

    // Get unique fish objects that we have at least one of
    const uniqueCaughtFish = FISH_DATA
        .filter(fish => inventory[fish.id] > 0)
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
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
    };

    const handleSellEverything = () => {
        let totalValue = 0;
        caughtFishIds.forEach(id => {
            const fish = FISH_DATA.find(f => f.id === id);
            if (fish) totalValue += fish.value;
        });

        // Apply money multiplier
        totalValue = Math.floor(totalValue * moneyMultiplier);

        setCaughtFishIds([]);
        setWallet(prev => prev + totalValue);
        playSound('sell');
    };

    return (
        <div className={`diary-overlay ${isAlwaysOpen ? 'always-open' : ''}`}>
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
                            {uniqueCaughtFish.map(fish => {
                                const rarity = RARITY_TIERS[fish.rarityId];
                                return (
                                    <div
                                        key={fish.id}
                                        className="fish-card caught"
                                        style={{ borderColor: rarity.color }}
                                    >
                                        <div className="fish-count">x{inventory[fish.id]}</div>
                                        <img src={fish.image} alt={fish.name} className="fish-thumb" />
                                        <div className="fish-info">
                                            <h3>{t[`fish_${fish.id}`] || fish.name}</h3>
                                            <p className="fish-rarity" style={{ color: rarity.color }}>{t[`RARITY_${fish.rarityId}`] || rarity.name}</p>
                                            <p className="fish-value">${fish.value}</p>
                                        </div>
                                        <div className="fish-actions">
                                            <button onClick={() => handleSell(fish.id, 1)}>{t.SELL_ONE || 'Sell 1'}</button>
                                            <button onClick={() => handleSell(fish.id, 'all')}>{t.SELL_ALL_BTN || 'Sell All'}</button>
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
