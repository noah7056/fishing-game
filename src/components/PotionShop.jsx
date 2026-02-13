import React from 'react';
import { POTION_DATA } from '../data/potionData';
import { playSound } from '../audioManager';
import './PotionShop.css';
import sellingIcon from '../assets/selling icon.png';

const PotionShop = ({ wallet, setWallet, activeBuffs, setActiveBuffs }) => {

    const handleBuy = (potion) => {
        if (wallet < potion.price) return;
        playSound('potionUse');

        // Check if this potion is already active
        const alreadyActive = activeBuffs.find(b => b.potionId === potion.id);
        if (alreadyActive) {
            // Extend duration or do nothing (let's extend for user-friendliness)
            setActiveBuffs(prev => prev.map(b =>
                b.potionId === potion.id
                    ? { ...b, expiresAt: Date.now() + potion.duration }
                    : b
            ));
        } else {
            // Add new buff
            setActiveBuffs(prev => [...prev, {
                potionId: potion.id,
                effect: potion.effect,
                expiresAt: Date.now() + potion.duration
            }]);
        }

        setWallet(prev => prev - potion.price);
    };

    const getTimeRemaining = (potionId) => {
        const buff = activeBuffs.find(b => b.potionId === potionId);
        if (!buff) return null;

        const remaining = Math.max(0, buff.expiresAt - Date.now());
        const seconds = Math.floor(remaining / 1000);
        return seconds;
    };

    return (
        <div className="potion-shop-container">
            <div className="potion-shop-header">
                <h2>Potion Shop</h2>
                <div className="wallet-display">
                    <img src={sellingIcon} alt="Coins" className="wallet-coin-icon" /> {wallet}
                </div>
            </div>

            <div className="potion-grid">
                {POTION_DATA.map(potion => {
                    const isActive = activeBuffs.find(b => b.potionId === potion.id);
                    const timeLeft = getTimeRemaining(potion.id);

                    return (
                        <div key={potion.id} className={`potion-card ${isActive ? 'active' : ''}`}>
                            <img src={potion.image} alt={potion.name} className="potion-image" />
                            <div className="potion-info">
                                <h3>{potion.name}</h3>
                                <p className="potion-description">{potion.description}</p>
                                <p className="potion-duration">Duration: {potion.duration / 1000}s</p>
                                <p className="potion-price">${potion.price}</p>
                            </div>
                            <div className="potion-actions">
                                {isActive ? (
                                    <div className="active-status">
                                        ACTIVE - {timeLeft}s
                                    </div>
                                ) : (
                                    <button
                                        className="buy-potion-btn"
                                        onClick={() => handleBuy(potion)}
                                        disabled={wallet < potion.price}
                                    >
                                        BUY
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PotionShop;
