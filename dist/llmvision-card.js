import { getIcon, translate } from './helpers.js?v=1.6.0';
import { labels } from './labels.js?v=1.6.0';
import { LitElement, css, html } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
import { BaseLLMVisionCard } from './card-base.js?v=1.6.0';
import { LLMVisionPreviewCard } from './llmvision-preview-card.js?v=1.6.0';

class TimelineCardEditor extends LitElement {
    static get properties() { return { _config: { type: Object } }; }
    setConfig(config) { this._config = config || {}; }
    render() {
        if (!this._config) return html`<div>Please configure the card.</div>`;
        const generalSchema = this._getSchema().slice(0, 3);
        const filterSchema = this._getSchema().slice(3, 5);
        const languageSchema = this._getSchema().slice(5, 6);
        const customizeSchema = this._getSchema().slice(6);
        return html`
            <style>
                .card-content{display:flex;flex-direction:column;gap:16px;}
                details{border:1px solid var(--divider-color,#eee);border-radius:var(--ha-card-border-radius,20px);overflow:hidden;}
                summary{font-weight:500;font-size:1rem;padding:12px 16px;cursor:pointer;display:flex;align-items:center;}
                summary::-webkit-details-marker{display:none;}
                summary:before{content:'';display:inline-block;margin-right:8px;border-style:solid;border-width:0.35em 0.35em 0 0.35em;border-color:var(--primary-text-color) transparent transparent transparent;transform:rotate(-90deg);transition:transform .2s;}
                details[open] summary:before{transform:rotate(0);}
                .section-content{padding:16px;}
                .section-icon{margin-right:8px;color:var(--primary-text-color);font-size:20px;}
            </style>
            <ha-card>
                <div class="card-content">
                    <details open>
                        <summary><ha-icon class="section-icon" icon="mdi:cog"></ha-icon>General</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${generalSchema}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:filter-variant"></ha-icon>Filters</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${filterSchema}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:translate"></ha-icon>Language</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${languageSchema}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:palette"></ha-icon>Customization</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${customizeSchema}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                </div>
            </ha-card>
        `;
    }
    _getSchema() {
        const generalSchema = [
            { name: "header", description: "Header text for the card.", selector: { text: {} } },
            { name: "number_of_events", description: "Number of most recent events to display. A maximum of 10 events can be displayed.", selector: { number: { min: 1, max: 100, step: 1 } } },
            { name: "number_of_days", description: "Number of days to look back for events. Useful for filtering older events.", selector: { number: { min: 1, max: 365, step: 1 } } },
        ];
        const filterSchema = [
            {
                name: "category_filters", description: "Filter events by category (title). Only events matching selected categories will be shown.",
                selector: { select: { multiple: true, options: Object.keys(labels).map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })) } }
            },
            {
                name: "camera_filters", description: "Filter events by camera entity. Only events from selected cameras will be shown.",
                selector: {
                    select: {
                        multiple: true, options: Object.keys(this.hass.states)
                            .filter(e => e.startsWith('camera.'))
                            .map(e => ({ value: e, label: this.hass.states[e].attributes.friendly_name || e }))
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
                            { value: "bg", label: "Bulgarian" },
                            { value: "ca", label: "Catalan" },
                            { value: "cz", label: "Czech" },
                            { value: "nl", label: "Dutch" },
                            { value: "en", label: "English" },
                            { value: "fr", label: "French" },
                            { value: "de", label: "German" },
                            { value: "hu", label: "Hungarian" },
                            { value: "it", label: "Italian" },
                            { value: "pl", label: "Polish" },
                            { value: "pt", label: "Portuguese" },
                            { value: "sk", label: "Slovak" },
                            { value: "es", label: "Spanish" },
                            { value: "sv", label: "Swedish" }
                        ]
                    }
                }
            }
        ];
        const customizeSchema = [
            { name: "default_icon", description: "Icon when no category keyword matches.", selector: { icon: {} } },
            { name: "default_color", description: "Color for uncategorized events.", selector: { color_rgb: {} } },
        ].concat(Object.keys(labels).map(c => ({
            name: `custom_colors.${c}`,
            description: `Color for ${c.charAt(0).toUpperCase() + c.slice(1)}`,
            selector: { color_rgb: {} }
        })));
        return [...generalSchema, ...filterSchema, ...languageSchema, ...customizeSchema];
    }
    _computeLabel(s) {
        return ({
            header: "Header", entity: "Calendar Entity", number_of_events: "Number of Events",
            number_of_days: "Number of Days", category_filters: "Category Filters",
            camera_filters: "Camera Filters", custom_colors: "Custom Colors", language: "Language",
            default_icon: "Default Icon", default_color: "Default Color"
        })[s.name] || s.name;
    }
    _computeHelper = s => s.description || "";
    _valueChanged(e) {
        let newConfig = e.detail.value;
        let customColors = { ...(this._config.custom_colors || {}) };
        for (const k of Object.keys(newConfig)) {
            if (k.startsWith('custom_colors.')) {
                const cat = k.split('.')[1];
                customColors[cat] = newConfig[k];
                delete newConfig[k];
            }
        }
        if (Object.keys(customColors).length) newConfig.custom_colors = customColors;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
    }
    static get styles() { return css`ha-card{padding:16px;}`; }
}
customElements.define("timeline-card-editor", TimelineCardEditor);

