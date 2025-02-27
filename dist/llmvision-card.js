import { getIcon } from './helpers.js';

class LLMVisionCard extends HTMLElement {

    config;
    content;
    lastUpdateTime;

    // required
    setConfig(config) {
        this.config = config;
        this.calendar_entity = config.calendar_entity || 'calendar.llm_vision_timeline';
        this.number_of_events = config.number_of_events || 5;
        this.refresh_interval = config.refresh_interval || 10;
        this.language = config.language || 'en';
    }

    set hass(hass) {
        const now = new Date().getTime();
        if (this.lastUpdateTime && (now - this.lastUpdateTime < this.refresh_interval * 1000)) {
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
                        height: 75px;
                        z-index: 2;
                        margin-bottom: 10px;
                        cursor: pointer;
                    }
                
                    .event-container:last-child {
                        margin-bottom: 0;
                    }
                
                    .event-container img {
                        height: 100%;
                        aspect-ratio: 1 / 1;
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
                        white-space: nowrap; /* Prevent text from wrapping */
                        overflow: hidden; /* Hide overflowed text */
                        text-overflow: ellipsis; /* Add ellipsis (...) */
                    }
                
                    .event-container p {
                        font-weight: 400;
                        font-size: 12px;
                        letter-spacing: 0.4px;
                        margin: 0;
                        flex-grow: 1;
                        color: var(--primary-text-color);
                        white-space: nowrap;
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
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                        position: relative;
                        transition: transform 180ms ease-in-out;
                        flex-shrink: 0; /* Prevent shrinking */
                    }
                
                    .event-details {
                        flex-grow: 1;
                        min-width: 0; /* Allow text to overflow properly */
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

        const events = (calendarEntity.attributes.events || []).slice()
        const summaries = (calendarEntity.attributes.summaries || []).slice()
        const keyFrames = (calendarEntity.attributes.key_frames || []).slice()
        const cameraNames = (calendarEntity.attributes.camera_names || []).slice()
        const startTimes = (calendarEntity.attributes.starts || []).slice()

        const eventDetails = events.map((event, index) => {
            const cameraEntity = hass.states[cameraNames[index]];
            const cameraFriendlyName = cameraEntity ? cameraEntity.attributes.friendly_name : '';
            return {
                event,
                summary: summaries[index],
                keyFrame: keyFrames[index] || '',
                cameraName: cameraFriendlyName,
                startTime: startTimes[index]
            };
        });

        // Sort event details by start time
        eventDetails.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        // Clear previous content
        this.content.innerHTML = '';

        // Add events and key frames for the specified number of events
        let lastDate = '';

        for (let i = 0; i < Math.min(numberOfEvents, events.length); i++) {
            const { event, summary, startTime, cameraName } = eventDetails[i];
            let keyFrame = eventDetails[i].keyFrame;
            const date = new Date(startTime);
            const options = { month: 'short', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en', options);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            const { icon, backgroundColor, iconColor } = getIcon(event, this.language);
            const secondaryText = cameraName ? `${formattedTime} • ${cameraName}` : formattedTime;

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
                <div class="icon-container" style="background-color: ${backgroundColor};">
                    <ha-icon icon="${icon}" style="color: ${iconColor};"></ha-icon>
                </div>
                <div class="event-details">
                    <h3>${event}</h3>
                    <p>${secondaryText}</p>
                </div>
                <img src="${keyFrame}" alt="Key frame ${i + 1}" onerror="this.style.display='none'">
            `;

            eventContainer.addEventListener('click', () => {
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
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
                .popup-overlay.show {
                    opacity: 1;
                }
                .popup-content {
                    position: relative;
                    background: var(--ha-card-background, var(--card-background-color, black));
                    color: var(--primary-text-color);
                    padding: 20px;
                    border-radius: var(--border-radius, 12px);
                    max-width: 500px;
                    width: 100%;
                    max-height: 80vh;
                    overflow-y: auto;
                    transform: scale(0.9);
                    transition: transform 0.2s ease;
                }
                .popup-overlay.show .popup-content {
                    transform: scale(1);
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
            
                /* Mobile Layout */
                @media (max-width: 768px) {
                    .popup-content {
                        max-width: 100%;
                        max-height: 100%;
                        border-radius: 0;
                        height: 100%;
                    }
                }
            </style>
        `;

        document.body.appendChild(popup);

        // Add the show class to trigger the animation
        requestAnimationFrame(() => {
            popup.querySelector('.popup-overlay').classList.add('show');
        });

        popup.querySelector('.close-popup').addEventListener('click', () => {
            this.closePopup(popup);
        });

        popup.querySelector('.popup-overlay').addEventListener('click', (event) => {
            if (event.target === popup.querySelector('.popup-overlay')) {
                this.closePopup(popup);
            }
        });
    }

    closePopup(popup) {
        // Remove the show class to trigger the closing animation
        popup.querySelector('.popup-overlay').classList.remove('show');
        popup.querySelector('.popup-overlay').addEventListener('transitionend', () => {
            document.body.removeChild(popup);
        }, { once: true });
    }

    static getStubConfig() {
        return { calendar_entity: 'calendar.llm_vision_timeline', number_of_events: 5, refresh_interval: 10 };
    }
}

customElements.define('llmvision-card', LLMVisionCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "llmvision-card",
    name: "LLM Vision Timeline Card",
    description: "Display the LLM Vision Timeline on your dashboard",
});