import { colors } from './colors.js?v=1.5.2';
import { bg } from './bg.js?v=1.5.2';
import { ca } from './ca.js?v=1.5.2';
import { de } from './de.js?v=1.5.2';
import { en } from './en.js?v=1.5.2';
import { es } from './es.js?v=1.5.2';
import { fr } from './fr.js?v=1.5.2';
import { it } from './it.js?v=1.5.2';
import { nl } from './nl.js?v=1.5.2';
import { pl } from './pl.js?v=1.5.2';
import { pt } from './pt.js?v=1.5.2';
import { sk } from './sk.js?v=1.5.2';
import { sv } from './sv.js?v=1.5.2';
import { hu } from './hu.js?v=1.5.2';
import { cs } from './cs.js?v=1.5.2';

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
    let pluralRegex;

    try {
        if (lang === 'bg') {
            categories = bg.categories;
            pluralRegex = bg.regex;
        } else if (lang === 'ca') {
            categories = ca.categories;
            pluralRegex = ca.regex;
        } else if (lang === 'cs') {
            categories = cs.categories;
            pluralRegex = cs.regex;
        } else if (lang === 'de') {
            categories = de.categories;
            pluralRegex = de.regex;
        } else if (lang === 'en') {
            categories = en.categories;
            pluralRegex = en.regex;
        } else if (lang === 'es') {
            categories = es.categories;
            pluralRegex = es.regex;
        } else if (lang === 'fr') {
            categories = fr.categories;
            pluralRegex = fr.regex;
        } else if (lang === 'hu') {
            categories = hu.categories;
            pluralRegex = hu.regex;
        } else if (lang === 'it') {
            categories = it.categories;
            pluralRegex = it.regex;
        } else if (lang === 'nl') {
            categories = nl.categories;
            pluralRegex = nl.regex;
        } else if (lang === 'pl') {
            categories = pl.categories;
            pluralRegex = pl.regex;
        } else if (lang === 'pt') {
            categories = pt.categories;
            pluralRegex = pt.regex;
        } else if (lang === 'sk') {
            categories = sk.categories;
            pluralRegex = sk.regex;
        } else if (lang === 'sv') {
            categories = sv.categories;
            pluralRegex = sv.regex;
        } else {
            throw new Error(`Unsupported language: ${lang}`);
        }

        const text = String(title || '');

        // escape helper for literal keys
        const escapeForRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        if (pluralRegex) {
            if (typeof pluralRegex === 'string' && pluralRegex.includes('${key}')) {
                const m = String(pluralRegex).match(/`([^`]*)`(?:\s*,\s*'([a-z]*?)')?/i);
                let template = null;
                let flags = 'i';
                if (m) {
                    template = m[1];
                    flags = m[2] || flags;
                } else {
                    const lit = String(pluralRegex).match(/^\/(.+)\/([gimsuy]*)$/);
                    if (lit) {
                        template = lit[1];
                        flags = lit[2] || flags;
                    }
                }

                if (template) {
                    for (const categoryName of Object.keys(categories)) {
                        const category = categories[categoryName];
                        const categoryColor = colors.categories[categoryName].color;
                        for (const [k, icon] of Object.entries(category.objects)) {
                            try {
                                const rx = new RegExp(template.replace(/\$\{key\}/g, escapeForRegExp(k)), flags);
                                if (rx.test(text)) {
                                    return { icon, color: categoryColor, category: categoryName };
                                }
                            } catch (err) {
                                console.warn('Invalid regex for key', k, err);
                            }
                        }
                    }
                }
            }
        }

        // Fallback to simple word boundary check if no pluralRegex or if it fails
        for (const categoryName of Object.keys(categories)) {
            const category = categories[categoryName];
            const categoryColor = colors.categories[categoryName].color;
            const { objects } = category;
            for (const [key, icon] of Object.entries(objects)) {
                const regex = new RegExp(`\\b${key}\\b`, 'i');
                if (regex.test(title)) {
                    return { icon, color: categoryColor, category: categoryName };
                }
            }
        }
    } catch (error) {
        console.error('Error getting icon:', error);
    }

    return { icon: 'mdi:record-rec', color: '#929292' }; // Default icon and colors if no keyword is found
}

const translations = {
    bg: bg.text,
    ca: ca.text,
    cs: cs.text,
    de: de.text,
    en: en.text,
    es: es.text,
    fr: fr.text,
    hu: hu.text,
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