class LLMVisionCard extends BaseLLMVisionCard {
    setConfig(config) {
        this.header = config.header || '';
        this.setCommonConfig(config, { requireEventLimits: true });
    }
    static getConfigElement() { return document.createElement('timeline-card-editor'); }
    static getStubConfig() { return { number_of_days: 7, number_of_events: 3, language: 'en' }; }

    getCardSize() {
        return 3;
    }

    // The rules for sizing your card in the grid in sections view
    getGridOptions() {
        return {
            rows: 5,
            columns: 9,
            min_rows: 2,
            max_rows: 8,
            min_columns: 9,
            max_columns: 24
        };
    }

    set hass(hass) {
        if (!this.content) {
            // Adhere to the grid cell allocated to the card
            this.style.display = 'block';
            this.style.height = '100%';

            this.innerHTML = `
                <ha-card style="padding:16px;">
                    ${this.header !== "" ? `<div class="card-header" style="font-size:1.3em;font-weight:600;padding:0 0 5px 0;">${this.header || "LLM Vision Events"}</div>` : ""}
                    <div class="card-content"></div>
                </ha-card>
                <style>
                    /* Stretch the card to the allocated grid cell */
                    ha-card{height:100%;display:flex;flex-direction:column;box-sizing:border-box;}

                    /* The scrollable content area inside the card */
                    .card-content{padding:0;flex:1 1 auto;min-height:0;overflow:auto;}

                    .event-container{display:flex;align-items:center;justify-content:flex-start;height:75px;cursor:pointer;margin-bottom:8px;}
                    .event-container:last-child{margin-bottom:0;}
                    .event-container img{height:100%;aspect-ratio:1/1;margin-left:auto;border-radius:12px;object-fit:cover;}
                    .event-container h3{font-weight:var(--ha-font-weight-medium,500);font-size:var(--ha-font-size-m,14px);margin:0;flex-grow:1;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
                    .event-container p{font-weight:var(--ha-font-weight-normal,400);font-size:var(--ha-font-size-s,12px);margin:0;flex-grow:1;color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
                    .date-header h2{font-weight:var(--ha-font-weight-medium,500);font-size:var(--ha-font-size-l,16px);margin:0;color:var(--primary-text-color);overflow:hidden;text-overflow:ellipsis;}
                    .icon-container{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:10px;flex-shrink:0;}
                    .event-details{flex-grow:1;min-width:0;}
                </style>
            `;
            this.content = this.querySelector('.card-content');
        } else {
            const headerDiv = this.querySelector('.card-header');
            if (headerDiv) {
                if (this.header === "") headerDiv.style.display = "none";
                else { headerDiv.style.display = ""; headerDiv.textContent = this.header; }
            }
        }

        this._loadAndRender(hass);
    }


