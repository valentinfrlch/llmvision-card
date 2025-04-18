import { getIcon, translate, hexToRgba } from './helpers.js';
import { colors } from './colors.js';
import { LitElement, css, html } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class TimelineCardEditor extends LitElement {
    static get properties() {
        return {
            _config: { type: Object },
        };
    }

    setConfig(config) {
        this._config = config || {};
    }

    render() {
        if (!this._config) {
            return html`<div>Please configure the card.</div>`;
        }

        // Split schema into two sections for demonstration
        const generalSchema = this._getSchema().slice(0, 2);
        const filterSchema = this._getSchema().slice(2, 4);
        const languageSchema = this._getSchema().slice(4, 5);
        const colorSchema = this._getSchema().slice(5);


        return html`
            <style>
                .card-content {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                details {
                    border: 1px solid var(--divider-color, #e0e0e0);
                    border-radius: var(--border-radius, 12px);
                    background: var(--card-background-color, #fff);
                    margin-bottom: 0;
                    overflow: hidden;
                }
                summary {
                    font-weight: 500;
                    font-size: 1rem;
                    padding: 12px 16px;
                    cursor: pointer;
                    outline: none;
                    user-select: none;
                    display: flex;
                    align-items: center;
                }
                summary::-webkit-details-marker {
                    display: none;
                }
                summary:before {
                    content: '';
                    display: inline-block;
                    margin-right: 8px;
                    border-style: solid;
                    border-width: 0.35em 0.35em 0 0.35em;
                    border-color: var(--primary-text-color) transparent transparent transparent;
                    vertical-align: middle;
                    transition: transform 0.2s;
                    transform: rotate(-90deg);
                }
                details[open] summary:before {
                    transform: rotate(0deg);
                }
                .section-content {
                    padding: 16px;
                }
                .section-icon {
                    margin-right: 8px;
                    color: var(--primary-text-color);
                    font-size: 20px;
                    vertical-align: middle;
                }
            </style>
            <ha-card>
                <div class="card-content">
                    <details open>
                        <summary><ha-icon class="section-icon" icon="mdi:cog"></ha-icon>General</summary>
                        <div class="section-content">
                            <ha-form
                                .data=${this._config}
                                .schema=${generalSchema}
                                .computeLabel=${this._computeLabel}
                                .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}
                            ></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:filter-variant"></ha-icon>Filters</summary>
                        <div class="section-content">
                            <ha-form
                                .data=${this._config}
                                .schema=${filterSchema}
                                .computeLabel=${this._computeLabel}
                                .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}
                            ></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:translate"></ha-icon>Language</summary>
                        <div class="section-content">
                            <ha-form
                                .data=${this._config}
                                .schema=${languageSchema}
                                .computeLabel=${this._computeLabel}
                                .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}
                            ></ha-form>
                        </div>
                    </details>
                    <details>
                    <summary><ha-icon class="section-icon" icon="mdi:palette"></ha-icon>Category Colors</summary>
                    <div class="section-content">
                        <ha-form
                            .data=${this._config}
                            .schema=${colorSchema}
                            .computeLabel=${this._computeLabel}
                            .computeHelper=${this._computeHelper}
                            @value-changed=${this._valueChanged}
                        ></ha-form>
                    </div>
                </details>
                </div>
            </ha-card>
        `;
    }

    _getSchema() {
        const baseSchema = [
            {
                name: "calendar_entity",
                description: "Select the LLM Vision timeline entity to display.",
                selector: {
                    select: {
                        mode: "dropdown",
                        options: [
                            // get calendar entities from this.hass.states
                            ...Object.keys(this.hass.states)
                                .filter(entity => entity.startsWith('calendar.'))
                                .map(entity => ({
                                    value: entity,
                                    label: this.hass.states[entity].attributes.friendly_name || entity
                                }))
                        ]
                    }
                }
            },
            {
                name: "refresh_interval", description: "How often to refresh the card (in seconds).",
                selector: { number: { min: 1, max: 360, step: 1 } }
            },
            {
                name: "number_of_events",
                description: "Number of most recent events to display. A maximum of 10 events can be displayed.",
                selector: { number: { min: 1, max: 10, step: 1 } }
            },
            {
                name: "number_of_hours",
                description: "Number of hours to look back for events. Useful for filtering older events.",
                selector: { number: { min: 1, max: 168, step: 1 } }
            },
            {
                name: "language",
                description: "Language for the card. This will be used to generate icons and translations.",
                selector: {
                    select: {
                        options: [
                            { value: "de", label: "German" },
                            { value: "en", label: "English" },
                            { value: "es", label: "Spanish" },
                            { value: "fr", label: "French" },
                            { value: "it", label: "Italian" },
                            { value: "nl", label: "Dutch" },
                            { value: "pl", label: "Polish" },
                            { value: "pt", label: "Portuguese" },
                            { value: "sv", label: "Swedish" }
                        ]
                    }
                }
            },];

        const colorSchema = Object.keys(colors.categories).map(category => ({
            name: `custom_colors.${category}`,
            description: `Color for ${category.charAt(0).toUpperCase() + category.slice(1)}`,
            selector: { color_rgb: {} }
        }));

        return [
            ...baseSchema,
            ...colorSchema
        ];
    }

    _computeLabel(schema) {
        const labels = {
            calendar_entity: "Calendar Entity",
            refresh_interval: "Refresh Interval (seconds)",
            number_of_events: "Number of Events",
            number_of_hours: "Number of Hours",
            language: "Language",
        };
        return labels[schema.name] || schema.name;
    }

    _computeHelper = (schema) => schema.description || "";

    _valueChanged(event) {
        let newConfig = event.detail.value;

        // Merge new custom_colors with existing ones
        let customColors = { ...(this._config.custom_colors || {}) };
        for (const key of Object.keys(newConfig)) {
            if (key.startsWith('custom_colors.')) {
                const category = key.split('.')[1];
                customColors[category] = newConfig[key];
                delete newConfig[key];
            }
        }
        if (Object.keys(customColors).length > 0) {
            newConfig.custom_colors = customColors;
        }

        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
    }

    static get styles() {
        return css`
            ha-card {
                padding: 16px;
            }
            .card-content {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
        `;
    }
}

