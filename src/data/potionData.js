import boostLuck1 from '../assets/boost luck 1.png';
import boostLuck2 from '../assets/boost luck 2.png';
import boostLuck3 from '../assets/boost luck 3.png';
import boostSpeed1 from '../assets/boost speed 1.png';
import boostSpeed2 from '../assets/boost speed 2.png';
import improveAccuracy from '../assets/improve accuracy.png';
import doubleLoot from '../assets/double loot.png';
import doubleEverything from '../assets/double everything.png';

export const POTION_DATA = [
    {
        id: 'luck_1',
        name: 'Luck Boost',
        description: 'Increases chance of finding rare fish for 30s.',
        price: 75,
        duration: 30000,
        effect: { type: 'luck', tierOffset: 1 }, // Shifts RNG towards higher tiers
        image: boostLuck1
    },
    {
        id: 'luck_2',
        name: 'Super Luck',
        description: 'Greatly increases rare fish chance for 1m.',
        price: 200,
        duration: 60000,
        effect: { type: 'luck', tierOffset: 2 },
        image: boostLuck2
    },
    {
        id: 'luck_3',
        name: 'Crazy Luck',
        description: 'Massive luck boost for 2m.',
        price: 500,
        duration: 120000,
        effect: { type: 'luck', tierOffset: 3 },
        image: boostLuck3
    },
    {
        id: 'speed_1',
        name: 'Speed Boost',
        description: 'Reel in fish faster for 30s.',
        price: 50,
        duration: 30000,
        effect: { type: 'speed', multiplier: 1.5 },
        image: boostSpeed1
    },
    {
        id: 'speed_2',
        name: 'Huge Speed',
        description: 'Super fast reeling for 1m.',
        price: 150,
        duration: 60000,
        effect: { type: 'speed', multiplier: 2.0 },
        image: boostSpeed2
    },
    {
        id: 'sniper',
        name: 'Sniper Serum',
        description: 'Doubles the reeling bar width for 1m.',
        price: 250,
        duration: 60000,
        effect: { type: 'accuracy', multiplier: 2.0 },
        image: improveAccuracy
    },
    {
        id: 'double_loot',
        name: 'Double Loot',
        description: 'Catch two fish at once for 1m!',
        price: 400,
        duration: 60000,
        effect: { type: 'double_loot', active: true },
        image: doubleLoot
    },
    {
        id: 'doublenator',
        name: 'The Doublenator',
        description: 'Double EVERYTHING (Speed, Loot, Money) for 30s.',
        price: 1000,
        duration: 30000,
        effect: { type: 'double_everything', active: true },
        image: doubleEverything
    }
];
