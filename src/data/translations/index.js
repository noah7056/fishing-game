import en from './en';
import zh from './zh';

export const TRANSLATIONS = {
    en,
    zh,
    es: en, // Fallback to English - add translation file
    ja: en, // Fallback to English - add translation file
    de: en, // Fallback to English - add translation file
    ko: en, // Fallback to English - add translation file
    fr: en, // Fallback to English - add translation file
    ar: en, // Fallback to English - add translation file
    hi: en, // Fallback to English - add translation file
    it: en, // Fallback to English - add translation file
};

export const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '简体中文' },
    { code: 'es', name: 'Español' },
    { code: 'ja', name: '日本語' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ko', name: '한국어' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'it', name: 'Italiano' },
];
