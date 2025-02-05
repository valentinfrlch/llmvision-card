export function getIcon(title) {
    const iconMap = {
        // People
        'person': 'mdi:walk',
        'people': 'mdi:walk',
        'child': 'mdi:walk',
        'woman': 'mdi:walk',
        'man': 'mdi:walk',
        'human': 'mdi:walk',
        'courier': 'mdi:truck-delivery',
        'mailman': 'mdi:truck-delivery',
        // Vehicles
        'bike': 'mdi:bike',
        'bicycle': 'mdi:bike',
        'motorcycle': 'mdi:motorbike',
        'motorbike': 'mdi:motorbike',
        'bus': 'mdi:bus',
        'car': 'mdi:car',
        'vehicle': 'mdi:car',
        'truck': 'mdi:truck',
        // Objects
        'box': 'mdi:package-variant-closed',
        'package': 'mdi:package-variant-closed',
        'parcel': 'mdi:package-variant-closed',
        'letter': 'mdi:email',
        // Garden
        'garden': 'mdi:flower',
        'plant': 'mdi:flower',
        'flower': 'mdi:flower',
        'tree': 'mdi:tree',

    };

    for (const [key, icon] of Object.entries(iconMap)) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(title)) {
            return icon;
        }
    }
    return 'mdi:cube-scan'; // Default icon if no keyword is found
}