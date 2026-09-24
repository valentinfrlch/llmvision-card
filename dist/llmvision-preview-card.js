import{_ as e,c as t,f as n,h as r,i,l as a,m as o,n as s,o as c,p as l,t as u,u as d}from"./assets/lit-BQm0iHU8.js";var f,p=e((()=>{f=`1.7.2`}));function m(e){window.__LLMVISION_BADGE_LOGGED||(console.log(`%cLLM Vision Card%c v${f}`,`background:#0071FF;color:#fff;padding:2px 6px 2px 8px;border-radius:4px 0 0 4px;font-weight:600;`,`background:#0058c7;color:#fff;padding:2px 4px;font-weight:500;`,`background:#0058c7;color:#fff;padding:2px 8px 2px 6px;border-radius:0 4px 4px 0;font-weight:600;`),window.__LLMVISION_BADGE_LOGGED=!0)}var h,g=e((()=>{p(),d(),h=class extends HTMLElement{imageCache=new Map;_lastEventHash=null;_lastFetch=0;_fetchPromise=null;_cachedEvents=null;connectedCallback(){this._badgeLogged||=(m(this.badgeContext||`Card`),!0)}setCommonConfig(e,{requireEventLimits:t=!1}={}){if(this.config=e,this.category_filters=e.category_filters||[],this.camera_filters=e.camera_filters||[],this.language=e.language,this.number_of_events=e.number_of_events,this.number_of_days=e.number_of_days,this.date_entity=e.date_entity||null,this.day_navigation=e.day_navigation===!0,this.custom_colors=e.custom_colors||{},this.default_icon=e.default_icon||`mdi:motion-sensor`,this.default_color=e.default_color||`#929292`,this.time_format=e.time_format||`24h`,this.filter_false_positives=e.filter_false_positives!==!1,this.refresh_interval=Math.max(1,Number(e.refresh_interval||15)),t){if(!this.number_of_events&&!this.number_of_days&&!this.date_entity&&!this.day_navigation)throw Error(`Either number_of_events, number_of_days, date_entity or day_navigation needs to be set.`);if(this.number_of_events&&this.number_of_events<1)throw Error(`number_of_events must be greater than 0.`)}}currentDay(e){if(this.date_entity){let t=e?.states?.[this.date_entity]?.state;return!t||t===`unknown`||t===`unavailable`?null:String(t).slice(0,10)}return this.day_navigation&&this._selectedDay||null}dayWindowFrom(e){if(!e||e===`unknown`||e===`unavailable`)return null;let[t,r,i]=String(e).slice(0,10).split(`-`).map(Number);return!t||!r||!i?null:{start:n(new Date(t,r-1,i)),end:n(new Date(t,r-1,i+1))}}async fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,start:i=null,end:a=null,cameras:o=[],categories:s=[],includeNoActivity:c=!1}={}){let l=Date.now(),u=(this.refresh_interval||15)*1e3,d=`${i||``}|${a||``}`;if(this._fetchPromise&&d===this._fetchPromiseKey)return this._fetchPromise;if(d!==this._lastWindowKey)this._lastWindowKey=d,this._cachedEvents=null;else if(this._cachedEvents&&l-this._lastFetch<u)return this._cachedEvents;this._lastFetch=l,this._fetchPromiseKey=d,this._fetchPromise=this._fetchEvents(e,{limit:t,days:n,hours:r,start:i,end:a,cameras:o,categories:s,includeNoActivity:c});try{return this._cachedEvents=await this._fetchPromise,this._cachedEvents}finally{this._fetchPromise=null}}async _fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,start:i=null,end:a=null,cameras:o=[],categories:s=[],includeNoActivity:c=!1}={}){try{let l=new URLSearchParams;t&&l.set(`limit`,t),o?.length&&l.set(`cameras`,o.join(`,`)),i&&a?(l.set(`start`,i),l.set(`end`,a)):(n&&l.set(`days`,n),r&&l.set(`hours`,r)),s?.length&&l.set(`categories`,s.join(`,`)),l.set(`include_no_activity`,c?`true`:`false`);let u=`llmvision/timeline/events${l.toString()?`?`+l.toString():``}`,d=await e.callApi(`GET`,u);return(Array.isArray(d?.events)?d.events:[]).map(t=>{let n=t.camera_name||``,r=n?e.states[n]:void 0,i=r?r.attributes?.friendly_name||n:``;return{title:t.title||``,description:t.description||``,category:t.category||``,label:t.label||``,keyFrame:t.key_frame||``,cameraName:i,startTime:t.start||null,endTime:t.end||null,id:t.uid||``}})}catch(e){return console.error(`Error fetching events from API:`,e),null}}async deleteEvent(e,t){try{return await e.callApi(`DELETE`,`llmvision/timeline/event/${encodeURIComponent(t)}`),!0}catch(e){return console.error(`Error deleting event from API:`,e),!1}}_hashState(e){return JSON.stringify(e)}_sort(e){return e.sort((e,t)=>new Date(t.startTime)-new Date(e.startTime))}_limit(e){return this.number_of_days||this.date_entity||this.day_navigation,this.number_of_events?e.slice(0,this.number_of_events):e}formatDateLabel(e){let t=new Date,n=new Date(t);return n.setDate(t.getDate()-1),e.toDateString()===t.toDateString()?l(`today`,this.language)||`Today`:e.toDateString()===n.toDateString()?l(`yesterday`,this.language)||`Yesterday`:e.toLocaleDateString(`en`,{month:`short`,day:`numeric`})}formatTime(e){let t=this.time_format||`24h`,n=e.getMinutes().toString().padStart(2,`0`);if(t===`12h`){let t=e.getHours(),r=t%12||12,i=t>=12?`PM`:`AM`;return`${r.toString().padStart(2,`0`)}:${n} ${i}`}return`${e.getHours().toString().padStart(2,`0`)}:${n}`}formatDateTimeShort(e){let t=new Date(e),n=new Date,r=new Date;return r.setDate(n.getDate()-1),t.toDateString()===n.toDateString()?l(`today`,this.language)||`Today`:t.toDateString()===r.toDateString()?l(`yesterday`,this.language)||`Yesterday`:t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}formatDateTimeFull(e){let t=new Date(e);return`${t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}, ${this.formatTime(t)}`}resolveKeyFrame(e,t){if(!t)return Promise.resolve(``);if(/^https?:\/\//i.test(t))return Promise.resolve(t);let n=t.replace(`/media/`,`media-source://media_source/local/`);return this.imageCache.has(n)?Promise.resolve(this.imageCache.get(n)):e.callWS({type:`media_source/resolve_media`,media_content_id:n,expires:3600*3}).then(e=>{let t=e.url;return this.imageCache.set(n,t),t}).catch(e=>(console.error(`Error resolving media content ID:`,e),t))}computeColors(e,t){let n=this.custom_colors||{},r;r=e==null?this.default_color===void 0?t:this.default_color:n[e]===void 0?t:n[e];let i,o;return Array.isArray(r)&&r.length===3?(i=`rgba(${r[0]},${r[1]},${r[2]},0.2)`,o=`rgba(${r[0]},${r[1]},${r[2]},1)`):(i=a(r,.2),o=a(r,1)),{bgColorRgba:i,iconColorRgba:o}}showPopup({event:e,summary:t,startTime:n,keyFrame:r,cameraName:i,category:a,label:o,icon:s,prefix:c,eventId:u},d){let f=d||this.hass,p=this.formatDateTimeFull(n),m=i?`${p} • ${i}`:p,h=`${c}-overlay`,g=`${c}-content`,_=`close-${c}`,v=`${c}-header-row`,y=`${c}-title-row`,b=`${c}-menu`,x=`${c}-menu-btn`,S=`${c}-menu-list`,C=`${c}-menu-item`,w=`${c}-menu-item-delete`,T=`${c}-menu-item-thumbs-up`,E=`${c}-menu-item-thumbs-down`,D=e=>typeof e==`string`?e.trim().toLowerCase():e,O=!!(a&&!(o&&D(o)===D(a))),k=typeof r==`string`?r.trim().length>0:!!r,A=`
                <div>
                    <div class="${v}">
                        <button class="${_}" title="Close" style="font-size:30px">
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                        <div class="spacer"></div>
                        ${u?`
                            <div class="${b}">
                            <button class="${x}" title="Menu" style="font-size:26px">
                                <ha-icon icon="mdi:dots-vertical"></ha-icon>
                            </button>
                            <div class="${S}" hidden>
                                ${k?`
                                <div class="${c}-menu-rate-row">
                                    <button class="${C} ${T}" title="Good response">
                                        <ha-icon icon="mdi:thumb-up-outline"></ha-icon>
                                    </button>
                                    <button class="${C} ${E}" title="Bad response">
                                        <ha-icon icon="mdi:thumb-down-outline"></ha-icon>
                                    </button>
                                </div>`:``}
                                <button class="${C} ${w}" title="Delete event">
                                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                                    <span>${l(`delete`,this.language)||`Delete`}</span>
                                </button>
                            </div>
                        </div>`:``}
                    </div>
                    <div class="${y}">
                        <div class="${c}-title-main">
                            <h2>${e}</h2>
                        </div>
                        <div class="${c}-title-secondary">
                            <p class="secondary"><span>${m}</span></p>
                        </div>
                        <div class="${c}-title-tertiary">
                            <div class="${c}-badges-row">
                                ${O?`
                                <span class="${c}-badge">
                                    <ha-icon icon="mdi:label"></ha-icon>
                                    <span class="text" style="text-transform: capitalize;">${a}</span>
                                </span>`:``}
                                ${o?`
                                <span class="${c}-badge">
                                    <ha-icon icon="${s||`mdi:tag-outline`}"></ha-icon>
                                    <span class="text" style="text-transform: capitalize;">${o}</span>
                                </span>`:``}
                            </div>
                        </div>
                    </div>
                    <img src="${r}" alt="Event Snapshot" onerror="this.style.display='none'">
                    <p class="summary">${t}</p>
                </div>
            `,j=document.createElement(`div`);j.innerHTML=`
                <div class="${h}">
                    <div class="${g}">
                        ${A}
                    </div>
                </div>
                <style>
                    .${h} {
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
                    .${h}.show { opacity: 1; }
                    .${g} {
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
                    .${h}.show .${g} { transform: scale(1); }
    
                    .${v} {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 4px;
                    }
                    .${v} .spacer {
                        flex: 1 1 auto;
                    }
    
                    /* Title row: icon + title */
                    .${y} {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 6px;
                    }
                    .${c}-title-main {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        justify-content: center;
                        width: 100%;
                    }
                    .${c}-title-main h2 {
                        flex: 1 1 auto;
                        min-width: 0;
                        max-width: 100%;
                        overflow: visible;
                        white-space: normal;
                        word-break: break-word;
                        margin: 0;
                        font-family: var(--ha-font-family-heading, "Roboto");
                        text-align: center;
                    }
                    .${c}-title-secondary {
                        width: 100%;
                        text-align: center;
                    }
                    .${c}-title-secondary .secondary {
                        font-weight: var(--ha-font-weight-medium, 500);
                        margin-top: 4px;
                        color: var(--primary-text-color);
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${c}-title-tertiary {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                    .${c}-badges-row {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 8px;
                        width: 100%;
                    }
                    .${c}-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 4px 10px;
                        border-radius: 9px;
                        background: var(--table-header-background-color, rgba(0,0,0,0.08));
                        color: var(--primary-text-color);
                        font-size: 0.9em;
                        line-height: 1;
                    }
                    .${c}-badge ha-icon {
                        --mdc-icon-size: 18px;
                    }
    
                    /* Image and text */
                    .${g} img {
                        width: 100%;
                        height: auto;
                        border-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
                        margin-top: 10px;
                    }
                    .${g} .summary {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-l, 16px);
                        line-height: 22px;
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
    
                    /* Buttons */
                    .${_}, .${x} {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--primary-text-color);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
    
                    /* Menu */
                    .${b} {
                        position: relative;
                    }
                    .${S} {
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
                    .${c}-menu-rate-row {
                        display: flex;
                        gap: 8px;
                        align-items: center;
                        margin-bottom: 6px;
                        width: 100%;
                    }
                    .${C}.${T}, .${C}.${E} {
                        flex: 1 1 0;
                        min-width: 0;
                        padding: 8px 12px;
                        justify-content: center;
                        box-sizing: border-box;
                    }
                    .${C} {
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
                    .${C}:hover {
                        background: rgba(0,0,0,0.06);
                    }
                    .${w} {
                        color: var(--error-color, #d32f2f);
                    }
                    .${T} {
                        padding: 6px !important;
                    }
                    .${E} {
                        padding: 6px !important;
                    }
    
                    @media (max-width: 768px) {
                        .${g} {
                            max-width: 100%;
                            max-height: 100%;
                            padding: 15px;
                            border-radius: 0;
                            height: 100%;
                        }
                        .${v} {
                            padding-top: 10px;
                        }
                        .${c}-title-main h2 {
                            max-width: 78%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin: 0;
                            font-family: var(--ha-font-family-heading, "Roboto");
                            text-align: center;
                        }
                    }
                </style>
            `,(!history.state||!history.state.popupOpen)&&history.pushState({popupOpen:!0},``);let M=j.querySelector(`.${h}`),N=()=>this.closePopup(j,h,N);window.addEventListener(`popstate`,N),j.querySelector(`.${_}`).addEventListener(`click`,()=>this.closePopup(j,h,N)),M.addEventListener(`click`,e=>{e.target===M&&this.closePopup(j,h,N)});let P=e=>{e.key===`Escape`&&this.closePopup(j,h,N,P)};document.addEventListener(`keydown`,P),j._escHandler=P;let F=j.querySelector(`.${x}`),I=j.querySelector(`.${S}`);F&&I&&(F.addEventListener(`click`,e=>{e.stopPropagation(),I.hidden=!I.hidden}),j.addEventListener(`click`,e=>{!I.hidden&&!e.target.closest(`.${b}`)&&(I.hidden=!0)}));let L=j.querySelector(`.${w}`);L&&u&&L.addEventListener(`click`,async e=>{if(e.stopPropagation(),L.disabled)return;let t=l(`confirm_delete_event`,this.language)||`Are you sure you want to delete this event?`;if(!confirm(t)){I&&(I.hidden=!0);return}L.disabled=!0,await this.deleteEvent(f,u)?this.closePopup(j,h,N,P):(alert(l(`error_delete_event`,this.language)||`Failed to delete the event. Please try again.`),L.disabled=!1,I&&(I.hidden=!0))});let R=j.querySelector(`.${T}`),z=j.querySelector(`.${E}`),B=async(i,c,l,d,f=``,p=``,m=``,g=``)=>{if(c.disabled)return;c.disabled=!0;let _={eventId:u,feedback:i};this.dispatchEvent(new CustomEvent(`llmvision-feedback`,{detail:_,bubbles:!0,composed:!0}));let v={title:e||``,description:t||``,label:o||``,category:a||``,icon:s||this.default_icon||``,eventId:u||``,startTime:n||``};try{let n=null,c=``;if(r)try{n=await(r.startsWith(`data:`)?await fetch(r):await fetch(r,{mode:`cors`})).blob();let e=(n.type||`image/jpeg`).split(`/`)[1]||`jpg`;c=`event_${u||Date.now()}.${e}`}catch(e){console.warn(`Unable to fetch key frame for feedback upload; submitting feedback without image.`,e)}try{let r=new FormData;n&&r.append(`image`,n,c||`event_${u||Date.now()}.jpg`),r.append(`isTitle`,v.title||``),r.append(`shouldBeTitle`,f||e||``),r.append(`isDescription`,v.description||``),r.append(`shouldBeDescription`,p||t||``),r.append(`isLabel`,v.label||``),r.append(`shouldBeLabel`,m||o||``),r.append(`isCategory`,v.category||``),r.append(`shouldBeCategory`,g||a||``),r.append(`isIcon`,v.icon||``),r.append(`shouldBeIcon`,s||``),r.append(`upDown`,i||``),r.append(`reason`,l||``),r.append(`feedback`,d||``);let h=await fetch(`https://feedback.llmvision.org/`,{method:`POST`,headers:{"X-App-Key":`e2d892b226e34339940079041ebc65fed345a5cdbd888b6f042ec2c44e0f9a2a`},body:r,mode:`cors`});if(h.ok)console.log(`Feedback uploaded successfully`);else{let e=await h.text().catch(()=>``);console.error(`Feedback upload failed:`,h.status,e)}}catch(e){console.error(`Error uploading snapshot to feedback API:`,e)}}catch(e){console.error(`Error uploading snapshot to feedback API:`,e)}finally{this.closePopup(j,h,N,P)}},V=(t,n)=>{if(n.disabled)return;let r=`${c}-feedback-detail-overlay`,i=`${c}-feedback-detail-content`,a=document.createElement(`div`),o=[{value:`event_not_no_activity`,label:`Event is not 'no activity'`},{value:`event_is_no_activity`,label:`Event should be 'no activity'`},{value:`incorrect_title_description`,label:`Incorrect title/descriptions`},{value:`incorrect_label`,label:`Incorrect label`},{value:`other`,label:`Other`}],s=(e||``).trim().toLowerCase(),u=o.filter(e=>s.includes(`no activity`)?e.value!==`event_is_no_activity`:e.value!==`event_not_no_activity`);a.innerHTML=`
                <div class="${r}">
                    <div class="${i}">
                        <button class="${c}-fd-close" title="Close" aria-label="Close" style="font-size:20px">✕</button>
                            <div class="${c}-fd-page ${c}-fd-page-1">
                                <h2>${l(`feedback_reason`,this.language)||`Select a reason`}</h2>
                                <div class="${c}-fd-reason-list">
                                    ${u.map(e=>`
                                        <button type="button" class="${c}-fd-reason-btn" data-value="${e.value}">${e.label}</button>
                                    `).join(``)}
                                </div>
                            </div>

                        <div class="${c}-fd-page ${c}-fd-page-2" hidden>
                            <!-- dynamic second page: for event_not_no_activity show title+description, otherwise show a short note -->
                            <div class="${c}-fd-page-2-content" style="margin-top:24px"></div>
                            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
                                <button class="${c}-fd-next-2">${l(`next`,this.language)||`Next`}</button>
                            </div>
                        </div>

                        <div class="${c}-fd-page ${c}-fd-page-3" hidden>
                            <h2>${l(`additional_details`,this.language)||`Additional details`}</h2>
                            <textarea class="${c}-fd-final-details" rows="6" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)"></textarea>
                            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
                                <button class="${c}-fd-send">${l(`send`,this.language)||`Send`}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    .${r} { position: fixed; inset: 0; display:flex;align-items:center;justify-content:center;z-index:1100;background:rgba(0,0,0,0.45); }
                    .${i} { position:relative; background: var(--ha-card-background, var(--card-background-color, #fff)); color: var(--primary-text-color); padding: 18px; border-radius:12px; width: 520px; max-width: calc(100% - 40px); max-height: calc(100vh - 40px); overflow-y: auto; }
                    .${i} h2 { margin:0 0 8px 0; text-align:center }
                    .${c}-fd-close { position:absolute; left:12px; top:12px; background:none; border:none; cursor:pointer; color:var(--primary-text-color); }
                    .${c}-fd-reason-list { }
                    .${c}-fd-reason-btn {
                        cursor: pointer;
                        display: block;
                        width: 100%;
                        text-align: left;
                        padding: 10px;
                        margin: 6px 0;
                        border-radius: 8px;
                        border: none;
                        transition: background 120ms ease, transform 60ms ease;
                        background: transparent;
                    }
                    .${c}-fd-reason-btn:hover {
                        background: rgba(0,0,0,0.04);
                    }
                    .${c}-fd-reason-btn.selected {
                        background: rgba(0,0,0,0.06);
                    }
                </style>
            `;let d=a.querySelector(`.${r}`),f=a.querySelector(`.${c}-fd-close`),p=a.querySelector(`.${c}-fd-page-1`),m=a.querySelector(`.${c}-fd-page-2`),h=a.querySelector(`.${c}-fd-page-3`),g=a.querySelector(`.${c}-fd-cancel`),_=a.querySelector(`.${c}-fd-next`),v=a.querySelector(`.${c}-fd-next-2`),y=a.querySelector(`.${c}-fd-send`),b=a.querySelector(`.${c}-fd-page-2-content`),x=a.querySelector(`.${c}-fd-final-details`),S=()=>{a._escHandler&&document.removeEventListener(`keydown`,a._escHandler),a.parentElement&&document.body.removeChild(a)};g&&g.addEventListener(`click`,e=>{e.stopPropagation(),S()}),f&&f.addEventListener(`click`,e=>{if(e.stopPropagation(),!m.hidden&&h.hidden)m.hidden=!0,p.hidden=!1,f.textContent=`✕`,f.title=`Close`,f.setAttribute(`aria-label`,`Close`);else if(h.hidden)S();else{let e=m.dataset.reason||``;if(h.hidden=!0,e===`other`){m.hidden=!0,p.hidden=!1,f.textContent=`✕`,f.title=`Close`,f.setAttribute(`aria-label`,`Close`);return}m.hidden=!1,f.innerHTML=`
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                        `,f.title=`Back`,f.setAttribute(`aria-label`,`Back`)}}),d.addEventListener(`click`,e=>{e.target===d&&S()}),a._escHandler=e=>{e.key===`Escape`&&S()},document.addEventListener(`keydown`,a._escHandler);let C=a.querySelectorAll(`.${c}-fd-reason-btn`);C.forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),C.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=e.dataset.value;b.innerHTML=``,n===`event_not_no_activity`||n===`incorrect_title_description`?b.innerHTML=`
                            <label style="display:block;margin:8px 0;font-weight:600">${l(`correct_title`,this.language)||`Correct title`}</label>
                            <input class="${c}-fd-correct-title" type="text" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)">
                            <label style="display:block;margin:8px 0;font-weight:600">${l(`correct_description`,this.language)||`Correct description`}</label>
                            <textarea class="${c}-fd-correct-description" rows="4" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)"></textarea>
                        `:n===`incorrect_label`?b.innerHTML=`
                            <label style="display:block;margin:8px 0;font-weight:600">${l(`correct_label`,this.language)||`Pick the correct label`}</label>
                            <select class="${c}-fd-correct-label" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)">
                                <option value="Alarm">Alarm</option>
                                <option value="Bicycle">Bicycle</option>
                                <option value="Bird">Bird</option>
                                <option value="Bus">Bus</option>
                                <option value="Camera">Camera</option>
                                <option value="Car">Car</option>
                                <option value="Cat">Cat</option>
                                <option value="Dog">Dog</option>
                                <option value="Door">Door</option>
                                <option value="Key">Key</option>
                                <option value="Light">Light</option>
                                <option value="Lock">Lock</option>
                                <option value="Motorcycle">Motorcycle</option>
                                <option value="Delivery">Delivery</option>
                                <option value="Person">Person</option>
                                <option value="Plant">Plant</option>
                                <option value="Sensor">Sensor</option>
                                <option value="Tree">Tree</option>
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                            </select>
                        `:b.innerHTML=`
                            <p style="margin:6px 0">${l(`please_provide_details`,this.language)||`Please provide more details on the next page.`}</p>
                        `,m.dataset.reason=n,p.hidden=!0,n===`other`?(m.hidden=!0,h.hidden=!1):(m.hidden=!1,h.hidden=!0),f&&(f.innerHTML=`
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                        `,f.title=`Back`,f.setAttribute(`aria-label`,`Back`))})}),_&&_.addEventListener(`click`,e=>{e.stopPropagation();let t=a.querySelector(`.${c}-fd-reason-btn.selected`);t&&t.click()}),v.addEventListener(`click`,e=>{e.stopPropagation(),m.hidden=!0,h.hidden=!1,f&&(f.innerHTML=`
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                    `,f.title=`Back`,f.setAttribute(`aria-label`,`Back`))}),y.addEventListener(`click`,async e=>{e.stopPropagation(),y.disabled=!0;let r=m.dataset.reason||``,i=``;if(r===`event_not_no_activity`){let e=a.querySelector(`.${c}-fd-correct-title`),t=a.querySelector(`.${c}-fd-correct-description`),n=e?(e.value||``).trim():``,r=t?(t.value||``).trim():``;n&&(i+=`Title: ${n}`),r&&(i+=(i?`
`:``)+`Description: ${r}`)}let o=(x.value||``).trim(),s=``,u=``,d=``,f=``;if(r===`event_not_no_activity`){let e=a.querySelector(`.${c}-fd-correct-title`),t=a.querySelector(`.${c}-fd-correct-description`);s=e?(e.value||``).trim():``,u=t?(t.value||``).trim():``}else if(r===`incorrect_title_description`){let e=a.querySelector(`.${c}-fd-correct-title`),t=a.querySelector(`.${c}-fd-correct-description`);s=e?(e.value||``).trim():``,u=t?(t.value||``).trim():``}else if(r===`incorrect_label`){let e=a.querySelector(`.${c}-fd-correct-label`);d=e?(e.value||``).trim():``}else if(r===`incorrect_category`){let e=a.querySelector(`.${c}-fd-correct-title`);f=e?(e.value||``).trim():``}await B(t,n,r,o,s,u,d,f),S(),H(l(`thanks_for_feedback`,this.language)||`Thanks for your feedback!`)}),document.body.appendChild(a)},H=e=>{this.closePopup(j,h,N,P),this.dispatchEvent(new CustomEvent(`hass-notification`,{bubbles:!0,composed:!0,detail:{message:e,duration:4e3}}))};R&&u&&R.addEventListener(`click`,e=>{e.stopPropagation(),I&&(I.hidden=!0),B(`up`,R,`good_response`,``,``,``,``,``),H(l(`thanks_for_feedback`,this.language)||`Thanks for your feedback!`)}),z&&u&&z.addEventListener(`click`,e=>{e.stopPropagation(),I&&(I.hidden=!0),V(`down`,z)}),document.body.appendChild(j),requestAnimationFrame(()=>M.classList.add(`show`))}closePopup(e,t,n,r){let i=e.querySelector(`.${t}`);i.classList.remove(`show`),i.addEventListener(`transitionend`,()=>{e._escHandler&&document.removeEventListener(`keydown`,e._escHandler);try{document.body.removeChild(e)}catch{}},{once:!0}),history.state&&history.state.popupOpen&&history.replaceState(null,``),window.removeEventListener(`popstate`,n)}}})),_,v,y=e((()=>{d(),o(),u(),g(),_=class extends s{static get properties(){return{_config:{type:Object}}}setConfig(e){this._config=e||{}}render(){if(!this._config)return i`<div>Please configure the card.</div>`;let e=this._getSchema(),t=e.slice(0,3),n=e.slice(3,5),r=e.slice(5);return i`
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
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:filter-variant"></ha-icon>Filters</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${t}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:translate"></ha-icon>Locale</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${n}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:palette"></ha-icon>Customization</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${r}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                </div>
            </ha-card>
        `}_getSchema(){let e=[{name:`category_filters`,description:`Filter events by category (title). Only events matching selected categories will be shown.`,selector:{select:{multiple:!0,options:Object.keys(r).map(e=>({value:e,label:e.charAt(0).toUpperCase()+e.slice(1)}))}}},{name:`camera_filters`,description:`Filter events by camera entity. Only events from selected cameras will be shown.`,selector:{select:{multiple:!0,options:Object.keys(this.hass.states).filter(e=>e.startsWith(`camera.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))}}},{name:`filter_false_positives`,description:`Hide events titled 'No activity observed'.`,selector:{boolean:{default:!0}}}],t=[{name:`language`,description:`Language for the card. This will be used to generate icons and translations.`,selector:{select:{options:[{value:`bg`,label:`Bulgarian`},{value:`ca`,label:`Catalan`},{value:`cz`,label:`Czech`},{value:`da`,label:`Danish`},{value:`nl`,label:`Dutch`},{value:`en`,label:`English`},{value:`fr`,label:`French`},{value:`de`,label:`German`},{value:`hu`,label:`Hungarian`},{value:`it`,label:`Italian`},{value:`pl`,label:`Polish`},{value:`pt`,label:`Portuguese`},{value:`sk`,label:`Slovak`},{value:`es`,label:`Spanish`},{value:`sv`,label:`Swedish`}]}}},{name:`time_format`,description:`Choose between 12-hour and 24-hour time display.`,selector:{select:{options:[{value:`24h`,label:`24-hour`},{value:`12h`,label:`12-hour`}]}}}],n=[{name:`default_icon`,description:`Icon when no category keyword matches.`,selector:{icon:{}}}];return[...e,...t,...n]}_computeLabel(e){return{entity:`Calendar Entity`,category_filters:`Category Filters`,camera_filters:`Camera Filters`,filter_false_positives:`Filter False Positives`,language:`Language`,time_format:`Time Format`}[e.name]||e.name}_computeHelper=e=>e.description||``;_valueChanged(e){this.dispatchEvent(new CustomEvent(`config-changed`,{detail:{config:e.detail.value}}))}static get styles(){return c`ha-card{padding:16px;}`}},customElements.define(`timeline-preview-card-editor`,_),v=class extends h{setConfig(e){this.setCommonConfig(e,{requireEventLimits:!1})}static getConfigElement(){return document.createElement(`timeline-preview-card-editor`)}static getStubConfig(){return{entity:`calendar.llm_vision_timeline`,language:`en`,time_format:`24h`,filter_false_positives:!0}}getCardSize(){return 3}getGridOptions(){return{rows:2,columns:6,min_rows:2,max_rows:8,min_columns:6,max_columns:24}}set hass(e){this.content||=(this.style.display=`block`,this.style.height=`100%`,this.innerHTML=`
                <ha-card class="llm-preview-card"><div class="preview-card-content"></div></ha-card>
                <style>
                .llm-preview-card{height:100%;display:flex;overflow:hidden;border-radius:var(--ha-card-border-radius,12px);}
                .llm-preview-card .preview-card-content{flex:1;display:flex;flex-direction:column;min-height:250px;}
                .preview-event-container{position:relative;flex:1 1 auto;width:100%;height:100%;min-height:0;overflow:hidden;border-radius:inherit;background:var(--ha-card-background,var(--card-background-color,#f3f3f3));cursor:pointer;}
                .preview-event-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block;}
                .preview-event-vignette{position:absolute;inset:0;pointer-events:none;z-index:1;background:linear-gradient(to bottom,rgba(0,0,0,0.55)0%,rgba(0,0,0,0)30%,rgba(0,0,0,0)70%,rgba(0,0,0,0.55)100%);}
                .preview-icon-container{position:absolute;top:3px;left:3px;width:40px;height:40px;border-radius:var(--ha-card-border-radius,25px);display:flex;align-items:center;justify-content:center;background:none;z-index:2;}
                .preview-event-title{position:absolute;left:44px;top:14px;color:#fff;font-size:var(--ha-font-size-l,16px);font-weight:var(--ha-font-weight-medium,500);z-index:2;max-width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
                .preview-event-details{position:absolute;left:12px;bottom:12px;color:rgba(255,255,255,0.9);font-size:var(--ha-font-size-m,14px);font-weight:var(--ha-font-weight-medium,500);z-index:2;max-width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
                .preview-empty-state{flex:1 1 auto;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;}
                </style>
            `,this.querySelector(`.preview-card-content`)),this._loadAndRender(e)}async _loadAndRender(e){let t=await this.fetchEvents(e,{limit:1,days:this.number_of_days,cameras:this.camera_filters,categories:this.category_filters,includeNoActivity:!this.filter_false_positives});if(!t)return;let n=this._hashState({...t,category_filters:this.category_filters,camera_filters:this.camera_filters,number_of_events:this.number_of_events,number_of_days:this.number_of_days,time_format:this.time_format,filter_false_positives:this.filter_false_positives});if(n!==this._lastEventHash){if(this._lastEventHash=n,!t.length){this.content.innerHTML=``;let e;e=this.category_filters.length?`noEventsCategory`:this.camera_filters.length?`noEventsCamera`:this.number_of_days?`noEventsHours`:`noEvents`;let t=l(e,this.language)||`No events found.`;e===`noEventsHours`&&(t=t.replace(`{hours}`,this.number_of_days)),this.content.innerHTML=`<div class="event-container preview-empty-state"><h3>${t}</h3></div>`;return}this._render(t,e)}}_render(e,n){let r=e[0],i=document.createElement(`div`);i.classList.add(`preview-event-container`);let a=t(r.category,r.label),{icon:o,color:s}=a;console.log(`icon result`,a,r.title),(r.category===void 0||r.category===``)&&this.default_icon&&(o=this.default_icon),console.log(`icon`,o,r.title,a);let c=r.cameraName,l=new Date(r.startTime),u=this.formatDateLabel(l),d=this.formatTime(l);i.innerHTML=`
                <img class="preview-event-image" src="" alt="Key frame" onerror="this.style.display='none'">
                <div class="preview-event-vignette"></div>
                <div class="preview-icon-container">
                    <ha-icon icon="${o}" style="color:white;font-size:24px;"></ha-icon>
                </div>
                <div class="preview-event-details">${c} • ${u}, ${d}</div>
                <div class="preview-event-title">${r.title}</div>
            `,i.addEventListener(`click`,()=>{this.resolveKeyFrame(n,r.keyFrame).then(e=>{this.showPopup({event:r.title,summary:r.description,startTime:r.startTime,keyFrame:e,cameraName:r.cameraName,category:r.category,label:r.label,icon:o,prefix:`popup`,eventId:r.id},n)})}),this.content.innerHTML=``,this.content.appendChild(i),this.resolveKeyFrame(n,r.keyFrame).then(e=>{let t=i.querySelector(`img`);t&&(t.src=e,t.style.display=`block`)})}static getStubConfig(){return{language:`en`,time_format:`24h`,filter_false_positives:!0}}},customElements.define(`llmvision-preview-card`,v)}));y();export{v as LLMVisionPreviewCard,h as n,g as r,y as t};