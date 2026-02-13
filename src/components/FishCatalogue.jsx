import React, { useState, useMemo } from 'react';
import './FishCatalogue.css';
import { RARITY_TIERS } from '../data/fishData';

const FishCatalogue = ({ fishData, discoveredFishIds, redeemedFishIds, onRedeem, t, language }) => {
    const [filter, setFilter] = useState('all'); // all, rarity, price
    const [hoveredFish, setHoveredFish] = useState(null);

    // Filter and Sort Logic
    const sortedFish = useMemo(() => {
        let sorted = [...fishData];
        if (filter === 'rarity') {
            sorted.sort((a, b) => b.rarityId - a.rarityId); // Highest rarity first
        } else if (filter === 'price') {
            sorted.sort((a, b) => b.value - a.value); // Most expensive first
        } else if (filter === 'name') {
            sorted.sort((a, b) => {
                const nameA = t['fish_' + a.id] || a.name;
                const nameB = t['fish_' + b.id] || b.name;
                return nameA.localeCompare(nameB);
            });
        }
        return sorted;
    }, [fishData, filter, t]);

    // Calculate Stats
    const totalFish = fishData.length;
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
                            className={`catalogue-item rarity-${fish.rarityId} ${!isDiscovered ? 'undiscovered' : isClaimable ? 'claimable' : 'redeemed'}`}
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
                        const rarityName = t[`RARITY_${hoveredFish.rarityId}`] || RARITY_TIERS[hoveredFish.rarityId].name;
                        const rarityColor = RARITY_TIERS[hoveredFish.rarityId].color;

                        const name = isDiscovered ? (t['fish_' + hoveredFish.id] || hoveredFish.name) : (t.FISH_NAME_LOCKED || '???');
                        const desc = isDiscovered ? (t['fish_' + hoveredFish.id + '_desc'] || hoveredFish.description) : (t.FISH_DESC_LOCKED || '???');
                        const price = isDiscovered ? `${hoveredFish.value} G` : '??? G';

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
