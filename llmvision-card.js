import { getIcon } from './helpers.js';


class LLMVisionCard extends HTMLElement {

    config;
    content;
    lastUpdateTime;

    // required
    setConfig(config) {
        this.config = config;
        this.calendar_entity = config.calendar_entity || 'calendar.llm_vision_events';
        this.number_of_events = config.number_of_events || 5;
        this.refresh_interval = config.refresh_interval || 1;
    }

    set hass(hass) {
        const now = new Date().getTime();
        if (this.lastUpdateTime && (now - this.lastUpdateTime < this.refresh_interval * 60000)) {
            return;
        }
        this.lastUpdateTime = now;

        // done once
        if (!this.content) {
            this.innerHTML = `
                <ha-card>
                    <div class="card-content"></div>
                </ha-card>
                <style>
                    .event-container {
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        height: auto;
                        z-index: 2;
                        margin-bottom: 10px;
                    }

                    .event-container:last-child {
                        margin-bottom: 0;
                    }

                    .event-container img {
                        width: 100px;
                        height: 100px;
                        margin-left: auto;
                        border-radius: 12px;
                        object-fit: cover;
                    }

                    .event-container h3 {
                        margin: 0;
                        flex-grow: 1;
                        color: var(--primary-text-color);
                    }

                    .event-container p {
                        margin: 0;
                        flex-grow: 1;
                        color: var(--secondary-text-color);
                    }

                    .icon-container {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background-color: rgba(95, 252, 234, 0.2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        position: relative;
                    }

                    .icon-container ha-icon {
                        color: #5ffcea;
                    }
                </style>
            `;
            this.content = this.querySelector('div.card-content');
        }

        const calendarEntity = hass.states[this.calendar_entity];
        const numberOfEvents = this.number_of_events;

        if (!calendarEntity) {
            console.error('Calendar entity not found:', this.calendar_entity);
            return;
        }

        const events = (calendarEntity.attributes.events || []).slice().reverse();
        const keyFrames = (calendarEntity.attributes.key_frames || []).slice().reverse();
        const cameraNames = (calendarEntity.attributes.camera_names || []).slice().reverse();
        const startTimes = (calendarEntity.attributes.starts || []).slice().reverse();

        // Clear previous content
        this.content.innerHTML = '';

        // Add events and key frames for the specified number of events
        for (let i = 0; i < Math.min(numberOfEvents, events.length); i++) {
            const event = events[i];
            const startTime = startTimes[i];
            const date = new Date(startTime);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            const icon = getIcon(event);
            let keyFrame = keyFrames[i] || '';
            const cameraName = cameraNames[i] || '';
            // formatted time • camera name if camera not "" else just formatted time
            console.log(cameraName);
            const secondaryText = cameraName ? `${formattedTime} • ${cameraName}` : formattedTime;
            console.log(secondaryText);

            keyFrame = keyFrame.replace('/config/www/', '/local/') + ".jpg";

            this.content.innerHTML += `
                <div class="event-container">
                    <div class="icon-container">
                        <ha-icon icon="${icon}"></ha-icon>
                    </div>
                    <div class="event-details">
                        <h3>${event}</h3>
                        <p>${secondaryText}</p>
                    </div>
                    <img src="${keyFrame}" alt="Key frame ${i + 1}" onerror="this.style.display='none'">
                </div>
            `;
        }
    }

    static getStubConfig() {
        return { calendar_entity: 'calendar.llm_vision_events', number_of_events: 5, refresh_interval: 1 };
    }
}

customElements.define('llmvision-card', LLMVisionCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "llmvision-card",
    name: "LLM Vision Card",
    description: "Display LLM Vision events on your dashboard",
});