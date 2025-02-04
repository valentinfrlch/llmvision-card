export function getIcon(title) {
    const iconMap = {
        'person': 'mdi:walk',
        'run': 'mdi:run',
        'bike': 'mdi:bike',
        'bicycle': 'mdi:bike',
        'car': 'mdi:car',
        'vehicle': 'mdi:car',
    };

    for (const [key, icon] of Object.entries(iconMap)) {
        if (title.toLowerCase().includes(key)) {
            return icon;
        }
    }
    return 'mdi:cube-scan'; // Default icon if no keyword is found
}