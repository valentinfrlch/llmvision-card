import { labels } from './labels.js?v=1.6.0';
import { bg, ca, cs, de, en, es, fr, hu, it, nl, pl, pt, sk, sv } from './translations.js?v=1.6.0';

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
