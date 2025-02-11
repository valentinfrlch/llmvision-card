import { fr } from './iconMaps/fr.js';
import { de } from './iconMaps/de.js';
import { en } from './iconMaps/en.js';
import { es } from './iconMaps/es.js';

export function getIcon(title, lang = 'en') {
    let iconMap, regex_string;

    try {
        // Use the imported JSON data based on the language
        if (lang === 'de') {
            iconMap = de.objects;
            regex_string = de.regex;
        } else if (lang === 'en') {
            iconMap = en.objects;
            regex_string = en.regex;
        } else if (lang === 'fr') {
            iconMap = fr.objects;
            regex_string = fr.regex;
        } else if (lang === 'es') {
            iconMap = es.objects;
            regex_string = es.regex;
        } else {
            throw new Error(`Unsupported language: ${lang}`);
        }

        for (const [key, icon] of Object.entries(iconMap)) {
            const regex = new RegExp(`\\b${key}s?\\b`, 'i');
            if (regex.test(title)) {
                return icon;
            }
        }
    } catch (error) {
        console.error('Error getting icon:', error);
    }

    return 'mdi:cube-scan'; // Default icon if no keyword is found
}