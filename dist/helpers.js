import { colors } from './colors.js?v=1.4.3';
import { de } from './de.js?v=1.4.3';
import { en } from './en.js?v=1.4.3';
import { es } from './es.js?v=1.4.3';
import { fr } from './fr.js?v=1.4.3';
import { it } from './it.js?v=1.4.3';
import { nl } from './nl.js?v=1.4.3';
import { pl } from './pl.js?v=1.4.3';
import { pt } from './pt.js?v=1.4.3';
import { sk } from './sk.js?v=1.4.3';
import { sv } from './sv.js?v=1.4.3';

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
        } else if (lang === 'en') {
            categories = en.categories;
        } else if (lang === 'es') {
            categories = es.categories;
        } else if (lang === 'fr') {
            categories = fr.categories;
        } else if (lang === 'it') {
            categories = it.categories;
        } else if (lang === 'nl') {
            categories = nl.categories;
        } else if (lang === 'pl') {
            categories = pl.categories;
        } else if (lang === 'pt') {
            categories = pt.categories;
        } else if (lang === 'sk') {
            categories = sk.categories;
        } else if (lang === 'sv') {
            categories = sv.categories;
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
    de: de.text,
    en: en.text,
    es: es.text,
    fr: fr.text,
    it: it.text,
    nl: nl.text,
    pl: pl.text,
    pt: pt.text,
    sk: sk.text,
    sv: sv.text,
};

export function translate(key, language) {
    return translations[language] && translations[language][key] ? translations[language][key] : translations['en'][key];
}