    async _loadAndRender(hass) {
        let details = await this.fetchEvents(
            hass,
            this.number_of_events,
            this.number_of_days,
            this.camera_filters,
            this.category_filters);
        if (!details) return;

        const currentHash = this._hashState({
            ...details,
            category_filters: this.category_filters,
            camera_filters: this.camera_filters,
            number_of_events: this.number_of_events,
            number_of_days: this.number_of_days
        });
        if (currentHash === this._lastEventHash) return;
        this._lastEventHash = currentHash;

        if (!details.length) {
            this.content.innerHTML = '';
            let key;
            if (this.category_filters.length) key = 'noEventsCategory';
            else if (this.camera_filters.length) key = 'noEventsCamera';
            else if (this.number_of_days) key = 'noEventsHours';
            else key = 'noEvents';
            let msg = translate(key, this.language) || "No events found.";
            if (key === 'noEventsHours') msg = msg.replace('{hours}', this.number_of_days);
            this.content.innerHTML = `<div class="event-container" style="display:flex;align-items:center;justify-content:center;height:100%;"><h3>${msg}</h3></div>`;
            return;
        }
        this._render(details, hass);
    }

    _render(details, hass) {
        this.content.innerHTML = '';
        let lastDate = '';
        details.forEach((d, idx) => {
            const dateObj = new Date(d.startTime);
            const dateLabel = this.formatDateLabel(dateObj);
            const timeStr = this.formatTime(dateObj);
            if (dateLabel !== lastDate) {
                const header = document.createElement('div');
                header.classList.add('date-header');
                header.innerHTML = `<h2>${dateLabel}</h2>`;
                this.content.appendChild(header);
                lastDate = dateLabel;
            }
            const result = getIcon(d.category, d.label);
            let { icon, color: defaultColor } = result;
            if ((d.category === undefined || d.category === '') && this.default_icon) {
                icon = this.default_icon;
            }
            const colorsComputed = this.computeColors(d.category, defaultColor);
            const container = document.createElement('div');
            container.classList.add('event-container');
            container.innerHTML = `
                <div class="icon-container" style="background-color:${colorsComputed.bgColorRgba};">
                    <ha-icon icon="${icon}" style="color:${colorsComputed.iconColorRgba};"></ha-icon>
                </div>
                <div class="event-details">
                    <h3>${d.title}</h3>
                    <p>${d.cameraName ? `${timeStr} • ${d.cameraName}` : timeStr}</p>
                </div>
                <img alt="Key frame ${idx + 1}" style="display:none;" onerror="this.style.display='none'">
            `;
            const imgEl = container.querySelector('img');
            container.addEventListener('click', () => {
                this.resolveKeyFrame(hass, d.keyFrame).then(url => {
                    this.showPopup({
                        event: d.title,
                        summary: d.description,
                        startTime: d.startTime,
                        keyFrame: url,
                        cameraName: d.cameraName,
                        category: d.category,
                        label: d.label,
                        icon: icon,
                        prefix: 'popup',
                        eventId: d.id
                    }, hass);
                });
            });
            this.content.appendChild(container);
            this.resolveKeyFrame(hass, d.keyFrame).then(url => {
                if (!url) return;
                imgEl.src = url;
                imgEl.style.display = '';
            });
        });
    }

    static getStubConfig() {
        return { number_of_days: 24, number_of_events: 5, language: 'en' };
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
window.customCards.push({
    type: "llmvision-preview-card",
    name: "LLM Vision Preview Card",
    description: "Preview the latest LLM Vision event",
    preview: true,
    getConfigElement: LLMVisionPreviewCard.getConfigElement,
    getConfigElementStub: LLMVisionPreviewCard.getConfigElementStub,
});
