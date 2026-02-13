import fishBasic from '../assets/fish basic.png';
import fishScaled from '../assets/fish scaled.png';
import fishSpotted from '../assets/fish spotted.png';
import fishStriped from '../assets/fish striped.png';
import fishAngler from '../assets/fish angler fish.png';
import fishBeautiful from '../assets/fish beautiful.png';
import fishBigFin from '../assets/fish big fin.png';
import fishChunky from '../assets/fish chunky boi.png';
import fishEel from '../assets/fish eel.png';
import fishFlatLong from '../assets/fish flat long fins.png';
import fishFlatStriped from '../assets/fish flat striped.png';
import fishFlat from '../assets/fish flat.png';
import fishJellyLarge from '../assets/fish jellyfish large.png';
import fishJelly from '../assets/fish jellyfish.png';
import fishKarp from '../assets/fish karp.png';
import fishLargePois from '../assets/fish large pois.png';
import fishLarge from '../assets/fish large.png';
import fishPuffer from '../assets/fish pufferfish.png';
import fishSeaHorse from '../assets/fish sea horse.png';
import fishShrimp from '../assets/fish shrimp.png';
import fishSpikey from '../assets/fish spikey thing.png';
import fishSquid from '../assets/fish squid.png';
import fishStar from '../assets/fish star fish.png';
import fishSword from '../assets/fish swordfish.png';
import fishThinDotted from '../assets/fish thin dotted.png';
import fishThinScales from '../assets/fish thin scales.png';
import fishThinSpotted from '../assets/fish thin spotted.png';
import fishThin from '../assets/fish thin.png';
import fishThing from '../assets/fish thing.png';
import fishWaves from '../assets/fish waves.png';
import fishWhatcha from '../assets/fish whatchamacallit.png';

// New fish imports
import fishBarracuda from '../assets/fish barracuda.png';
import fishFlatDotted from '../assets/fish flat dotted.png';
import fishFlatScaled from '../assets/fish flat scaled.png';
import fishFlatSpotted from '../assets/fish flat spotted.png';
import fishFlatThinStriped from '../assets/fish flat thin striped.png';
import fishJellyLong from '../assets/fish jellyfish long.png';
import fishJellyNano from '../assets/fish jellyfish nano.png';
import fishLargeDotted from '../assets/fish large dotted.png';
import fishLargeScaled from '../assets/fish large scaled.png';
import fishLargeSpotted from '../assets/fish large spotted.png';
import fishLargeStriped from '../assets/fish large striped.png';
import fishSuperChunky from '../assets/fish super chunky boi.png';
import fishThinStriped from '../assets/fish thin striped.png';
import eelElectric from '../assets/eel electric.png';
import eelSpotted from '../assets/eel spotted.png';

// Items
import algae from '../assets/algae.png';
import bigShell from '../assets/big shell.png';
import boot from '../assets/boot.png';
import coral from '../assets/coral.png';
import shell from '../assets/shell.png';
import batteries from '../assets/batteries.png';
import bottle from '../assets/bottle.png';

export const RARITY_TIERS = {
    1: { name: 'Dull', color: '#7f8c8d' },
    2: { name: 'Common', color: '#bdc3c7' },
    3: { name: 'Uncommon', color: '#2ecc71' },
    4: { name: 'Rare', color: '#3498db' },
    5: { name: 'Exotic', color: '#9b59b6' },
    6: { name: 'Mythical', color: '#e74c3c' },
    7: { name: 'Legendary', color: '#f1c40f' },
    8: { name: 'Ethereal', color: '#1abc9c' },
    9: { name: 'Celestial', color: '#34495e' },
    10: { name: 'Abyssal', color: '#d35400' },
    11: { name: 'Primordial', color: '#c0392b' },
    12: { name: 'Cosmic', color: '#8e44ad' }
};

