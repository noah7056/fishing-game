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
import abyssalCucumber from '../assets/abyssal cucumber.png';
import abyssalOctopus from '../assets/abyssal octopus.png';
import fancyShell from '../assets/fancy shell.png';
import fishBetta from '../assets/fish betta.png';
import fishCrabStrong from '../assets/fish crab strong.png';
import fishCrab from '../assets/fish crab.png';
import fishFlatLongDotted from '../assets/fish flat long fins dotted.png';
import fishJellyMagic from '../assets/fish jellyfish magical.png';
import fishJellyPois from '../assets/fish jellyfish poisonous.png';
import fishLongBlob from '../assets/fish long blob.png';
import fishRayDotted from '../assets/fish ray dotted.png';
import fishRaySpotted from '../assets/fish ray spotted.png';
import fishRayStriped from '../assets/fish ray striped.png';
import fishRay from '../assets/fish ray.png';
import flyingFish from '../assets/flying fish.png';
import lobster from '../assets/lobster.png';
import octopusStrong from '../assets/octopus strong.png';
import octopus from '../assets/octopus.png';
import oyster from '../assets/oyster.png';
import roundShell from '../assets/round shell.png';
import smoothShell from '../assets/smooth shell.png';
import sunFish from '../assets/sun fish.png';
import thinShell from '../assets/thin shell.png';
import viperFish from '../assets/viper fish.png';

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
    { id: 'algae', name: 'Algae', description: 'Slimy green stuff.', rarityId: 1, difficulty: 0.2, value: 3, image: algae },
    { id: 'boot', name: 'Old Boot', description: 'Soleless.', rarityId: 1, difficulty: 0.2, value: 3, image: boot },

    // Tier 2: Common
    { id: 'shell', name: 'Seashell', description: 'Pretty common shell.', rarityId: 2, difficulty: 0.3, value: 5, image: shell },
    { id: 'batteries', name: 'Batteries', description: 'Who threw these in?', rarityId: 2, difficulty: 0.3, value: 5, image: batteries },
    { id: 'bottle', name: 'Glass Bottle', description: 'Empty. No message.', rarityId: 2, difficulty: 0.3, value: 5, image: bottle },
    { id: 'thin_shell', name: 'Thin Shell', description: 'Very fragile.', rarityId: 2, difficulty: 0.3, value: 6, image: thinShell },

    // Tier 3: Uncommon
    { id: 'round_shell', name: 'Round Shell', description: 'Perfectly round.', rarityId: 3, difficulty: 0.4, value: 9, image: roundShell },
    { id: 'smooth_shell', name: 'Smooth Shell', description: 'Polished by the waves.', rarityId: 3, difficulty: 0.4, value: 9, image: smoothShell },
    { id: 'thin_fish', name: 'Thin Fish', description: 'Barely a mouthful.', rarityId: 3, difficulty: 0.4, value: 8, image: fishThin },
    { id: 'anchovy', name: 'Anchovy', description: 'Tiny but tasty.', rarityId: 3, difficulty: 0.5, value: 10, image: fishBasic },
    { id: 'sardine', name: 'Sardine', description: 'Oily snack.', rarityId: 3, difficulty: 0.5, value: 12, image: fishStriped },

    // Tier 4: Rare
    { id: 'thin_striped', name: 'Striped Minnow', description: 'Sporty little swimmer.', rarityId: 4, difficulty: 0.5, value: 14, image: fishThinStriped },
    { id: 'shrimp', name: 'Shrimp', description: 'Cocktail ready.', rarityId: 4, difficulty: 0.6, value: 16, image: fishShrimp },
    { id: 'thin_dotted', name: 'Dotted Minnow', description: 'Small and spotty.', rarityId: 4, difficulty: 0.6, value: 15, image: fishThinDotted },
    { id: 'thin_spotted', name: 'Spotted Minnow', description: 'Hard to see.', rarityId: 4, difficulty: 0.6, value: 15, image: fishThinSpotted },
    { id: 'flying_fish', name: 'Flying Fish', description: 'It glides over water.', rarityId: 4, difficulty: 0.7, value: 18, image: flyingFish },

    // Tier 5: Exotic
    { id: 'sun_fish', name: 'Sunfish', description: 'Loves the surface.', rarityId: 5, difficulty: 0.7, value: 22, image: sunFish },
    { id: 'thin_scales', name: 'Scaled Minnow', description: 'Shiny scales.', rarityId: 5, difficulty: 0.7, value: 20, image: fishThinScales },
    { id: 'jelly_nano', name: 'Nano Jelly', description: 'Tiny translucent blob.', rarityId: 5, difficulty: 0.7, value: 24, image: fishJellyNano },
    { id: 'fancy_shell', name: 'Fancy Shell', description: 'A collector\'s item.', rarityId: 5, difficulty: 0.6, value: 26, image: fancyShell },
    { id: 'crab', name: 'Crab', description: 'Walks sideways.', rarityId: 5, difficulty: 0.8, value: 28, image: fishCrab },
    { id: 'starfish', name: 'Starfish', description: 'Five points.', rarityId: 5, difficulty: 0.7, value: 24, image: fishStar },

    // Tier 6: Mythical
    { id: 'flat_fish', name: 'Flatfish', description: 'Sandy bottom lover.', rarityId: 6, difficulty: 0.9, value: 35, image: fishFlat },
    { id: 'karp', name: 'Karp', description: 'Just splashes around.', rarityId: 6, difficulty: 0.9, value: 38, image: fishKarp },
    { id: 'flat_dotted', name: 'Dotted Flounder', description: 'Covered in dots.', rarityId: 6, difficulty: 0.9, value: 36, image: fishFlatDotted },
    { id: 'betta', name: 'Betta Fish', description: 'Fighting fish.', rarityId: 6, difficulty: 1.0, value: 42, image: fishBetta },
    { id: 'ray', name: 'Stingray', description: 'Flat and gliding.', rarityId: 6, difficulty: 1.0, value: 40, image: fishRay },
    { id: 'coral', name: 'Coral Piece', description: 'Reef fragment.', rarityId: 6, difficulty: 0.8, value: 32, image: coral },
    { id: 'big_shell', name: 'Conch Shell', description: 'Ocean sound inside.', rarityId: 6, difficulty: 0.9, value: 30, image: bigShell },

    // Tier 7: Legendary
    { id: 'bass', name: 'Sea Bass', description: 'A classic catch.', rarityId: 7, difficulty: 1.1, value: 55, image: fishScaled },
    { id: 'eel', name: 'Eel', description: 'Slippery and long.', rarityId: 7, difficulty: 1.3, value: 60, image: fishEel },
    { id: 'seahorse', name: 'Seahorse', description: 'Majestic tiny steed.', rarityId: 7, difficulty: 1.1, value: 65, image: fishSeaHorse },
    { id: 'flat_spotted', name: 'Spotted Sole', description: 'Fashionable and flat.', rarityId: 7, difficulty: 1.2, value: 58, image: fishFlatSpotted },
    { id: 'barracuda', name: 'Barracuda', description: 'Fast and fierce.', rarityId: 7, difficulty: 1.4, value: 68, image: fishBarracuda },
    { id: 'ray_dotted', name: 'Dotted Ray', description: 'Looks like the ocean floor.', rarityId: 7, difficulty: 1.3, value: 56, image: fishRayDotted },
    { id: 'flat_long_dotted', name: 'Dotted Longfin', description: 'A strange variant.', rarityId: 7, difficulty: 1.3, value: 54, image: fishFlatLongDotted },

    // Tier 8: Ethereal
    { id: 'jellyfish', name: 'Jellyfish', description: 'Watch the stingers!', rarityId: 8, difficulty: 1.5, value: 85, image: fishJelly },
    { id: 'flat_scaled', name: 'Armored Flounder', description: 'Tough scales.', rarityId: 8, difficulty: 1.5, value: 82, image: fishFlatScaled },
    { id: 'eel_spotted', name: 'Spotted Eel', description: 'Rare patterns.', rarityId: 8, difficulty: 1.6, value: 90, image: eelSpotted },
    { id: 'ray_striped', name: 'Striped Ray', description: 'Fast glider.', rarityId: 8, difficulty: 1.6, value: 88, image: fishRayStriped },
    { id: 'lobster', name: 'Lobster', description: 'Delicious luxury.', rarityId: 8, difficulty: 1.7, value: 95, image: lobster },
    { id: 'oyster', name: 'Oyster', description: 'Might contain a pearl?', rarityId: 8, difficulty: 1.4, value: 80, image: oyster },
    { id: 'pufferfish', name: 'Pufferfish', description: 'Don\'t eat raw!', rarityId: 8, difficulty: 1.6, value: 78, image: fishPuffer },

    // Tier 9: Celestial
    { id: 'tuna', name: 'Bluefin Tuna', description: 'Prize of the sea.', rarityId: 9, difficulty: 1.9, value: 120, image: fishSpotted },
    { id: 'swordfish', name: 'Swordfish', description: 'En garde!', rarityId: 9, difficulty: 2.1, value: 145, image: fishSword },
    { id: 'large_striped', name: 'Striped Grouper', description: 'Classic big catch.', rarityId: 9, difficulty: 1.9, value: 130, image: fishLargeStriped },
    { id: 'flat_thin_striped', name: 'Tiger Flounder', description: 'Thin stripes, big fight.', rarityId: 9, difficulty: 1.8, value: 125, image: fishFlatThinStriped },
    { id: 'ray_spotted', name: 'Spotted Ray', description: 'Beautiful patterns.', rarityId: 9, difficulty: 1.9, value: 135, image: fishRaySpotted },
    { id: 'octopus', name: 'Octopus', description: 'Eight armed genius.', rarityId: 9, difficulty: 2.0, value: 150, image: octopus },
    { id: 'squid', name: 'Squid', description: 'Ink warning.', rarityId: 9, difficulty: 2.0, value: 140, image: fishSquid },

    // Tier 10: Abyssal
    { id: 'jelly_large', name: 'Giant Jelly', description: 'Massive blob.', rarityId: 10, difficulty: 2.1, value: 175, image: fishJellyLarge },
    { id: 'flat_long', name: 'Long Flounder', description: 'Stretched out.', rarityId: 10, difficulty: 2.0, value: 165, image: fishFlatLong },
    { id: 'jelly_long', name: 'Ribbon Jelly', description: 'Flows like a ghost.', rarityId: 10, difficulty: 2.2, value: 185, image: fishJellyLong },
    { id: 'large_scaled', name: 'Scaled Titan', description: 'Glittering armor.', rarityId: 10, difficulty: 2.3, value: 200, image: fishLargeScaled },
    { id: 'crab_strong', name: 'King Crab', description: 'The ruler of crabs.', rarityId: 10, difficulty: 2.4, value: 195, image: fishCrabStrong },
    { id: 'jelly_magic', name: 'Magic Jelly', description: 'Glows with mana.', rarityId: 10, difficulty: 2.2, value: 190, image: fishJellyMagic },

    // Tier 11: Primordial
    { id: 'flat_striped', name: 'Striped Flounder', description: 'Racing stripes.', rarityId: 11, difficulty: 2.4, value: 260, image: fishFlatStriped },
    { id: 'large_pois', name: 'Polka Dot Fish', description: 'Fashionable.', rarityId: 11, difficulty: 2.5, value: 280, image: fishLargePois },
    { id: 'waves_fish', name: 'Wavy Fish', description: 'Goes with the flow.', rarityId: 11, difficulty: 2.6, value: 300, image: fishWaves },
    { id: 'large_dotted', name: 'Dotted Leviathan', description: 'Ancient dots pattern.', rarityId: 11, difficulty: 2.7, value: 290, image: fishLargeDotted },
    { id: 'large_spotted', name: 'Spotted Leviathan', description: 'Celestial markings.', rarityId: 11, difficulty: 2.6, value: 310, image: fishLargeSpotted },

    // Tier 12: Cosmic
    { id: 'jelly_pois', name: 'Venom Jelly', description: 'Deadly touch.', rarityId: 12, difficulty: 2.8, value: 380, image: fishJellyPois },
    { id: 'viper_fish', name: 'Viperfish', description: 'Nightmare of the deep.', rarityId: 12, difficulty: 2.9, value: 400, image: viperFish },
    { id: 'angler', name: 'Anglerfish', description: 'Light in the dark.', rarityId: 12, difficulty: 3.0, value: 420, image: fishAngler },
    { id: 'large_fish', name: 'Big Fish', description: 'Just a big fish.', rarityId: 12, difficulty: 2.8, value: 380, image: fishLarge },
    { id: 'beautiful_fish', name: 'Rainbow Fish', description: 'Stunning colors.', rarityId: 12, difficulty: 2.9, value: 400, image: fishBeautiful },
    { id: 'eel_electric', name: 'Electric Eel', description: 'Shocking encounter!', rarityId: 12, difficulty: 3.2, value: 450, image: eelElectric },
    { id: 'octopus_strong', name: 'Kraken', description: 'Mythical sea monster.', rarityId: 12, difficulty: 3.4, value: 480, image: octopusStrong },
    { id: 'long_blob', name: 'Blob Fish', description: 'So ugly it\'s cute.', rarityId: 12, difficulty: 3.1, value: 420, image: fishLongBlob },
    { id: 'chunky_boi', name: 'Chunky Boi', description: 'Absolute unit.', rarityId: 12, difficulty: 3.5, value: 500, image: fishChunky },
    { id: 'spikey_thing', name: 'Spikey', description: 'Very sharp.', rarityId: 12, difficulty: 3.8, value: 550, image: fishSpikey },
    { id: 'big_fin', name: 'Big Fin', description: 'All fin.', rarityId: 12, difficulty: 3.3, value: 480, image: fishBigFin },
    { id: 'super_chunky', name: 'Mega Chunky', description: 'Even chunkier.', rarityId: 12, difficulty: 3.6, value: 600, image: fishSuperChunky },
    { id: 'abyssal_cucumber', name: 'Void Cucumber', description: 'Absorbs light.', rarityId: 12, difficulty: 3.5, value: 520, image: abyssalCucumber },
    { id: 'whatcha', name: 'Whatchamacallit', description: 'Science isn\'t sure.', rarityId: 12, difficulty: 4.5, value: 1000, image: fishWhatcha },
    { id: 'thing_fish', name: 'The Thing', description: 'It stares back.', rarityId: 12, difficulty: 4.2, value: 900, image: fishThing },
    { id: 'abyssal_octopus', name: 'Cosmic Mind', description: 'Knows the secrets of the universe.', rarityId: 12, difficulty: 5.0, value: 1100, image: abyssalOctopus },
];
