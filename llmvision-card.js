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
        this.language = config.language || 'en';
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
                        cursor: pointer;
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
                        font-weight: 500;
                        font-size: 14px;
                        letter-spacing: 0.1px;
                        margin: 0;
                        flex-grow: 1;
                        color: var(--primary-text-color);
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .event-container p {
                        font-weight: 400;
                        font-size: 12px;
                        letter-spacing: 0.4px;
                        margin: 0;
                        flex-grow: 1;
                        color: var(--primary-text-color);
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .date-header h2 {
                        font-weight: 600;
                        font-size: 16px;
                        line-height: 24px;
                        letter-spacing: 0.1px;
                        margin: 0;
                        color: var(--primary-text-color);
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .icon-container {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background-color: rgba(3, 169, 244, 0.2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                        position: relative;
                        transition: transform 180ms ease-in-out;
                    }

                    .icon-container ha-icon {
                        color: rgb(3, 169, 244);
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
        const summaries = (calendarEntity.attributes.summaries || []).slice().reverse();
        const keyFrames = (calendarEntity.attributes.key_frames || []).slice().reverse();
        const cameraNames = (calendarEntity.attributes.camera_names || []).slice().reverse();
        const startTimes = (calendarEntity.attributes.starts || []).slice().reverse();

        // Clear previous content
        this.content.innerHTML = '';

        // Add events and key frames for the specified number of events
        let lastDate = '';

        for (let i = 0; i < Math.min(numberOfEvents, events.length); i++) {
            const event = events[i];
            const summary = summaries[i];
            const startTime = startTimes[i];
            const date = new Date(startTime);
            const options = { month: 'short', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en', options);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            const icon = getIcon(event, this.language);
            let keyFrame = keyFrames[i] || '';
            const cameraName = cameraNames[i] || '';
            const secondaryText = cameraName ? `${formattedTime} • ${cameraName}` : formattedTime;

            console.log('icon:', icon);

            keyFrame = keyFrame.replace('/config/www/', '/local/');

            // Determine the date label
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            let dateLabel;
            if (date.toDateString() === today.toDateString()) {
                dateLabel = 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
                dateLabel = 'Yesterday';
            } else {
                dateLabel = formattedDate;
            }

            // Add the date if it's different from the last date
            if (dateLabel !== lastDate) {
                const dateHeader = document.createElement('div');
                dateHeader.classList.add('date-header');
                dateHeader.innerHTML = `<h2>${dateLabel}</h2>`;
                this.content.appendChild(dateHeader);
                lastDate = dateLabel;
            }

            const eventContainer = document.createElement('div');
            eventContainer.classList.add('event-container');
            eventContainer.innerHTML = `
                <div class="icon-container">
                    <ha-icon icon="${icon}"></ha-icon>
                </div>
                <div class="event-details">
                    <h3>${event}</h3>
                    <p>${secondaryText}</p>
                </div>
                <img src="${keyFrame}" alt="Key frame ${i + 1}" onerror="this.style.display='none'">
            `;

            // console.log(`Attaching click event for event: ${event}, dateLabel: ${dateLabel}`);


            eventContainer.addEventListener('click', () => {
                console.log(`Event clicked: ${event}, dateLabel: ${dateLabel}`);
                this.showPopup(event, summary, startTime, keyFrame, cameraName, icon);
            });

            this.content.appendChild(eventContainer);
        }
    }

    showPopup(event, summary, startTime, keyFrame, cameraName, icon) {
        const date = new Date(startTime);
        const options = { month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${formattedDate}, ${hours}:${minutes}`;
        const secondaryText = cameraName ? `${formattedTime} • ${cameraName}` : formattedTime;
        const eventDetails = `
            <div>
                <div class="title-container">
                    <ha-icon icon="${icon}"></ha-icon>
                    <h2>${event}</h2>
                    <button class="close-popup" style="font-size:30">&times;</button>
                </div>
                <img src="${keyFrame}" alt="Event Snapshot" onerror="this.style.display='none'">
                <p class="secondary"><span>${secondaryText}</span></p>
                <p class="summary">${summary}</p>
            </div>
        `;

        const popup = document.createElement('div');
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    ${eventDetails}
                </div>
            </div>
            <style>
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .popup-content {
                    position: relative;
                    background: var(--ha-card-background, var(--card-background-color, black));
                    color: var(--primary-text-color);
                    padding: 20px;
                    border-radius: var(--border-radius, 12px);
                    max-width: 500px;
                    width: 100%;
                }
                .title-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                .title-container ha-icon {
                    margin-right: 10px;
                }
                .title-container h2 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex-grow: 1;
                }
                .popup-content img {
                    width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin-top: 10px;
                }
                .popup-content .secondary {
                    font-weight: bold;
                    color: var(--secondary-text-color);
                }
                .popup-content .summary {
                    color: var(--primary-text-color);
                    font-size: 16px;
                    line-height: 22px;
                    letter-spacing: 0.2px;
                }
                .close-popup {
                    background: none;
                    border: none;
                    font-size: 30px;
                    cursor: pointer;
                    color: var(--primary-text-color);
                }
            </style>
        `;

        document.body.appendChild(popup);

        popup.querySelector('.close-popup').addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        popup.querySelector('.popup-overlay').addEventListener('click', (event) => {
            if (event.target === popup.querySelector('.popup-overlay')) {
                document.body.removeChild(popup);
            }
        });
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