customElements.define("timeline-card-editor", TimelineCardEditor);

class LLMVisionCardBeta extends HTMLElement {

    config;
    content;
    lastUpdateTime;

    // required
    setConfig(config) {
        this.config = config;
        this.calendar_entity = config.calendar_entity;
        this.number_of_events = config.number_of_events;
        this.number_of_hours = config.number_of_hours;
        this.refresh_interval = config.refresh_interval;
        this.language = config.language;
        this.custom_colors = config.custom_colors || {};

        if (!this.calendar_entity) {
            throw new Error('You need to define the timeline (calendar entity) in the card configuration.');
        }
        if (!this.number_of_events && !this.number_of_hours) {
            throw new Error('Either number_of_events or number_of_hours needs to be set.');
        }
        if (this.number_of_events < 1) {
            throw new Error('number_of_events must be greater than 0.');
        }
    }

    static getConfigElement() {
        return document.createElement('timeline-card-editor');
    }

    static getStubConfig() {
        return { calendar_entity: 'calendar.llm_vision_timeline', number_of_hours: 24, number_of_events: 5, refresh_interval: 10, language: 'en' };
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
        const numberOfHours = this.number_of_hours;

        if (!calendarEntity) {
            console.error('Calendar entity not found:', this.calendar_entity);
            return;
        }

        const events = (calendarEntity.attributes.events || []).slice()
        const summaries = (calendarEntity.attributes.summaries || []).slice()
        const keyFrames = (calendarEntity.attributes.key_frames || []).slice()
        const cameraNames = (calendarEntity.attributes.camera_names || []).slice()
        const startTimes = (calendarEntity.attributes.starts || []).slice()

        let eventDetails = events.map((event, index) => {
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

        // Filter events based on numberOfHours if set
        if (numberOfHours) {
            const cutoffTime = new Date().getTime() - numberOfHours * 60 * 60 * 1000;
            eventDetails = eventDetails.filter(detail => new Date(detail.startTime).getTime() >= cutoffTime);
            if (numberOfEvents) {
                // Limit the number of events to display if numberOfEvents is set
                eventDetails = eventDetails.slice(0, numberOfEvents);
            }
        }

        // Sort event details by start time
        eventDetails.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        // Clear previous content
        this.content.innerHTML = '';

        // Handle empty events (when calendar is fetching events)
        if (events.length === 0) {
            const loadingContainer = document.createElement('div');
            loadingContainer.innerHTML = `
                <div class="event-container" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    <h3>${translate('noEvents', this.language)}</h3>
                </div>
            `;
            this.content.appendChild(loadingContainer);
        }

        if (numberOfHours && eventDetails.length === 0) {
            const noEventsContainer = document.createElement('div');
            const noEventsMessage = translate('noEventsHours', this.language).replace('{hours}', numberOfHours);
            noEventsContainer.innerHTML = `
                <div class="event-container" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    <h3>${noEventsMessage}</h3>
                </div>
            `;
            this.content.appendChild(noEventsContainer);
            return;
        }

        // Add events and key frames for the specified number of events
        let lastDate = '';

        for (let i = 0; i < (numberOfHours ? eventDetails.length : Math.min(numberOfEvents, eventDetails.length)); i++) {
            const { event, summary, startTime, cameraName } = eventDetails[i];
            let keyFrame = eventDetails[i].keyFrame;
            const date = new Date(startTime);
            const options = { month: 'short', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en', options);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            const { icon, color: defaultColor, category } = getIcon(event, this.language);

            // Use custom color if set, otherwise fallback to default
            const customColors = this.config?.custom_colors || {};
            let color = customColors[category] !== undefined ? customColors[category] : defaultColor;

            let bgColorRgba, iconColorRgba;
            if (Array.isArray(color) && color.length === 3) {
                // color is [r, g, b] from custom color picker
                console.log('color is array', color);
                bgColorRgba = `rgba(${color[0]},${color[1]},${color[2]},0.2)`;
                iconColorRgba = `rgba(${color[0]},${color[1]},${color[2]},1)`;
            } else {
                // color is hex string
                bgColorRgba = hexToRgba(color, 0.2);
                iconColorRgba = hexToRgba(color, 1);
            }

            const secondaryText = cameraName ? `${formattedTime} • ${cameraName}` : formattedTime;

            keyFrame = keyFrame.replace('/config/www/', '/local/');

            // Determine the date label
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            let dateLabel;
            if (date.toDateString() === today.toDateString()) {
                dateLabel = translate('today', this.language);
            } else if (date.toDateString() === yesterday.toDateString()) {
                dateLabel = translate('yesterday', this.language);
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
                <div class="icon-container" style="background-color: ${bgColorRgba};">
                    <ha-icon icon="${icon}" style="color: ${iconColorRgba};"></ha-icon>
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

        // Push a new history state
        if (!history.state || !history.state.popupOpen) {
            history.pushState({ popupOpen: true }, '');
        }

        // Define the popstate handler
        const popstateHandler = () => {
            this.closePopup(popup, popstateHandler);
        };

        // Add the popstate event listener
        window.addEventListener('popstate', popstateHandler);

        // Add other event listeners for closing the popup
        popup.querySelector('.close-popup').addEventListener('click', () => {
            this.closePopup(popup, popstateHandler);
        });

        popup.querySelector('.popup-overlay').addEventListener('click', (event) => {
            if (event.target === popup.querySelector('.popup-overlay')) {
                this.closePopup(popup, popstateHandler);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closePopup(popup, popstateHandler);
            }
        });

        // Add the popup to the DOM
        document.body.appendChild(popup);

        // Add the show class to trigger the animation
        requestAnimationFrame(() => {
            popup.querySelector('.popup-overlay').classList.add('show');
        });
    }

    closePopup(popup, popstateHandler) {
        // Remove the show class to trigger the closing animation
        popup.querySelector('.popup-overlay').classList.remove('show');
        popup.querySelector('.popup-overlay').addEventListener('transitionend', () => {
            document.body.removeChild(popup);
        }, { once: true });

        // Clean up the history state
        if (history.state && history.state.popupOpen) {
            history.replaceState(null, ''); // Replace the current state to avoid navigating back
        }

        // Remove the popstate event listener
        window.removeEventListener('popstate', popstateHandler);
    }

    static getStubConfig() {
        return { calendar_entity: 'calendar.llm_vision_timeline', number_of_hours: 24, number_of_events: 5, refresh_interval: 10, language: 'en' };
    }
}

customElements.define('llmvision-card-beta', LLMVisionCardBeta);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "llmvision-card-beta",
    name: "LLM Vision Timeline Card (Beta)",
    description: "Display the LLM Vision Timeline on your dashboard",
    preview: true,
    getConfigElement: LLMVisionCardBeta.getConfigElement,
    getConfigElementStub: LLMVisionCardBeta.getConfigElementStub,
});