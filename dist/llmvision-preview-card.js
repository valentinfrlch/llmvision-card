import { getIcon, translate, hexToRgba } from './helpers.js?v=1.5.0-beta.1';
import { colors } from './colors.js?v=1.5.0-beta.1';
import { LitElement, css, html } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

export class TimelinePreviewCardEditor extends LitElement {
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

        const generalSchema = this._getSchema().slice(0, 1);
        const filterSchema = this._getSchema().slice(1, 3);
        const languageSchema = this._getSchema().slice(3);


        return html`
            <style>
                .preview-card-content {
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
                <div class="preview-card-content">
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
                </div>
            </ha-card>
        `;
    }

    _getSchema() {
        const generalSchema = [
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
                        ]
                    }
                }
            }
        ];

        return [
            ...generalSchema,
            ...filterSchema,
            ...languageSchema,
        ];
    }

    _computeLabel(schema) {
        const labels = {
            entity: "Calendar Entity",
            category_filters: "Category Filters",
            camera_filters: "Camera Filters",
            language: "Language",
        };
        return labels[schema.name] || schema.name;
    }

    _computeHelper = (schema) => schema.description || "";

    _valueChanged(event) {
        let newConfig = event.detail.value;

        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
    }

    static get styles() {
        return css`
            ha-card {
                padding: 16px;
            }
            .preview-card-content {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
        `;
    }
}

customElements.define("timeline-preview-card-editor", TimelinePreviewCardEditor);

export class LLMVisionPreviewCard extends HTMLElement {

    config;
    content;

    // required
    setConfig(config) {
        this.config = config;
        this.entity = config.entity;
        this.category_filters = config.category_filters || [];
        this.camera_filters = config.camera_filters || [];
        this.language = config.language;

        if (!this.entity) {
            throw new Error('You need to define the timeline (calendar entity) in the card configuration.');
        }
    }

    static getConfigElement() {
        return document.createElement('timeline-preview-card-editor');
    }

    static getStubConfig() {
        return { entity: 'calendar.llm_vision_timeline', language: 'en' };
    }

    set hass(hass) {
        if (!this.content) {
            this.innerHTML = `
                <ha-card>
                    <div class="preview-card-content"></div>
                </ha-card>
                <style>
                .preview-event-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    overflow: hidden;
                    border-radius: var(--border-radius, 20px);
                    background: var(--ha-card-background, var(--card-background-color, #fff));
                    cursor: pointer;
                }
                .preview-event-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .preview-event-vignette {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 1;
                    background: linear-gradient(
                        to bottom,
                        rgba(0,0,0,0.55) 0%,
                        rgba(0,0,0,0.00) 30%,
                        rgba(0,0,0,0.00) 70%,
                        rgba(0,0,0,0.55) 100%
                    );
                    border-radius: var(--border-radius, 20px);
                }
                .preview-icon-container {
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    z-index: 2;
                }
                .preview-event-title {
                    position: absolute;
                    left: 44px;
                    top: 14px;
                    color: #fff;
                    font-size: 1em;
                    font-weight: 500;
                    z-index: 2;
                    max-width: 80%;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .preview-event-details {
                    position: absolute;
                    left: 12px;
                    bottom: 12px;
                    color: #fff;
                    font-size: 1em;
                    font-weight: 500;
                    z-index: 2;
                    max-width: 80%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            </style>
            `;
            this.content = this.querySelector('div.preview-card-content');
        }

        const calendarEntity = hass.states[this.entity];

        if (!calendarEntity) {
            console.error('Calendar entity not found:', this.entity);
            return;
        }

        const events = (calendarEntity.attributes.events || []).slice()
        const summaries = (calendarEntity.attributes.summaries || []).slice()
        const keyFrames = (calendarEntity.attributes.key_frames || []).slice()
        const cameraNames = (calendarEntity.attributes.camera_names || []).slice()
        const startTimes = (calendarEntity.attributes.starts || []).slice()

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
                            <div class="preview-event-container" style="display: flex; justify-content: center; align-items: center; height: 100%;">
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
                            <div class="preview-event-container" style="display: flex; justify-content: center; align-items: center; height: 100%;">
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

        // Only show the latest event (most recent)
        const latestEvent = eventDetails[0];
        if (!latestEvent) {
            this.content.innerHTML = '';
            const noEventsContainer = document.createElement('div');
            const noEventsMessage = translate('noEvents', this.language) || "No events found.";
            noEventsContainer.innerHTML = `
                <div class="preview-event-container" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    <h3>${noEventsMessage}</h3>
                </div>
            `;
            this.content.appendChild(noEventsContainer);
            return;
        }

        const { event, summary, startTime, cameraName } = latestEvent;
        const date = new Date(startTime);
        const options = { month: 'short', day: 'numeric' };
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        let formattedDate;
        if (date.toDateString() === today.toDateString()) {
            formattedDate = translate('today', this.language) || "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            formattedDate = translate('yesterday', this.language) || "Yesterday";
        } else {
            formattedDate = date.toLocaleDateString('en-US', options);
        }
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${formattedDate}, ${hours}:${minutes}`;
        let keyFrame = latestEvent.keyFrame;
        const { icon, color: defaultColor, category } = getIcon(event, this.language);

        keyFrame = keyFrame.replace('/config/www/', '/local/');

        const eventContainer = document.createElement('div');
        eventContainer.classList.add('preview-event-container');
        eventContainer.innerHTML = `
            <img class="preview-event-image" src="${keyFrame}" alt="Key frame" onerror="this.style.display='none'">
            <div class="preview-event-vignette"></div>
            <div class="preview-icon-container">
                <ha-icon icon="${icon}" style="color: white; font-size: 24px;"></ha-icon>
            </div>
            <div class="preview-event-details">${cameraName} • ${formattedTime}</div>
            <div class="preview-event-title">${event}</div>
        `;

        eventContainer.addEventListener('click', () => {
            this.showPopup(event, summary, startTime, keyFrame, cameraName, icon);
        });

        this.content.innerHTML = '';
        this.content.appendChild(eventContainer);

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
            <div class="preview-popup-overlay">
                <div class="preview-popup-content">
                    ${eventDetails}
                </div>
            </div>
            <style>
                .preview-popup-overlay {
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
                .preview-popup-overlay.show {
                    opacity: 1;
                }
                .preview-popup-content {
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
                .preview-popup-overlay.show .preview-popup-content {
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
                .preview-popup-content img {
                    width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin-top: 10px;
                }
                .preview-popup-content .secondary {
                    font-weight: bold;
                    color: var(--secondary-text-color);
                }
                .preview-popup-content .summary {
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
                    .preview-popup-content {
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

        popup.querySelector('.preview-popup-overlay').addEventListener('click', (event) => {
            if (event.target === popup.querySelector('.preview-popup-overlay')) {
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
            popup.querySelector('.preview-popup-overlay').classList.add('show');
        });
    }

    closePopup(popup, popstateHandler) {
        // Remove the show class to trigger the closing animation
        popup.querySelector('.preview-popup-overlay').classList.remove('show');
        popup.querySelector('.preview-popup-overlay').addEventListener('transitionend', () => {
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