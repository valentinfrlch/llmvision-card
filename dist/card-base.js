import { translate, hexToRgba } from './helpers.js?v=1.5.2';

const __LLMVISION_VERSION = 'v1.6.0 alpha 1';
function __logLLMVisionBadge(context) {
    if (!window.__LLMVISION_BADGE_LOGGED) {
        console.log(
            '%cLLM Vision Card%c%c' + __LLMVISION_VERSION,
            'background:#0071FF;color:#fff;padding:2px 6px 2px 8px;border-radius:4px 0 0 4px;font-weight:600;',
            'background:#0058c7;color:#fff;padding:2px 4px;font-weight:500;',
            'background:#0058c7;color:#fff;padding:2px 8px 2px 6px;border-radius:0 4px 4px 0;font-weight:600;'
        );
        window.__LLMVISION_BADGE_LOGGED = true;
    }
}

export class BaseLLMVisionCard extends HTMLElement {
    imageCache = new Map();
    _lastEventHash = null;

    connectedCallback() {
        if (!this._badgeLogged) {
            __logLLMVisionBadge(this.badgeContext || 'Card');
            this._badgeLogged = true;
        }
    }

    setCommonConfig(config, { requireEventLimits = false } = {}) {
        this.config = config;
        this.category_filters = config.category_filters || [];
        this.camera_filters = config.camera_filters || [];
        this.language = config.language;
        this.number_of_events = config.number_of_events;
        this.number_of_days = config.number_of_days;
        this.custom_colors = config.custom_colors || {};
        this.default_icon = config.default_icon || 'mdi:motion-sensor';
        this.default_color = config.default_color || '#929292';
        if (requireEventLimits) {
            if (!this.number_of_events && !this.number_of_days) {
                throw new Error('Either number_of_events or number_of_days needs to be set.');
            }
            if (this.number_of_events && this.number_of_events < 1) {
                throw new Error('number_of_events must be greater than 0.');
            }
        }
    }

    async fetchEvents(hass, limit = 10, days = 7, cameras = [], categories = []) {
        try {
            const params = new URLSearchParams();
            // if (this.number_of_days) params.set('hours', this.number_of_days);
            if (limit) params.set('limit', limit);
            if (cameras?.length) {
                params.set('cameras', cameras.join(','));
            }
            if (days) params.set('days', days);
            if (categories?.length) {
                params.set('categories', categories.join(','));
            }

            const path = `llmvision/timeline/events${params.toString() ? '?' + params.toString() : ''}`;
            const data = await hass.callApi('GET', path);
            const items = Array.isArray(data?.events) ? data.events : [];

            return items.map((item) => {
                const cameraEntityId = item.camera_name || '';
                const cameraEntity = cameraEntityId ? hass.states[cameraEntityId] : undefined;
                const cameraFriendlyName = cameraEntity ? (cameraEntity.attributes?.friendly_name || cameraEntityId) : '';
                return {
                    title: item.title || '',
                    description: item.description || '',
                    category: item.category || '',
                    label: item.label || '',
                    keyFrame: (item.key_frame || ''),
                    cameraName: cameraFriendlyName,
                    startTime: item.start || null,
                    endTime: item.end || null,
                    id: item.uid || '',
                };
            });
        } catch (err) {
            console.error('Error fetching events from API:', err);
            return null;
        }
    }

    async deleteEvent(hass, eventId) {
        try {
            await hass.callApi('DELETE', `llmvision/timeline/event/${encodeURIComponent(eventId)}`);
            return true;
        } catch (err) {
            console.error('Error deleting event from API:', err);
            return false;
        }
    }

    _hashState(base) {
        return JSON.stringify(base);
    }

    _filterByHours(details, hours) {
        if (!hours) return details;
        const cutoff = Date.now() - hours * 3600 * 1000;
        return details.filter(d => new Date(d.startTime).getTime() >= cutoff);
    }

    _filterByCategories(details) {
        if (!this.category_filters?.length) return details;
        return details.filter(d => {
            if (!d.category) return false;
            return this.category_filters.includes(d.category);
        });
    }

    _filterByCameras(details) {
        if (!this.camera_filters?.length) return details;
        return details.filter(d => {
            if (!d.cameraEntityId) return true;
            return this.camera_filters.includes(d.cameraEntityId);
        });
    }

    _applyAllFilters(details) {
        let res = details;
        res = this._filterByCategories(res);
        res = this._filterByCameras(res);
        return res;
    }

    _sort(details) {
        return details.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    }

    _limit(details) {
        if (this.number_of_days) {
            // number_of_events acts as secondary limiter only after hours filter
            if (this.number_of_events) return details.slice(0, this.number_of_events);
            return details;
        }
        if (this.number_of_events) return details.slice(0, this.number_of_events);
        return details;
    }