export const FISH_DATA = [
    // Tier 1: Dull
    { id: 'algae', name: 'Algae', description: 'Slimy green stuff.', rarityId: 1, difficulty: 0.2, value: 2, image: algae },
    { id: 'boot', name: 'Old Boot', description: 'Soleless.', rarityId: 1, difficulty: 0.2, value: 2, image: boot },
    { id: 'shell', name: 'Seashell', description: 'Pretty common shell.', rarityId: 1, difficulty: 0.3, value: 4, image: shell },
    { id: 'batteries', name: 'Batteries', description: 'Who threw these in?', rarityId: 1, difficulty: 0.2, value: 2, image: batteries },
    { id: 'bottle', name: 'Glass Bottle', description: 'Empty. No message.', rarityId: 1, difficulty: 0.2, value: 2, image: bottle },

    // Tier 2: Common
    { id: 'anchovy', name: 'Anchovy', description: 'Tiny but tasty.', rarityId: 2, difficulty: 0.4, value: 5, image: fishBasic },
    { id: 'sardine', name: 'Sardine', description: 'Oily snack.', rarityId: 2, difficulty: 0.4, value: 8, image: fishStriped },
    { id: 'thin_fish', name: 'Thin Fish', description: 'Barely a mouthful.', rarityId: 2, difficulty: 0.4, value: 4, image: fishThin },
    { id: 'thin_striped', name: 'Striped Minnow', description: 'Sporty little swimmer.', rarityId: 2, difficulty: 0.4, value: 6, image: fishThinStriped },

    // Tier 3: Uncommon
    { id: 'shrimp', name: 'Shrimp', description: 'Cocktail ready.', rarityId: 3, difficulty: 0.5, value: 12, image: fishShrimp },
    { id: 'thin_dotted', name: 'Dotted Minnow', description: 'Small and spotty.', rarityId: 3, difficulty: 0.5, value: 10, image: fishThinDotted },
    { id: 'thin_spotted', name: 'Spotted Minnow', description: 'Hard to see.', rarityId: 3, difficulty: 0.5, value: 10, image: fishThinSpotted },
    { id: 'thin_scales', name: 'Scaled Minnow', description: 'Shiny scales.', rarityId: 3, difficulty: 0.5, value: 12, image: fishThinScales },
    { id: 'jelly_nano', name: 'Nano Jelly', description: 'Tiny translucent blob.', rarityId: 3, difficulty: 0.5, value: 14, image: fishJellyNano },

    // Tier 4: Rare
    { id: 'flat_fish', name: 'Flatfish', description: 'Sandy bottom lover.', rarityId: 4, difficulty: 0.8, value: 20, image: fishFlat },
    { id: 'karp', name: 'Karp', description: 'Just splashes around.', rarityId: 4, difficulty: 0.8, value: 25, image: fishKarp },
    { id: 'starfish', name: 'Starfish', description: 'Five points.', rarityId: 4, difficulty: 0.6, value: 18, image: fishStar },
    { id: 'flat_dotted', name: 'Dotted Flounder', description: 'Covered in dots.', rarityId: 4, difficulty: 0.7, value: 22, image: fishFlatDotted },

    // Tier 5: Exotic
    { id: 'bass', name: 'Sea Bass', description: 'A classic catch.', rarityId: 5, difficulty: 1.0, value: 35, image: fishScaled },
    { id: 'eel', name: 'Eel', description: 'Slippery and long.', rarityId: 5, difficulty: 1.2, value: 40, image: fishEel },
    { id: 'seahorse', name: 'Seahorse', description: 'Majestic tiny steed.', rarityId: 5, difficulty: 1.0, value: 50, image: fishSeaHorse },
    { id: 'flat_spotted', name: 'Spotted Sole', description: 'Fashionable and flat.', rarityId: 5, difficulty: 1.0, value: 38, image: fishFlatSpotted },
    { id: 'barracuda', name: 'Barracuda', description: 'Fast and fierce.', rarityId: 5, difficulty: 1.3, value: 45, image: fishBarracuda },

    // Tier 6: Mythical
    { id: 'jellyfish', name: 'Jellyfish', description: 'Watch the stingers!', rarityId: 6, difficulty: 1.4, value: 60, image: fishJelly },
    { id: 'coral', name: 'Coral Piece', description: 'Reef fragment.', rarityId: 6, difficulty: 0.8, value: 55, image: coral },
    { id: 'big_shell', name: 'Conch Shell', description: 'Ocean sound inside.', rarityId: 6, difficulty: 0.9, value: 45, image: bigShell },
    { id: 'flat_scaled', name: 'Armored Flounder', description: 'Tough scales.', rarityId: 6, difficulty: 1.3, value: 58, image: fishFlatScaled },
    { id: 'eel_spotted', name: 'Spotted Eel', description: 'Rare patterns.', rarityId: 6, difficulty: 1.5, value: 65, image: eelSpotted },

    // Tier 7: Legendary
    { id: 'tuna', name: 'Bluefin Tuna', description: 'Prize of the sea.', rarityId: 7, difficulty: 2.0, value: 100, image: fishSpotted },
    { id: 'swordfish', name: 'Swordfish', description: 'En garde!', rarityId: 7, difficulty: 2.2, value: 150, image: fishSword },
    { id: 'pufferfish', name: 'Pufferfish', description: 'Don\'t eat raw!', rarityId: 7, difficulty: 1.6, value: 80, image: fishPuffer },
    { id: 'large_striped', name: 'Striped Grouper', description: 'Classic big catch.', rarityId: 7, difficulty: 2.0, value: 110, image: fishLargeStriped },
    { id: 'flat_thin_striped', name: 'Tiger Flounder', description: 'Thin stripes, big fight.', rarityId: 7, difficulty: 1.8, value: 95, image: fishFlatThinStriped },

    // Tier 8: Ethereal
    { id: 'squid', name: 'Squid', description: 'Ink warning.', rarityId: 8, difficulty: 2.1, value: 180, image: fishSquid },
    { id: 'jelly_large', name: 'Giant Jelly', description: 'Massive blob.', rarityId: 8, difficulty: 2.0, value: 160, image: fishJellyLarge },
    { id: 'flat_long', name: 'Long Flounder', description: 'Stretched out.', rarityId: 8, difficulty: 1.8, value: 140, image: fishFlatLong },
    { id: 'jelly_long', name: 'Ribbon Jelly', description: 'Flows like a ghost.', rarityId: 8, difficulty: 2.2, value: 170, image: fishJellyLong },
    { id: 'large_scaled', name: 'Scaled Titan', description: 'Glittering armor.', rarityId: 8, difficulty: 2.3, value: 190, image: fishLargeScaled },

    // Tier 9: Celestial
    { id: 'flat_striped', name: 'Striped Flounder', description: 'Racing stripes.', rarityId: 9, difficulty: 2.3, value: 220, image: fishFlatStriped },
    { id: 'large_pois', name: 'Polka Dot Fish', description: 'Fashionable.', rarityId: 9, difficulty: 2.4, value: 240, image: fishLargePois },
    { id: 'waves_fish', name: 'Wavy Fish', description: 'Goes with the flow.', rarityId: 9, difficulty: 2.5, value: 260, image: fishWaves },
    { id: 'large_dotted', name: 'Dotted Leviathan', description: 'Ancient dots pattern.', rarityId: 9, difficulty: 2.6, value: 250, image: fishLargeDotted },
    { id: 'large_spotted', name: 'Spotted Leviathan', description: 'Celestial markings.', rarityId: 9, difficulty: 2.5, value: 270, image: fishLargeSpotted },

    // Tier 10: Abyssal
    { id: 'angler', name: 'Anglerfish', description: 'Light in the dark.', rarityId: 10, difficulty: 2.8, value: 350, image: fishAngler },
    { id: 'large_fish', name: 'Big Fish', description: 'Just a big fish.', rarityId: 10, difficulty: 2.5, value: 300, image: fishLarge },
    { id: 'beautiful_fish', name: 'Rainbow Fish', description: 'Stunning colors.', rarityId: 10, difficulty: 2.6, value: 320, image: fishBeautiful },
    { id: 'eel_electric', name: 'Electric Eel', description: 'Shocking encounter!', rarityId: 10, difficulty: 3.0, value: 380, image: eelElectric },

    // Tier 11: Primordial
    { id: 'chunky_boi', name: 'Chunky Boi', description: 'Absolute unit.', rarityId: 11, difficulty: 3.5, value: 500, image: fishChunky },
    { id: 'spikey_thing', name: 'Spikey', description: 'Very sharp.', rarityId: 11, difficulty: 3.8, value: 550, image: fishSpikey },
    { id: 'big_fin', name: 'Big Fin', description: 'All fin.', rarityId: 11, difficulty: 3.2, value: 480, image: fishBigFin },
    { id: 'super_chunky', name: 'Mega Chunky', description: 'Even chunkier.', rarityId: 11, difficulty: 3.6, value: 600, image: fishSuperChunky },

    // Tier 12: Cosmic
    { id: 'whatcha', name: 'Whatchamacallit', description: 'Science isn\'t sure.', rarityId: 12, difficulty: 4.5, value: 1000, image: fishWhatcha },
    { id: 'thing_fish', name: 'The Thing', description: 'It stares back.', rarityId: 12, difficulty: 4.2, value: 900, image: fishThing },
];
