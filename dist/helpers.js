import { colors } from './colors.js';
import { fr } from './fr.js';
import { de } from './de.js';
import { nl } from './nl.js';
import { en } from './en.js';
import { es } from './es.js';
import { pt } from './pt.js';
import { sv } from './sv.js';
import { pl } from './pl.js';
import { it } from './it.js';

export function hexToRgba(hex, alpha = 1) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
        c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

export function getIcon(title, lang = 'en') {
    let categories;

    try {
        if (lang === 'de') {
            categories = de.categories;
        } else if (lang === 'nl') {
            categories = nl.categories;
        } else if (lang === 'en') {
            categories = en.categories;
        } else if (lang === 'fr') {
            categories = fr.categories;
        } else if (lang === 'es') {
            categories = es.categories;
        } else if (lang === 'pt') {
            categories = pt.categories;
        } else if (lang === 'sv') {
            categories = sv.categories;
        } else if (lang === 'it') {
            categories = it.categories;
        } else if (lang === 'pl') {
            categories = pl.categories;
        } else {
            throw new Error(`Unsupported language: ${lang}`);
        }

        for (const categoryName of Object.keys(categories)) {
            const category = categories[categoryName];
            const categoryColor = colors.categories[categoryName].color;
            const { objects } = category;
            for (const [key, icon] of Object.entries(objects)) {
                const regex = new RegExp(`\\b${key}s?\\b`, 'i');
                if (regex.test(title)) {
                    return { icon, color: categoryColor, category: categoryName };
                }
            }
        }
    } catch (error) {
        console.error('Error getting icon:', error);
    }

    return { icon: 'mdi:cube-scan', color: '#929292' }; // Default icon and colors if no keyword is found
}

const translations = {
    en: en.text,
    de: de.text,
    nl: nl.text,
    fr: fr.text,
    es: es.text,
    pt: pt.text,
    sv: sv.text,
    pl: pl.text,
    it: it.text,
};

export function translate(key, language) {
    return translations[language] && translations[language][key] ? translations[language][key] : translations['en'][key];
}
