import { getIcon, translate, hexToRgba } from './helpers.js?v=1.5.1';
import { colors } from './colors.js?v=1.5.1';
import { LitElement, css, html } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

export class TimelineHorizontalCardEditor extends LitElement {
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
        const filterSchema = this._getSchema().slice(2, 7);
        const languageSchema = this._getSchema().slice(7, 7);
        const colorSchema = this._getSchema().slice(7);


        return html`
            <style>
                .card-content {
                    display: flex;
                    flex-direction: column;
                }
                details {
                    border: 1px solid var(--divider-color, #eeeeee);
                    border-radius: var(--ha-card-border-radius, 20px);
                    background: var(--ha-card-background, #f3f3f3);
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
                            { value: "hu", label: "Magyar" }
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
                padding: 0 0 8px 0 !important;
            }
        `;
    }
}

customElements.define("timeline-horizontal-card-editor", TimelineHorizontalCardEditor);

export class LLMVisionHorizontalCard extends HTMLElement {

    config;
    content;

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
        return document.createElement('timeline-horizontal-card-editor');
    }

    static getStubConfig() {
        return { entity: 'calendar.llm_vision_timeline', number_of_hours: 24, number_of_events: 3, language: 'en' };
    }

    set hass(hass) {
        if (!this.content) {
            this.innerHTML = `
                <ha-card style="padding: 16px;">
                    ${this.header !== "" ? `
                    <div class="card-header" style="font-size: 1.3em; font-weight: 600; padding: 0; padding-bottom: 1px;">
                        ${this.header || "Events Timeline"}
                    </div>
                    ` : ""}
                    <div class="most-recent-event" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; justify-content: space-between;">
                        <div class="most-recent-event-left" style="display: flex; align-items: center; gap: 8px;"></div>
                        <div class="most-recent-event-right" style="font-size: 0.98em; color: var(--secondary-text-color); min-width: 70px; text-align: right; margin-right: 16px;"></div>
                    </div>
                    <div class="card-content" style="padding: 0 0 8px 0;"></div>
                </ha-card>
                <style>
                    .timeline-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        padding-top: 15px;
                    }
                    .timeline-line {
                        position: relative;
                        width: 100%;
                        height: 5px;
                        background: var(--divider-color, #e0e0e0);
                        border-radius: 5px;
                        margin-bottom: 5px;
                        margin-top: 2px;
                    }
                    .timeline-segment {
                        position: absolute;
                        height: 100%;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: box-shadow 0.2s;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    }
                    .timeline-segment:hover {
                        box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    }
                    .event-label {
                        position: absolute;
                        top: 16px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: var(--ha-card-background, #f3f3f3);
                        color: var(--primary-text-color);
                        padding: 4px 10px;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 500;
                        white-space: nowrap;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        pointer-events: none;
                        opacity: 0;
                        transition: opacity 0.2s;
                    }
                    .timeline-segment:hover .event-label {
                        opacity: 1;
                    }
                    .event-image {
                        position: absolute;
                        top: 40px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60px;
                        height: 60px;
                        border-radius: 12px;
                        object-fit: cover;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        background: #fff;
                        display: none;
                    }
                    .timeline-segment:hover .event-image {
                        display: block;
                    }
                    .timeline-date {
                        font-size: 15px;
                        font-weight: 400;
                        color: var(--secondary-text-color);
                        margin-top: 10px;
                    }
                    .most-recent-event-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        display: inline-block;
                        margin-right: 4px;
                    }
                    .most-recent-event-title {
                        font-size: 1em;
                        font-weight: 500;
                        color: var(--primary-text-color);
                    }
                    @media (max-width: 768px) {
                        .timeline-line {
                            width: 98%;
                        }
                        .event-image {
                            width: 40px;
                            height: 40px;
                            top: 32px;
                        }
                        .event-label {
                            font-size: 12px;
                        }
                        .most-recent-event-title {
                            font-size: 0.95em;
                        }
                        .most-recent-event-dot {
                            width: 10px;
                            height: 10px;
                        }
                    }
                </style>
            `;
            this.content = this.querySelector('div.card-content');
            this.mostRecentEventDiv = this.querySelector('div.most-recent-event');
            this.mostRecentEventLeft = this.querySelector('.most-recent-event-left');
            this.mostRecentEventRight = this.querySelector('.most-recent-event-right');
        } else {
            const headerDiv = this.querySelector('.card-header');
            if (headerDiv) {
                if (this.header === "") {
                    headerDiv.style.display = "none";
                } else {
                    headerDiv.style.display = "";
                    headerDiv.textContent = this.header;
                }
            }
            this.mostRecentEventDiv = this.querySelector('div.most-recent-event');
            this.mostRecentEventLeft = this.querySelector('.most-recent-event-left');
            this.mostRecentEventRight = this.querySelector('.most-recent-event-right');
        }

        const calendarEntity = hass.states[this.entity];
        const numberOfEvents = this.number_of_events;
        const numberOfHours = this.number_of_hours;

        if (!calendarEntity) {
            console.error('Calendar entity not found:', this.entity);
            return;
        }

        const events = (calendarEntity.attributes.events || []).slice();
        const summaries = (calendarEntity.attributes.summaries || []).slice();
        const keyFrames = (calendarEntity.attributes.key_frames || []).slice();
        const cameraNames = (calendarEntity.attributes.camera_names || []).slice();
        const startTimes = (calendarEntity.attributes.starts || []).slice();

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

        // --- Show most recent event title, dot, and timestamp ---
        if (this.mostRecentEventLeft && this.mostRecentEventRight) {
            this.mostRecentEventLeft.innerHTML = '';
            this.mostRecentEventRight.innerHTML = '';
            if (eventDetails.length > 0) {
                // Most recent event is the first after filters and sorting
                const mostRecent = eventDetails.slice().sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0];
                const { event, summary, startTime, keyFrame, cameraName } = mostRecent;
                const { category, color: defaultColor } = getIcon(event, this.language);
                const customColors = this.config?.custom_colors || {};
                let color = customColors[category] !== undefined ? customColors[category] : defaultColor;
                let bgColorRgba;
                if (Array.isArray(color) && color.length === 3) {
                    bgColorRgba = `rgba(${color[0]},${color[1]},${color[2]},1)`;
                } else {
                    bgColorRgba = hexToRgba(color, 1);
                }
                const dot = document.createElement('span');
                dot.className = 'most-recent-event-dot';
                dot.style.background = bgColorRgba;
                const title = document.createElement('span');
                title.className = 'most-recent-event-title';
                title.textContent = event;
                title.style.cursor = 'pointer';
                title.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPopup(event, summary, startTime, keyFrame, cameraName, null);
                });
                this.mostRecentEventLeft.appendChild(dot);
                this.mostRecentEventLeft.appendChild(title);
                // Format timestamp (HH:mm)
                const date = new Date(startTime);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}`;
                this.mostRecentEventRight.textContent = formattedTime;
            }
        }

        // Filter events based on numberOfHours if set
        if (numberOfHours) {
            const cutoffTime = new Date().getTime() - numberOfHours * 60 * 60 * 1000;
            eventDetails = eventDetails.filter(detail => new Date(detail.startTime).getTime() >= cutoffTime);
            if (numberOfEvents) {
                // Limit the number of events to display if numberOfEvents is set
                eventDetails = eventDetails.slice(0, numberOfEvents);
            }
        }

        // Filter events based on category filters
        if (this.category_filters && this.category_filters.length > 0) {
            eventDetails = eventDetails.filter(detail => {
                const { event } = detail;
                const { category } = getIcon(event, this.language);
                return this.category_filters.includes(category);
            });
        }

        // --- Filter events based on camera filters ---
        if (this.camera_filters && this.camera_filters.length > 0) {
            eventDetails = eventDetails.filter(detail => {
                // If no cameraEntityId always show event
                if (!detail.cameraEntityId) return true;
                return this.camera_filters.includes(detail.cameraEntityId);
            });
        }

        // Sort event details by start time
        eventDetails.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        // Clear previous content
        this.content.innerHTML = '';

        // Horizontal timeline rendering
        const timelineContainer = document.createElement('div');
        timelineContainer.classList.add('timeline-container');

        // Timeline line
        const timelineLine = document.createElement('div');
        timelineLine.classList.add('timeline-line');
        timelineContainer.appendChild(timelineLine);

        if (eventDetails.length > 0) {
            let labelText;
            if (numberOfHours) {
                labelText = `Last ${numberOfHours}h`;
            } else {
                const firstDate = new Date(eventDetails[eventDetails.length - 1].startTime);
                const lastDate = new Date(eventDetails[0].startTime);
                const options = { month: 'short', day: 'numeric' };
                labelText = `${firstDate.toLocaleDateString('en', options)} - ${lastDate.toLocaleDateString('en', options)}`;
            }
            const dateDiv = document.createElement('div');
            dateDiv.classList.add('timeline-date');
            dateDiv.textContent = labelText;
            timelineContainer.appendChild(dateDiv);
        }

        // Calculate segment positions and widths based on time range
        let totalEvents = numberOfHours ? eventDetails.length : Math.min(numberOfEvents, eventDetails.length);
        let minTime, maxTime;
        if (numberOfHours && eventDetails.length > 0) {
            maxTime = new Date().getTime();
            minTime = maxTime - numberOfHours * 60 * 60 * 1000;
        } else if (eventDetails.length > 0) {
            // fallback: use earliest and latest event
            minTime = Math.min(...eventDetails.map(e => new Date(e.startTime).getTime()));
            maxTime = Math.max(...eventDetails.map(e => new Date(e.startTime).getTime()));
        }

        for (let i = 0; i < totalEvents; i++) {
            const { event, summary, startTime, cameraName, keyFrame } = eventDetails[i];
            const eventTime = new Date(startTime).getTime();
            const hours = new Date(startTime).getHours().toString().padStart(2, '0');
            const minutes = new Date(startTime).getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            // Use custom color if set, otherwise fallback to default
            const { category, color: defaultColor } = getIcon(event, this.language);
            const customColors = this.config?.custom_colors || {};
            let color = customColors[category] !== undefined ? customColors[category] : defaultColor;
            let bgColorRgba;
            if (Array.isArray(color) && color.length === 3) {
                bgColorRgba = `rgba(${color[0]},${color[1]},${color[2]},0.8)`;
            } else {
                bgColorRgba = hexToRgba(color, 0.8);
            }
            // Calculate left and width for segment based on time
            let leftPercent = 0, widthPercent = 2;
            if (minTime !== undefined && maxTime !== undefined && maxTime > minTime) {
                leftPercent = ((eventTime - minTime) / (maxTime - minTime)) * 100;
                // widthPercent: show as a small fixed width (2%)
            } else {
                leftPercent = (i / totalEvents) * 100;
            }

            const segment = document.createElement('div');
            segment.classList.add('timeline-segment');
            segment.style.left = `calc(${leftPercent}% - 1%)`;
            segment.style.width = `${widthPercent}%`;
            segment.style.background = bgColorRgba;

            // Label for event
            const label = document.createElement('div');
            label.classList.add('event-label');
            label.textContent = `${event} (${formattedTime}${cameraName ? ' • ' + cameraName : ''})`;
            segment.appendChild(label);

            // Optional: show key frame image on hover
            if (keyFrame) {
                const img = document.createElement('img');
                img.classList.add('event-image');
                img.src = keyFrame.replace('/config/www/', '/local/');
                img.alt = `Key frame ${i + 1}`;
                img.onerror = function () { this.style.display = 'none'; };
                segment.appendChild(img);
            }

            segment.addEventListener('click', () => {
                this.showPopup(event, summary, startTime, keyFrame, cameraName, null);
            });

            timelineLine.appendChild(segment);
        }

        this.content.appendChild(timelineContainer);
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
