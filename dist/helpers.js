import { colors } from './colors.js';
import { fr } from './fr.js';
import { de } from './de.js';
import { en } from './en.js';
import { es } from './es.js';

export function getIcon(title, lang = 'en') {
    let categories;

    try {
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

        for (const categoryName of Object.keys(categories)) {
            const category = categories[categoryName];
            const categoryColors = colors.categories[categoryName].colors;
            const { objects } = category;
            for (const [key, icon] of Object.entries(objects)) {
                const regex = new RegExp(`\\b${key}s?\\b`, 'i');
                if (regex.test(title)) {
                    return { icon, backgroundColor: categoryColors.background, iconColor: categoryColors.icon };
                }
            }
        }
    } catch (error) {
        console.error('Error getting icon:', error);
    }

    return { icon: 'mdi:cube-scan', backgroundColor: 'gray', iconColor: 'white' }; // Default icon and colors if no keyword is found
}