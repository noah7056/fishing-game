import React, { useState, useMemo } from 'react';
import './FishCatalogue.css';
import { RARITY_TIERS } from '../data/fishData';
import { CHEST_DATA } from '../data/chestData';

const FishCatalogue = ({ fishData, discoveredFishIds, redeemedFishIds, onRedeem, filter, setFilter, t, language }) => {
    const [hoveredFish, setHoveredFish] = useState(null);

    // Filter and Sort Logic
    const sortedFish = useMemo(() => {
        const allItems = [...fishData, ...CHEST_DATA];
        let sorted = [...allItems];

        if (filter === 'rarity') {
            sorted.sort((a, b) => b.rarityId - a.rarityId); // Highest rarity first
        } else if (filter === 'price') {
            sorted.sort((a, b) => b.value - a.value); // Most expensive first
        } else if (filter === 'name') {
            sorted.sort((a, b) => {
                const nameA = t[a.rarityId === 13 ? a.id : 'fish_' + a.id] || a.name;
                const nameB = t[b.rarityId === 13 ? b.id : 'fish_' + b.id] || b.name;
                return nameA.localeCompare(nameB);
            });
        }
        return sorted;
    }, [fishData, filter, t]);

    // Calculate Stats
    const totalFish = fishData.length + CHEST_DATA.length;
    const discoveredCount = discoveredFishIds.size;

    return (
        <div className="catalogue-container">
            <div className="catalogue-header">
                <div className="catalogue-stats">
                    {(t.DISCOVERED_COUNT || 'Discovered: {current}/{total}').replace('{current}', discoveredCount).replace('{total}', totalFish)}
                </div>
                <div className="catalogue-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        {t.ALL || 'ALL'}
                    </button>
                    <button
                        className={`filter-btn ${filter === 'rarity' ? 'active' : ''}`}
                        onClick={() => setFilter('rarity')}
                    >
                        {t.SORT_RARITY || 'Rarity'}
                    </button>
                    <button
                        className={`filter-btn ${filter === 'price' ? 'active' : ''}`}
                        onClick={() => setFilter('price')}
                    >
                        {t.PRICE || 'Price'}
                    </button>
                    <button
                        className={`filter-btn ${filter === 'name' ? 'active' : ''}`}
                        onClick={() => setFilter('name')}
                    >
                        {t.SORT_NAME || 'Name'}
                    </button>
                </div>
            </div>

            <div className="catalogue-grid">
                {sortedFish.map(fish => {
                    const isDiscovered = discoveredFishIds.has(fish.id);
                    const isRedeemed = redeemedFishIds.has(fish.id);
                    const isClaimable = isDiscovered && !isRedeemed;

                    return (
                        <div
                            key={fish.id}
                            className={`catalogue-item rarity-${fish.rarityId} ${fish.rarityId === 13 ? 'chest' : ''} ${!isDiscovered ? 'undiscovered' : isClaimable ? 'claimable' : 'redeemed'}`}
                            onMouseEnter={() => setHoveredFish(fish)}
                            onMouseLeave={() => setHoveredFish(null)}
                            onClick={() => {
                                if (isClaimable) {
                                    onRedeem(fish);
                                }
                            }}
                        >
                            {isDiscovered && <img src={fish.image} alt={fish.name} className="fish-icon" />}
                            {isClaimable && <div className="claim-indicator">!</div>}
                        </div>
                    );
                })}
            </div>

            {/* Details Card (Bottom Overlay) */}
            {hoveredFish && (
                <div className="fish-detail-card">
                    {(() => {
                        const isDiscovered = discoveredFishIds.has(hoveredFish.id);
                        const isChest = hoveredFish.rarityId === 13;
                        const rarityName = isChest ? (t.RARITY_13 || 'Special') : (t[`RARITY_${hoveredFish.rarityId}`] || RARITY_TIERS[hoveredFish.rarityId].name);
                        const rarityColor = isChest ? '#ffd700' : RARITY_TIERS[hoveredFish.rarityId].color;

                        const nameKey = isChest ? hoveredFish.id : 'fish_' + hoveredFish.id;
                        const descKey = isChest ? hoveredFish.id + '_desc' : 'fish_' + hoveredFish.id + '_desc';

                        const name = isDiscovered ? (t[nameKey] || hoveredFish.name) : (t.FISH_NAME_LOCKED || '???');
                        const desc = isDiscovered ? (t[descKey] || hoveredFish.description) : (t.FISH_DESC_LOCKED || '???');

                        let price = '??? G';
                        if (isDiscovered) {
                            if (isChest) {
                                price = `${t.GOLD_RANGE || 'Gold'}: ${hoveredFish.goldMin}-${hoveredFish.goldMax}`;
                            } else {
                                price = `${hoveredFish.value} G`;
                            }
                        }

                        return (
                            <>
                                <div className="detail-image-container" style={{ borderColor: rarityColor, boxShadow: `0 0 15px ${rarityColor}40` }}>
                                    <img
                                        src={hoveredFish.image}
                                        alt={name}
                                        className={`detail-image ${isDiscovered ? '' : 'undiscovered'}`}
                                    />
                                </div>
                                <div className="detail-info">
                                    <h2 className="detail-name" style={{ color: rarityColor }}>{name}</h2>
                                    <div className="detail-meta">
                                        <span className="detail-rarity">{rarityName}</span>
                                        <span>•</span>
                                        <span className="detail-price">{price}</span>
                                    </div>
                                    <p className="detail-desc">{desc}</p>
                                    {isChest && isDiscovered && (
                                        <div className="chest-drops-preview">
                                            <small>{t.CONTAINS || 'Contains'}:</small>
                                            <div className="drop-icons">
                                                {hoveredFish.dropTable.map(rid => (
                                                    <span key={rid} style={{ color: RARITY_TIERS[rid].color, fontSize: '1.2rem', marginRight: '5px' }}>●</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default FishCatalogue;
