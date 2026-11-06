import { getIcon, translate, toIsoDate } from './helpers.js';
import { labels } from './labels.js';
import { LitElement, css, html } from "lit";
import { BaseLLMVisionCard } from './card-base.js';
import { LLMVisionPreviewCard } from './llmvision-preview-card.js';

class TimelineCardEditor extends LitElement {
    static get properties() { return { _config: { type: Object } }; }
    setConfig(config) { this._config = config || {}; }
    render() {
        if (!this._config) return html`<div>Please configure the card.</div>`;
        const schema = this._getSchema();
        const generalSchema = schema.slice(0, 5);
        const filterSchema = schema.slice(5, 8);
        const localeSchema = schema.slice(8, 10);
        const customizeSchema = schema.slice(10);
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
                        <summary><ha-icon class="section-icon" icon="mdi:translate"></ha-icon>Locale</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${localeSchema}
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
            {
                name: "day_navigation",
                description: "Show one day at a time with arrows and a date picker in the card header. Starts on today.",
                selector: { boolean: {} }
            },
            {
                name: "date_entity",
                description: "Optional. Bind the shown day to a date entity or date-only input_datetime, so the selection persists and can be set from automations. Works with or without day_navigation.",
                selector: { entity: { filter: [{ domain: "input_datetime" }, { domain: "date" }] } }
            },
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
            },
            {
                name: "filter_false_positives",
                description: "Hide events titled 'No activity observed'.",
                selector: { boolean: { default: true } }
            }
        ];
        const localeSchema = [
            {
                name: "language",
                description: "Language for the card. This will be used to generate icons and translations.",
                selector: {
                    select: {
                        options: [
                            { value: "bg", label: "Bulgarian" },
                            { value: "ca", label: "Catalan" },
                            { value: "cz", label: "Czech" },
                            { value: "da", label: "Danish" },
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
            },
            {
                name: "time_format",
                description: "Choose between 12-hour and 24-hour time display.",
                selector: {
                    select: {
                        options: [
                            { value: "24h", label: "24-hour" },
                            { value: "12h", label: "12-hour" }
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
        return [...generalSchema, ...filterSchema, ...localeSchema, ...customizeSchema];
    }
    _computeLabel(s) {
        return ({
            header: "Header", number_of_events: "Number of Events",
            number_of_days: "Number of Days", day_navigation: "Day Navigation",
            date_entity: "Date Entity (optional)",
            category_filters: "Category Filters",
            camera_filters: "Camera Filters", filter_false_positives: "Filter False Positives",
            custom_colors: "Custom Colors", language: "Language",
            time_format: "Time Format",
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
        // Day navigation starts on today unless an entity drives the selection.
        if (this.day_navigation && !this.date_entity && !this._selectedDay) {
            this._selectedDay = toIsoDate(new Date());
        }
    }

    /** Move the selection by whole days. */
    _shiftDay(offsetDays) {
        const current = this.currentDay(this._hass) || toIsoDate(new Date());
        const date = new Date(`${current}T00:00:00`);
        date.setDate(date.getDate() + offsetDays);
        this._setDay(toIsoDate(date));
    }

    _setDay(isoDate) {
        if (this.date_entity) {
            // Write back to the entity so the selection is shared and persisted.
            // input_datetime and date use different service names for the same thing.
            const domain = this.date_entity.split('.')[0];
            const service = domain === 'input_datetime' ? 'set_datetime' : 'set_value';
            this._hass?.callService(domain, service, {
                entity_id: this.date_entity,
                date: isoDate,
            });
            return;
        }
        this._selectedDay = isoDate;
        if (this._hass) {
            this._renderDayNav();
            this._loadAndRender(this._hass);
        }
    }

    /** Human label for the selected day, reusing the existing translations. */
    _dayLabel(isoDate) {
        if (!isoDate) return '';
        const date = new Date(`${isoDate}T00:00:00`);
        const todayIso = toIsoDate(new Date());
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (isoDate === todayIso) return translate('today', this.language) || 'Today';
        if (isoDate === toIsoDate(yesterday)) return translate('yesterday', this.language) || 'Yesterday';
        return date.toLocaleDateString(undefined, {
            weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }

    _renderDayNav() {
        const nav = this.querySelector('.day-nav');
        if (!nav) return;
        const day = this.currentDay(this._hass);
        const label = nav.querySelector('.day-nav-label');
        const picker = nav.querySelector('.day-nav-picker');
        if (label) label.textContent = this._dayLabel(day);
        if (picker) {
            picker.max = toIsoDate(new Date());
            if (day && picker.value !== day) picker.value = day;
        }
        // Nothing to navigate forward to beyond today. toggleAttribute so the
        // attribute selector in CSS matches as well as the element state.
        nav.querySelector('.day-nav-next')
            ?.toggleAttribute('disabled', !day || day >= toIsoDate(new Date()));
    }

    _wireDayNav() {
        const nav = this.querySelector('.day-nav');
        if (!nav || nav.dataset.wired) return;
        nav.dataset.wired = '1';

        nav.querySelector('.day-nav-prev')?.addEventListener('click', () => this._shiftDay(-1));
        nav.querySelector('.day-nav-next')?.addEventListener('click', () => this._shiftDay(1));

        const picker = nav.querySelector('.day-nav-picker');
        // The label is the visible control; it opens the native date picker so
        // there is no custom calendar to maintain and mobile gets its own UI.
        nav.querySelector('.day-nav-current')?.addEventListener('click', () => {
            if (!picker) return;
            if (typeof picker.showPicker === 'function') picker.showPicker();
            else picker.click();
        });
        picker?.addEventListener('change', () => {
            if (picker.value) this._setDay(picker.value);
        });
    }
    static getConfigElement() { return document.createElement('timeline-card-editor'); }
    static getStubConfig() { return { number_of_days: 7, number_of_events: 3, language: 'en', time_format: '24h', filter_false_positives: true }; }

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
            this.style.width = '100%';
            this.style.maxWidth = '100%';
            this.style.boxSizing = 'border-box';

            this.innerHTML = `
                <ha-card style="padding:16px;">
                    ${this.header !== "" ? `<div class="card-header" style="font-size:1.3em;font-weight:600;padding:0 0 5px 0;">${this.header || "LLM Vision Events"}</div>` : ""}
                    ${this.day_navigation ? `
                    <div class="day-nav">
                        <button class="day-nav-btn day-nav-prev" type="button" aria-label="Previous day">
                            <ha-icon icon="mdi:chevron-left"></ha-icon>
                        </button>
                        <button class="day-nav-current" type="button">
                            <ha-icon icon="mdi:calendar"></ha-icon>
                            <span class="day-nav-label"></span>
                            <input class="day-nav-picker" type="date" tabindex="-1" aria-hidden="true">
                        </button>
                        <button class="day-nav-btn day-nav-next" type="button" aria-label="Next day">
                            <ha-icon icon="mdi:chevron-right"></ha-icon>
                        </button>
                    </div>` : ""}
                    <div class="card-content"></div>
                </ha-card>
                <style>
                    /* Stretch the card to the allocated grid cell */
                    :host{display:block;width:100%;max-width:100%;box-sizing:border-box;}
                    ha-card{height:100%;width:100%;max-width:100%;margin:0;display:flex;flex-direction:column;box-sizing:border-box;overflow:hidden;}

                    /* Day navigation */
                    .day-nav{display:flex;align-items:center;justify-content:space-between;gap:4px;padding:0 0 8px 0;flex:0 0 auto;}
                    .day-nav-current{position:relative;flex:1 1 auto;display:flex;align-items:center;justify-content:center;gap:8px;background:none;border:none;cursor:pointer;padding:6px 8px;border-radius:12px;font-family:inherit;font-size:var(--ha-font-size-m,14px);font-weight:var(--ha-font-weight-medium,500);color:var(--primary-text-color);min-width:0;}
                    .day-nav-current:hover{background:var(--secondary-background-color,rgba(127,127,127,.12));}
                    .day-nav-current ha-icon{color:var(--secondary-text-color);--mdc-icon-size:18px;flex-shrink:0;}
                    .day-nav-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
                    /* The native input is the picker only; the button is the visible control. */
                    .day-nav-picker{position:absolute;left:50%;bottom:0;width:1px;height:1px;opacity:0;border:none;padding:0;pointer-events:none;}
                    .day-nav-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:none;border:none;cursor:pointer;color:var(--secondary-text-color);flex-shrink:0;padding:0;}
                    .day-nav-btn:hover{background:var(--secondary-background-color,rgba(127,127,127,.12));}
                    .day-nav-btn[disabled]{opacity:.35;pointer-events:none;}

                    /* The scrollable content area inside the card */
                    .card-content{padding:0;flex:1 1 auto;min-height:0;min-width:0;overflow:auto;overflow-x:hidden;}

                    .event-container{display:flex;align-items:center;justify-content:flex-start;height:75px;cursor:pointer;margin-bottom:8px;min-width:0;overflow:hidden;}
                    .event-container.empty-state{height:100%;justify-content:center;align-items:center;text-align:center;cursor:default;margin-bottom:0;}
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
            this._wireDayNav();
        } else {
            const headerDiv = this.querySelector('.card-header');
            if (headerDiv) {
                if (this.header === "") headerDiv.style.display = "none";
                else { headerDiv.style.display = ""; headerDiv.textContent = this.header; }
            }
        }

        this._hass = hass;
        this._renderDayNav();
        this._loadAndRender(hass);
    }


    async _loadAndRender(hass) {
        // With day navigation or a date_entity, query that exact calendar day
        // instead of the rolling number_of_days window.
        const dateWindow = this.dayWindowFrom(this.currentDay(hass));

        let details = await this.fetchEvents(
            hass,
            {
                limit: this.number_of_events,
                days: dateWindow ? null : this.number_of_days,
                start: dateWindow?.start || null,
                end: dateWindow?.end || null,
                cameras: this.camera_filters,
                categories: this.category_filters,
                includeNoActivity: !this.filter_false_positives
            }
        );
        if (!details) return;

        const currentHash = this._hashState({
            ...details,
            category_filters: this.category_filters,
            camera_filters: this.camera_filters,
            number_of_events: this.number_of_events,
            number_of_days: this.number_of_days,
            date_window: dateWindow?.start || null,
            time_format: this.time_format,
            filter_false_positives: this.filter_false_positives
        });
        if (currentHash === this._lastEventHash) return;
        this._lastEventHash = currentHash;

        if (!details.length) {
            this.content.innerHTML = '';
            let key;
            if (this.category_filters.length) key = 'noEventsCategory';
            else if (this.camera_filters.length) key = 'noEventsCamera';
            else if (dateWindow) key = 'noEventsDay';
            else if (this.number_of_days) key = 'noEventsHours';
            else key = 'noEvents';
            let msg = translate(key, this.language) || "No events found.";
            if (key === 'noEventsHours') msg = msg.replace('{hours}', this.number_of_days);
            this.content.innerHTML = `<div class="event-container empty-state"><h3>${msg}</h3></div>`;
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
        return { number_of_days: 24, number_of_events: 5, language: 'en', time_format: '24h', filter_false_positives: true };
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
