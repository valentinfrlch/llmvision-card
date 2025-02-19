import { fr } from './iconMaps/fr.js';
import { de } from './iconMaps/de.js';
import { en } from './iconMaps/en.js';
import { es } from './iconMaps/es.js';

export function getIcon(title, lang = 'en') {
    let categories;

    try {
        // Use the imported JSON data based on the language
        if (lang === 'de') {
            categories = de.categories;
        } else if (lang === 'en') {
            categories = en.categories;
        } else if (lang === 'fr') {
            categories = fr.categories;
        } else if (lang === 'es') {
            categories = es.categories;
        } else {
            throw new Error(`Unsupported language: ${lang}`);
        }

        for (const category of Object.values(categories)) {
            const { colors, objects } = category;
            for (const [key, icon] of Object.entries(objects)) {
                const regex = new RegExp(`\\b${key}s?\\b`, 'i');
                if (regex.test(title)) {
                    return { icon, backgroundColor: colors.background, iconColor: colors.icon };
                }
            }
        }
    } catch (error) {
        console.error('Error getting icon:', error);
    }

    return { icon: 'mdi:cube-scan', backgroundColor: 'gray', iconColor: 'gray' }; // Default icon and colors if no keyword is found
}