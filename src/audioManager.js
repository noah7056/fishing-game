// Audio Manager — centralized sound effects and music control
import sfxSplash from './sfx/water splash.mp3';
import sfxDrop from './sfx/water drop.mp3';
import sfxReeling from './sfx/reeling.mp3';
import sfxCatch from './sfx/catching loot.mp3';
import sfxSell from './sfx/selling loot.mp3';
import sfxBuyRod from './sfx/buying a new fishing rod.mp3';
import sfxBuy from './sfx/buying.mp3';
import sfxPotionUse from './sfx/potion used.mp3';
import sfxPotionEnd from './sfx/potion effect run out.mp3';
import sfxButton from './sfx/generic button press, hover over button.mp3';
import sfxNewItem from './sfx/new item found.mp3';
import bgmLoop from './sfx/background music loop.mp3';
import wavesLoop from './sfx/sea waves background loop.mp3';

const savedSfx = localStorage.getItem('fishing_sfx_enabled');
const savedBgm = localStorage.getItem('fishing_bgm_enabled');
const savedBgmVol = localStorage.getItem('fishing_bgm_volume');
const savedWaveVol = localStorage.getItem('fishing_waves_volume');
const savedSfxVol = localStorage.getItem('fishing_sfx_volume');

let sfxEnabled = savedSfx !== null ? JSON.parse(savedSfx) : true;
let bgmEnabled = savedBgm !== null ? JSON.parse(savedBgm) : true;
let bgmVolume = savedBgmVol !== null ? parseFloat(savedBgmVol) : 0.3;
let wavesVolume = savedWaveVol !== null ? parseFloat(savedWaveVol) : 0.15;
let sfxVolumeScale = savedSfxVol !== null ? parseFloat(savedSfxVol) : 1.0;

// Pre-create looping audio instances
const bgmAudio = new Audio(bgmLoop);
bgmAudio.loop = true;
bgmAudio.volume = bgmVolume;

const wavesAudio = new Audio(wavesLoop);
wavesAudio.loop = true;
wavesAudio.volume = wavesVolume;

const reelingAudio = new Audio(sfxReeling);
reelingAudio.loop = true;
reelingAudio.volume = 0.08; // Very low — ambient background during reeling

// Sound map for one-shot effects with per-sound volume
const sounds = {
    cast: { src: sfxSplash, volume: 0.8, delay: 1000 },
    hook: { src: sfxDrop, volume: 0.8 },
    catch: { src: sfxCatch, volume: 0.5 },
    sell: { src: sfxSell, volume: 0.5 },
    buyRod: { src: sfxBuyRod, volume: 0.5 },
    buy: { src: sfxBuy, volume: 0.5 },
    potionUse: { src: sfxPotionUse, volume: 0.5 },
    potionEnd: { src: sfxPotionEnd, volume: 0.5 },
    button: { src: sfxButton, volume: 0.35 },
    newItem: { src: sfxNewItem, volume: 0.6 },
};

export function playSound(name, delay = 0) {
    if (!sfxEnabled) return;
    const entry = sounds[name];
    if (!entry) return;
    const audio = new Audio(entry.src);
    audio.volume = entry.volume * sfxVolumeScale;
    if (entry.delay) {
        setTimeout(() => {
            audio.play().catch(() => { });
        }, entry.delay + delay);
    } else {
        audio.play().catch(() => { });
    }
}

export function startReeling() {
    if (!sfxEnabled) return;
    reelingAudio.currentTime = 0;
    reelingAudio.volume = 0.08 * sfxVolumeScale;
    reelingAudio.play().catch(() => { });
}

export function stopReeling() {
    reelingAudio.pause();
    reelingAudio.currentTime = 0;
}

export function startBGM() {
    if (!bgmEnabled) return;
    bgmAudio.play().catch(() => { });
    wavesAudio.play().catch(() => { });
}

export function stopBGM() {
    bgmAudio.pause();
    wavesAudio.pause();
}

export function toggleBGM() {
    bgmEnabled = !bgmEnabled;
    if (bgmEnabled) {
        startBGM();
    } else {
        stopBGM();
    }
    localStorage.setItem('fishing_bgm_enabled', JSON.stringify(bgmEnabled));
    return bgmEnabled;
}

export function toggleSFX() {
    sfxEnabled = !sfxEnabled;
    if (!sfxEnabled) {
        stopReeling();
    }
    localStorage.setItem('fishing_sfx_enabled', JSON.stringify(sfxEnabled));
    return sfxEnabled;
}

export function setBgmVolume(v) {
    bgmVolume = v;
    bgmAudio.volume = v;
    localStorage.setItem('fishing_bgm_volume', v.toString());
}

export function setWavesVolume(v) {
    wavesVolume = v;
    wavesAudio.volume = v;
    localStorage.setItem('fishing_waves_volume', v.toString());
}

export function setSfxVolume(v) {
    sfxVolumeScale = v;
    localStorage.setItem('fishing_sfx_volume', v.toString());
}

export function getVolumes() {
    return { bgm: bgmVolume, waves: wavesVolume, sfx: sfxVolumeScale };
}

export function isSfxEnabled() { return sfxEnabled; }
export function isBgmEnabled() { return bgmEnabled; }