    formatDateLabel(dateObj) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (dateObj.toDateString() === today.toDateString()) return translate('today', this.language) || "Today";
        if (dateObj.toDateString() === yesterday.toDateString()) return translate('yesterday', this.language) || "Yesterday";
        return dateObj.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    }

    formatTime(dateObj) {
        return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
    }

    formatDateTimeShort(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const options = { month: 'short', day: 'numeric' };
        if (date.toDateString() === today.toDateString()) {
            return translate('today', this.language) || "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return translate('yesterday', this.language) || "Yesterday";
        }
        return date.toLocaleDateString('en-US', options);
    }

    formatDateTimeFull(dateStr) {
        const d = new Date(dateStr);
        const options = { month: 'short', day: 'numeric' };
        const datePart = d.toLocaleDateString('en-US', options);
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        return `${datePart}, ${h}:${m}`;
    }

    resolveKeyFrame(hass, keyFrame) {
        if (!keyFrame) return Promise.resolve('');
        if (/^https?:\/\//i.test(keyFrame)) return Promise.resolve(keyFrame);
        const mediaContentID = keyFrame.replace('/media/', 'media-source://media_source/local/');
        if (this.imageCache.has(mediaContentID)) {
            return Promise.resolve(this.imageCache.get(mediaContentID));
        }
        return hass.callWS({
            type: "media_source/resolve_media",
            media_content_id: mediaContentID,
            expires: 60 * 60 * 3
        }).then(result => {
            const url = result.url;
            this.imageCache.set(mediaContentID, url);
            return url;
        }).catch(err => {
            console.error("Error resolving media content ID:", err);
            return keyFrame;
        });
    }

    computeColors(category, defaultColor) {
        const customColors = this.custom_colors || {};
        let color;
        if (category === undefined || category === null) {
            if (this.default_color !== undefined) color = this.default_color;
            else color = defaultColor;
        } else {
            color = (customColors[category] !== undefined) ? customColors[category] : defaultColor;
        }
        let bgColorRgba, iconColorRgba;
        if (Array.isArray(color) && color.length === 3) {
            bgColorRgba = `rgba(${color[0]},${color[1]},${color[2]},0.2)`;
            iconColorRgba = `rgba(${color[0]},${color[1]},${color[2]},1)`;
        } else {
            bgColorRgba = hexToRgba(color, 0.2);
            iconColorRgba = hexToRgba(color, 1);
        }
        return { bgColorRgba, iconColorRgba };
    }

    showPopup({ event, summary, startTime, keyFrame, cameraName, icon, prefix, eventId }, hassArg) {
        console.log('Showing popup for event:', eventId);

        const hass = hassArg || this.hass;
        const formattedTime = this.formatDateTimeFull(startTime);
        const secondaryText = cameraName ? `${formattedTime} • ${cameraName}` : formattedTime;
        const overlayClass = `${prefix}-overlay`;
        const contentClass = `${prefix}-content`;
        const closeBtnClass = `close-${prefix}`;
        // New menu-related classes
        const headerRowClass = `${prefix}-header-row`;
        const titleRowClass = `${prefix}-title-row`;
        const menuWrapperClass = `${prefix}-menu`;
        const menuBtnClass = `${prefix}-menu-btn`;
        const menuListClass = `${prefix}-menu-list`;
        const menuItemClass = `${prefix}-menu-item`;
        const menuDeleteClass = `${prefix}-menu-item-delete`;

        const htmlBlock = `
                <div>
                    <div class="${headerRowClass}">
                        <button class="${closeBtnClass}" title="Close" style="font-size:30px">
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                        <div class="spacer"></div>
                        ${eventId ? `
                        <div class="${menuWrapperClass}">
                            <button class="${menuBtnClass}" title="Menu" style="font-size:26px">
                                <ha-icon icon="mdi:dots-vertical"></ha-icon>
                            </button>
                            <div class="${menuListClass}" hidden>
                                <button class="${menuItemClass} ${menuDeleteClass}" title="Delete event">
                                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                                    <span>${translate('delete', this.language) || 'Delete'}</span>
                                </button>
                            </div>
                        </div>` : ''}
                    </div>
                    <div class="${titleRowClass}">
                        <div class="${prefix}-title-main">
                            <ha-icon icon="${icon}"></ha-icon>
                            <h2>${event}</h2>
                        </div>
                        <div class="${prefix}-title-secondary">
                            <p class="secondary"><span>${secondaryText}</span></p>
                        </div>
                    </div>
                    <img src="${keyFrame}" alt="Event Snapshot" onerror="this.style.display='none'">
                    <p class="summary">${summary}</p>
                </div>
            `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
                <div class="${overlayClass}">
                    <div class="${contentClass}">
                        ${htmlBlock}
                    </div>
                </div>
                <style>
                    .${overlayClass} {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    }
                    .${overlayClass}.show { opacity: 1; }
                    .${contentClass} {
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
                    .${overlayClass}.show .${contentClass} { transform: scale(1); }
    
                    /* Header row: close left, kebab right */
                    .${headerRowClass} {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 4px;
                    }
                    .${headerRowClass} .spacer {
                        flex: 1 1 auto;
                    }
    
                    /* Title row: icon + title */
                    .${titleRowClass} {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 6px;
                    }
                    .${prefix}-title-main {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        justify-content: center;
                    }
                    .${prefix}-title-main h2 {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin: 0;
                        font-family: var(--ha-font-family-heading, "Roboto");
                        text-align: center;
                    }
                    .${prefix}-title-secondary {
                        width: 100%;
                        text-align: center;
                    }
                    .${prefix}-title-secondary .secondary {
                        font-weight: var(--ha-font-weight-medium, 500);
                        margin-top: 4px;
                        color: var(--primary-text-color);
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
    
                    /* Image and text */
                    .${contentClass} img {
                        width: 100%;
                        height: auto;
                        border-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
                        margin-top: 10px;
                    }
                    .${contentClass} .summary {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-l, 16px);
                        line-height: 22px;
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
    
                    /* Buttons */
                    .${closeBtnClass}, .${menuBtnClass} {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--primary-text-color);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
    
                    /* Menu */
                    .${menuWrapperClass} {
                        position: relative;
                    }
                    .${menuListClass} {
                        position: absolute;
                        right: 0;
                        top: calc(100% + 6px);
                        background: var(--ha-card-background, var(--card-background-color, #f3f3f3));
                        color: var(--primary-text-color);
                        border-radius: 10px;
                        box-shadow: 0 6px 18px rgba(0,0,0,0.2);
                        padding: 6px;
                        min-width: 160px;
                        z-index: 10;
                    }
                    .${menuItemClass} {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        background: none;
                        border: none;
                        color: inherit;
                        cursor: pointer;
                        padding: 8px 10px;
                        border-radius: 8px;
                    }
                    .${menuItemClass}:hover {
                        background: rgba(0,0,0,0.06);
                    }
                    .${menuDeleteClass} {
                        color: var(--error-color, #d32f2f);
                    }
    
                    @media (max-width: 768px) {
                        .${contentClass} {
                            max-width: 100%;
                            max-height: 100%;
                            border-radius: 0;
                            height: 100%;
                        }
                    }
                </style>
            `;

        if (!history.state || !history.state.popupOpen) {
            history.pushState({ popupOpen: true }, '');
        }
        const overlayEl = wrapper.querySelector(`.${overlayClass}`);
        const popstateHandler = () => this.closePopup(wrapper, overlayClass, popstateHandler);
        window.addEventListener('popstate', popstateHandler);
        wrapper.querySelector(`.${closeBtnClass}`).addEventListener('click', () =>
            this.closePopup(wrapper, overlayClass, popstateHandler)
        );
        overlayEl.addEventListener('click', (ev) => {
            if (ev.target === overlayEl) this.closePopup(wrapper, overlayClass, popstateHandler);
        });
        const escHandler = (ev) => {
            if (ev.key === 'Escape') this.closePopup(wrapper, overlayClass, popstateHandler, escHandler);
        };
        document.addEventListener('keydown', escHandler);
        wrapper._escHandler = escHandler;

        // Menu toggle and outside-click close
        const menuBtn = wrapper.querySelector(`.${menuBtnClass}`);
        const menuList = wrapper.querySelector(`.${menuListClass}`);
        if (menuBtn && menuList) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuList.hidden = !menuList.hidden;
            });
            wrapper.addEventListener('click', (e) => {
                if (!menuList.hidden && !e.target.closest(`.${menuWrapperClass}`)) {
                    menuList.hidden = true;
                }
            });
        }

        // Wire up Delete inside menu
        const deleteItem = wrapper.querySelector(`.${menuDeleteClass}`);
        if (deleteItem && eventId) {
            deleteItem.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (deleteItem.disabled) return;
                const confirmMsg = translate('confirm_delete_event', this.language) || "Are you sure you want to delete this event?";
                if (!confirm(confirmMsg)) {
                    if (menuList) menuList.hidden = true;
                    return;
                }
                deleteItem.disabled = true;
                const success = await this.deleteEvent(hass, eventId);
                if (success) {
                    this.closePopup(wrapper, overlayClass, popstateHandler, escHandler);
                } else {
                    alert(translate('error_delete_event', this.language) || "Failed to delete the event. Please try again.");
                    deleteItem.disabled = false;
                    if (menuList) menuList.hidden = true;
                }
            });
        }

        document.body.appendChild(wrapper);
        requestAnimationFrame(() => overlayEl.classList.add('show'));
    }

    closePopup(wrapper, overlayClass, popstateHandler, escHandler) {
        const overlay = wrapper.querySelector(`.${overlayClass}`);
        overlay.classList.remove('show');
        overlay.addEventListener('transitionend', () => {
            if (wrapper._escHandler) document.removeEventListener('keydown', wrapper._escHandler);
            document.body.removeChild(wrapper);
        }, { once: true });
        if (history.state && history.state.popupOpen) {
            history.replaceState(null, '');
        }
        window.removeEventListener('popstate', popstateHandler);
    }
}