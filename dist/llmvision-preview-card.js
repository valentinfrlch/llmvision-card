import { getIcon, translate } from './helpers.js?v=1.5.2';
import { colors } from './colors.js?v=1.5.2';
import { LitElement, css, html } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
import { BaseLLMVisionCard } from './card-base.js?v=1.5.2';

export class TimelinePreviewCardEditor extends LitElement {
    static get properties() { return { _config: { type: Object } }; }
    setConfig(config) { this._config = config || {}; }
    render() {
        if (!this._config) return html`<div>Please configure the card.</div>`;
        const generalSchema = this._getSchema().slice(0, 1);
        const filterSchema = this._getSchema().slice(1, 3);
        const languageSchema = this._getSchema().slice(3, 4);
        const customizeSchema = this._getSchema().slice(4);
        return html`
            <style>
                .preview-card-content { display:flex; flex-direction:column; gap:16px; }
                details { border:1px solid var(--divider-color,#eeeeee); border-radius:var(--ha-card-border-radius,20px); overflow:hidden; }
                summary { font-weight:500; font-size:1rem; padding:12px 16px; cursor:pointer; display:flex; align-items:center; }
                summary::-webkit-details-marker{display:none;}
                summary:before{content:'';display:inline-block;margin-right:8px;border-style:solid;border-width:0.35em 0.35em 0 0.35em;border-color:var(--primary-text-color) transparent transparent transparent;transform:rotate(-90deg);transition:transform .2s;}
                details[open] summary:before{transform:rotate(0);}
                .section-content{padding:16px;}
                .section-icon{margin-right:8px;color:var(--primary-text-color);font-size:20px;}
            </style>
            <ha-card>
                <div class="preview-card-content">
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
        const generalSchema = [{
            name: "entity",
            description: "Select the LLM Vision timeline entity to display.",
            selector: {
                select: {
                    mode: "dropdown",
                    options: Object.keys(this.hass.states)
                        .filter(e => e.startsWith('calendar.'))
                        .map(e => ({ value: e, label: this.hass.states[e].attributes.friendly_name || e }))
                }
            }
        }];
        const filterSchema = [
            {
                name: "category_filters",
                description: "Filter events by category (title). Only events matching selected categories will be shown.",
                selector: { select: { multiple: true, options: Object.keys(colors.categories).map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })) } }
            },
            {
                name: "camera_filters",
                description: "Filter events by camera entity. Only events from selected cameras will be shown.",
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
            { name: "default_icon", description: "Icon when no category keyword matches.", selector: { icon: {} } }]
        return [...generalSchema, ...filterSchema, ...languageSchema, ...customizeSchema];
    }
    _computeLabel(s) {
        return ({
            entity: "Calendar Entity", category_filters: "Category Filters",
            camera_filters: "Camera Filters", language: "Language",
        })[s.name] || s.name;
    }
    _computeHelper = s => s.description || "";
    _valueChanged(e) { this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: e.detail.value } })); }
    static get styles() { return css`ha-card{padding:16px;}`; }
}
customElements.define("timeline-preview-card-editor", TimelinePreviewCardEditor);

export class LLMVisionPreviewCard extends BaseLLMVisionCard {
    setConfig(config) { this.setCommonConfig(config, { requireEventLimits: false }); }
    static getConfigElement() { return document.createElement('timeline-preview-card-editor'); }
    static getStubConfig() { return { entity: 'calendar.llm_vision_timeline', language: 'en' }; }

    getCardSize() {
        return 3;
    }

    // The rules for sizing your card in the grid in sections view
    getGridOptions() {
        return {
            rows: 2,
            columns: 6,
            min_rows: 2,
            max_rows: 8,
            min_columns: 6,
            max_columns: 24
        };
    }

    set hass(hass) {
        if (!this.content) {
            // Adhere to the grid cell allocated to the card
            this.style.display = 'block';
            this.style.height = '100%';
            this.innerHTML = `
                <ha-card><div class="preview-card-content"></div></ha-card>
                <style>
                .preview-event-container{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:var(--ha-card-border-radius,12px);background:var(--ha-card-background,var(--card-background-color,#f3f3f3));cursor:pointer;}
                .preview-event-image{position:absolute;inset:0;width:100%;height:100%;border-radius:var(--ha-card-border-radius,12px);object-fit:cover;display:block;}
                .preview-event-vignette{position:absolute;inset:0;pointer-events:none;z-index:1;background:linear-gradient(to bottom,rgba(0,0,0,0.55)0%,rgba(0,0,0,0)30%,rgba(0,0,0,0)70%,rgba(0,0,0,0.55)100%);border-radius:var(--ha-card-border-radius,12px);}
                .preview-icon-container{position:absolute;top:3px;left:3px;width:40px;height:40px;border-radius:var(--ha-card-border-radius,25px);display:flex;align-items:center;justify-content:center;background:none;z-index:2;}
                .preview-event-title{position:absolute;left:44px;top:14px;color:#fff;font-size:var(--ha-font-size-l,16px);font-weight:var(--ha-font-weight-medium,500);z-index:2;max-width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
                .preview-event-details{position:absolute;left:12px;bottom:12px;color:rgba(255,255,255,0.9);font-size:var(--ha-font-size-m,14px);font-weight:var(--ha-font-weight-medium,500);z-index:2;max-width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
                </style>
            `;
            this.content = this.querySelector('.preview-card-content');
        }

        this._loadAndRender(hass);
    }

    async _loadAndRender(hass) {
        let details = await this.fetchEvents(
            hass,
            1,
            this.number_of_days,
            this.camera_filters,
            this.category_filters
        );
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
        let event = details[0];
        const container = document.createElement('div');
        const result = getIcon(event.title, this.language);
        let { icon, color: defaultColor, category } = result;
        let cameraName = event.cameraName;
        const dateObj = new Date(event.startTime);
        const dateLabel = this.formatDateLabel(dateObj);
        const timeStr = this.formatTime(dateObj);
        container.innerHTML = `
                <img class="preview-event-image" src="" alt="Key frame" onerror="this.style.display='none'">
                <div class="preview-event-vignette"></div>
                <div class="preview-icon-container">
                    <ha-icon icon="${icon}" style="color:white;font-size:24px;"></ha-icon>
                </div>
                <div class="preview-event-details">${cameraName} • ${dateLabel}, ${timeStr}</div>
                <div class="preview-event-title">${event.title}</div>
            `;
        container.addEventListener('click', () => {
            this.resolveKeyFrame(hass, event.keyFrame).then(url => {
                this.showPopup({
                    event: event.title,
                    summary: event.description,
                    startTime: event.startTime,
                    keyFrame: url,
                    cameraName: event.cameraName,
                    icon,
                    prefix: 'popup',
                    eventId: event.id
                }, hass);
            });
        });
        this.content.innerHTML = '';
        this.content.appendChild(container);
        this.resolveKeyFrame(hass, event.keyFrame).then(url => {
            const img = container.querySelector('img');
            if (img) {
                img.src = url;
                img.style.display = 'block';
            }
        });
    }

    static getStubConfig() {
        return { language: 'en' };
    }
}
customElements.define("llmvision-preview-card", LLMVisionPreviewCard);