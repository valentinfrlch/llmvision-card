import { getIcon, translate, hexToRgba } from './helpers.js?v=1.5.1';
import { colors } from './colors.js?v=1.5.1';
import { LitElement, css, html } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
import { LLMVisionPreviewCard } from './llmvision-preview-card.js?v=1.5.1';


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

        const generalSchema = this._getSchema().slice(0, 2);
        const filterSchema = this._getSchema().slice(2, 6);
        const languageSchema = this._getSchema().slice(6, 7);
        const colorSchema = this._getSchema().slice(7);


        return html`
            <style>
                .card-content {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                details {
                    border: 1px solid var(--divider-color, #eeeeee);
                    border-radius: var(--ha-card-border-radius, 20px);
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
        const generalSchema = [
            {
                name: "header",
                description: "Header text for the card.",
                selector: { text: {} }
            },
            {
                name: "entity",
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
            }
        ];
        const filterSchema = [
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
                name: "category_filters",
                description: "Filter events by category (title). Only events matching selected categories will be shown.",
                selector: {
                    select: {
                        multiple: true,
                        options: Object.keys(colors.categories).map(category => ({
                            value: category,
                            label: category.charAt(0).toUpperCase() + category.slice(1)
                        }))
                    }
                }
            },
            {
                name: "camera_filters",
                description: "Filter events by camera entity. Only events from selected cameras will be shown.",
                selector: {
                    select: {
                        multiple: true,
                        options: Object.keys(this.hass.states)
                            .filter(entity => entity.startsWith('camera.'))
                            .map(entity => ({
                                value: entity,
                                label: this.hass.states[entity].attributes.friendly_name || entity
                            }))
                    }
                }
            }
        ];
        const languageSchema = [
            {
                name: "language",
                description: "Language for the card. This will be used to generate icons and translations.",
                selector: {
                    select: {
                        options: [
                            { value: "ca", label: "Catalan" },
                            { value: "de", label: "German" },
                            { value: "en", label: "English" },
                            { value: "es", label: "Spanish" },
                            { value: "fr", label: "French" },
                            { value: "it", label: "Italian" },
                            { value: "nl", label: "Dutch" },
                            { value: "pl", label: "Polish" },
                            { value: "pt", label: "Portuguese" },
                            { value: "sk", label: "Slovak" },
                            { value: "sv", label: "Swedish" }
                        ]
                    }
                }
            }
        ];

        const colorSchema = Object.keys(colors.categories).map(category => ({
            name: `custom_colors.${category}`,
            description: `Color for ${category.charAt(0).toUpperCase() + category.slice(1)}`,
            selector: { color_rgb: {} }
        }));

        return [
            ...generalSchema,
            ...filterSchema,
            ...languageSchema,
            ...colorSchema
        ];
    }

    _computeLabel(schema) {
        const labels = {
            header: "Header",
            entity: "Calendar Entity",
            number_of_events: "Number of Events",
            number_of_hours: "Number of Hours",
            category_filters: "Category Filters",
            camera_filters: "Camera Filters",
            custom_colors: "Custom Colors",
            language: "Language",
        };
        return labels[schema.name] || schema.name;
    }

    _computeHelper = (schema) => schema.description || "";

    _valueChanged(event) {
        let newConfig = event.detail.value;

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

class LLMVisionCard extends HTMLElement {

    imageCache = new Map();
    config;
    content;
    _lastEventHash = null;

    // required
    setConfig(config) {
        this.config = config;
        this.header = config.header || '';
        this.entity = config.entity;
        this.number_of_events = config.number_of_events;
        this.number_of_hours = config.number_of_hours;
        this.category_filters = config.category_filters || [];
        this.camera_filters = config.camera_filters || [];
        this.language = config.language;
        this.custom_colors = config.custom_colors || {};

        if (!this.entity) {
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
        return { entity: 'calendar.llm_vision_timeline', number_of_hours: 24, number_of_events: 3, language: 'en' };
    }

    set hass(hass) {
        if (!this.content) {
            this.innerHTML = `
                <ha-card style="padding: 16px;">
                    ${this.header !== "" ? `
                    <div class="card-header" style="font-size: 1.3em; font-weight: 600; padding: 0 0 5px 0;">
                        ${this.header || "LLM Vision Events"}
                    </div>
                    ` : ""}
                    <div class="card-content"></div>
                </ha-card>
                <style>
                    .card-content {
                        padding: 0;
                    }
                    .event-container {
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        height: 75px;
                        z-index: 2;
                        cursor: pointer;
                        margin-bottom: 8px;
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
                        font-weight: var(--ha-font-weight-medium, 500);
                        font-size: var(--ha-font-size-m, 14px);
                        letter-spacing: 0.1px;
                        margin: 0;
                        flex-grow: 1;
                        color: var(--primary-text-color);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                
                    .event-container p {
                        font-weight: var(--ha-font-weight-normal, 400);
                        font-size: var(--ha-font-size-s, 12px);
                        letter-spacing: 0.4px;
                        margin: 0;
                        flex-grow: 1;
                        color: var(--secondary-text-color);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                
                    .date-header h2 {
                        font-weight: var(--ha-font-weight-medium, 500);
                        font-size: var(--ha-font-size-l, 16px);
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
                        flex-shrink: 0;
                    }
                
                    .event-details {
                        flex-grow: 1;
                        min-width: 0;
                    }
                </style>
            `;
            this.content = this.querySelector('div.card-content');
        } else {
            // Update header if it changes dynamically
            const headerDiv = this.querySelector('.card-header');
            if (headerDiv) {
                if (this.header === "") {
                    headerDiv.style.display = "none";
                } else {
                    headerDiv.style.display = "";
                    headerDiv.textContent = this.header;
                }
            }
        }

        const calendarEntity = hass.states[this.entity];
        const numberOfEvents = this.number_of_events;
        const numberOfHours = this.number_of_hours;

        if (!calendarEntity) {
            console.error('Calendar entity not found:', this.entity);
            return;
        }

        const events = (calendarEntity.attributes.events || []).slice()
        const summaries = (calendarEntity.attributes.summaries || []).slice()
        const keyFrames = (calendarEntity.attributes.key_frames || []).slice()
        const cameraNames = (calendarEntity.attributes.camera_names || []).slice()
        const startTimes = (calendarEntity.attributes.starts || []).slice()

        const currentEventHash = JSON.stringify({
            events,
            summaries,
            keyFrames,
            cameraNames,
            startTimes,
            category_filters: this.category_filters,
            camera_filters: this.camera_filters,
            number_of_events: this.number_of_events,
            number_of_hours: this.number_of_hours,
        });

        // Skip update if no changes
        if (currentEventHash === this._lastEventHash) {
            return;
        }
        this._lastEventHash = currentEventHash;

        let eventDetails = events.map((event, index) => {
            const cameraEntityId = cameraNames[index];
            const cameraEntity = hass.states[cameraNames[index]];
            const cameraFriendlyName = cameraEntity ? cameraEntity.attributes.friendly_name : '';
            return {
                event,
                summary: summaries[index],
                keyFrame: keyFrames[index] || '',
                cameraName: cameraFriendlyName,
                cameraEntityId,
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

        // Filter based on number of hours and number of events
        if (numberOfHours && eventDetails.length === 0) {
            this.content.innerHTML = '';
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

        // Filter events based on category filters
        if (this.category_filters && this.category_filters.length > 0) {
            eventDetails = eventDetails.filter(detail => {
                const { event } = detail;
                const { category } = getIcon(event, this.language);
                return this.category_filters.includes(category);
            });
            // Show message if no events match the category filter
            if (eventDetails.length === 0) {
                this.content.innerHTML = '';
                const noEventsContainer = document.createElement('div');
                const noEventsMessage = translate('noEventsCategory', this.language) || "No events found for the selected category(s).";
                noEventsContainer.innerHTML = `
                            <div class="event-container" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                                <h3>${noEventsMessage}</h3>
                            </div>
                        `;
                this.content.appendChild(noEventsContainer);
                return;
            }
        }

        // --- Filter events based on camera filters ---
        if (this.camera_filters && this.camera_filters.length > 0) {
            eventDetails = eventDetails.filter(detail => {
                // If no cameraEntityId always show event
                if (!detail.cameraEntityId) return true;
                return this.camera_filters.includes(detail.cameraEntityId);
            });
            // Show message if no events match the camera filter
            if (eventDetails.length === 0) {
                this.content.innerHTML = '';
                const noEventsContainer = document.createElement('div');
                const noEventsMessage = translate('noEventsCamera', this.language) || "No events found for the selected camera(s).";
                noEventsContainer.innerHTML = `
                            <div class="event-container" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                                <h3>${noEventsMessage}</h3>
                            </div>
                        `;
                this.content.appendChild(noEventsContainer);
                return;
            }
        }

        // Sort event details by start time
        eventDetails.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        // Clear previous content
        this.content.innerHTML = '';

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
                bgColorRgba = `rgba(${color[0]},${color[1]},${color[2]},0.2)`;
                iconColorRgba = `rgba(${color[0]},${color[1]},${color[2]},1)`;
            } else {
                // color is hex string
                bgColorRgba = hexToRgba(color, 0.2);
                iconColorRgba = hexToRgba(color, 1);
            }

            const secondaryText = cameraName ? `${formattedTime} • ${cameraName}` : formattedTime;

            const renderEvent = () => {
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

            let mediaContentID = keyFrame.replace('/config/media/', 'media-source://media_source/');

            // Use cache if available
            if (this.imageCache.has(mediaContentID)) {
                keyFrame = this.imageCache.get(mediaContentID);
                renderEvent();
            } else {
                hass.callWS({
                    type: "media_source/resolve_media",
                    media_content_id: mediaContentID,
                    expires: 60 * 60 * 3 // 3 hours
                }).then(result => {
                    keyFrame = result.url;
                    this.imageCache.set(mediaContentID, keyFrame);
                }).catch(error => {
                    console.error("Error resolving media content ID:", error);
                }).finally(() => {
                    renderEvent();
                });
            }
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
                     <button class="close-popup" style="font-size:30"><ha-icon icon="mdi:close"></ha-icon></button>
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
                    background: var(--ha-card-background, var(--card-background-color, #f3f3f3));
                    color: var(--primary-text-color);
                    padding: 20px;
                    border-radius: var(--ha-card-border-radius, 25px);
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
                    font-family: var(--ha-font-family-heading, "Roboto");
                }
                .popup-content img {
                    width: 100%;
                    height: auto;
                    border-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
                    margin-top: 10px;
                }
                .popup-content .secondary {
                    font-weight: var(--ha-font-weight-medium, 500);
                    color: var(--primary-text-color);
                    font-family: var(--ha-font-family-body, "Roboto");
                }
                .popup-content .summary {
                    color: var(--secondary-text-color);
                    font-size: var(--ha-font-size-l, 16px);
                    line-height: 22px;
                    font-family: var(--ha-font-family-body, "Roboto");
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
        return { entity: 'calendar.llm_vision_timeline', number_of_hours: 24, number_of_events: 5, language: 'en' };
    }
}

customElements.define('llmvision-card', LLMVisionCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "llmvision-card",
    name: "LLM Vision Timeline Card",
    description: "Display the LLM Vision Timeline on your dashboard",
    preview: true,
    getConfigElement: LLMVisionCard.getConfigElement,
    getConfigElementStub: LLMVisionCard.getConfigElementStub,
});

customElements.define('llmvision-preview-card', LLMVisionPreviewCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "llmvision-preview-card",
    name: "LLM Vision Preview Card",
    description: "Preview the latest LLM Vision event",
    preview: true,
    getConfigElement: LLMVisionPreviewCard.getConfigElement,
    getConfigElementStub: LLMVisionPreviewCard.getConfigElementStub,
});