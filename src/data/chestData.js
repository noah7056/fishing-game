import woodenCrate from '../assets/wooden crate.png';
import ironChest from '../assets/iron chest.png';
import treasureChest from '../assets/treasure chest.png';
import obscureChest from '../assets/obscure chest.png';

export const CHEST_DATA = [
    {
        id: 'chest_wood',
        name: 'Wooden Crate',
        rarityId: 13, // Special Rarity
        rodReq: [1, 5],
        goldMin: 25,
        goldMax: 75,
        dropTable: [1, 2, 3], // Dull, Common, Uncommon
        image: woodenCrate,
        description: 'Looks abandoned, but might have something inside.',
        difficulty: 0.5,
        minigameRarity: 1, // Matches lowest fish tier for Rod 1
        value: 100
    },
    {
        id: 'chest_iron',
        name: 'Iron Chest',
        rarityId: 13,
        rodReq: [4, 8],
        goldMin: 100,
        goldMax: 250,
        dropTable: [4, 5, 6], // Rare, Exotic, Mythical
        image: ironChest,
        description: 'Heavy and sturdy. Requires a decent rod to pull up.',
        difficulty: 1.5,
        minigameRarity: 2, // Matches lowest fish tier for Rod 4
        value: 300
    },
    {
        id: 'chest_gold',
        name: 'Treasure Chest',
        rarityId: 13,
        rodReq: [7, 11],
        goldMin: 500,
        goldMax: 1500,
        dropTable: [7, 8, 9], // Legendary, Ethereal, Celestial
        image: treasureChest,
        description: 'Sparkling with gold and gems.',
        difficulty: 3.0,
        minigameRarity: 5, // Matches lowest fish tier for Rod 7
        value: 1000
    },
    {
        id: 'chest_shadow',
        name: 'Obscure Chest',
        rarityId: 13,
        rodReq: [10, 12],
        goldMin: 2500,
        goldMax: 7500,
        dropTable: [10, 11, 12], // Abyssal, Primordial, Cosmic
        image: obscureChest,
        description: 'Vibrating with dark energy.',
        difficulty: 5.0,
        minigameRarity: 8, // Matches lowest fish tier for Rod 10
        value: 5000
    }
];
