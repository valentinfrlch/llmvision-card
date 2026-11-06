import { labels } from './labels.js';
import { bg, ca, cs, da, de, en, es, fr, hu, it, nl, pl, pt, sk, sv, el } from './translations.js';

/**
 * Format a Date as an ISO 8601 string in local time, including the UTC offset
 * (e.g. "2026-09-23T00:00:00+02:00").
 *
 * Date.toISOString() would convert to UTC and shift the day boundary, so it
 * cannot be used to express "local midnight".
 */
export function toLocalIso(date) {
    const pad = (n) => String(n).padStart(2, '0');
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMinutes);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
        + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
        + `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/**
 * Format a Date as a local YYYY-MM-DD string.
 *
 * Date.toISOString().slice(0, 10) would use UTC and can land on the wrong day
 * either side of midnight, so the local parts are used instead.
 */
export function toIsoDate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

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

export function getIcon(category, label) {
    try {
        const categoryData = labels[category];
        if (categoryData) {
            const labelIcon = categoryData.labels[label];
            if (labelIcon) {
                return { icon: labelIcon, color: categoryData.color };
            }
        }
    } catch (e) {
        console.warning('Error getting icon for category:', category, 'label:', label, e);
    }
    return { icon: 'mdi:motion-sensor', color: '#757575' };
}

const translations = {
    bg: bg.text,
    ca: ca.text,
    cs: cs.text,
    da: da.text,
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
    el: el.text,
};

export function translate(key, language) {
    return translations[language] && translations[language][key] ? translations[language][key] : translations['en'][key];
}
