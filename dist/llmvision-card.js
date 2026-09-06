import{c as e,d as t,f as n,i as r,m as i,n as a,o,p as s,t as c,u as l}from"./assets/lit-B0LBCVuH.js";import{LLMVisionPreviewCard as u,n as d,r as f,t as p}from"./llmvision-preview-card.js";var m=i((()=>{l(),n(),c(),f(),p();var i=class extends a{static get properties(){return{_config:{type:Object}}}setConfig(e){this._config=e||{}}render(){if(!this._config)return r`<div>Please configure the card.</div>`;let e=this._getSchema(),t=e.slice(0,3),n=e.slice(3,6),i=e.slice(6,8),a=e.slice(8);return r`
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
                            <ha-form .data=${this._config} .schema=${t}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:filter-variant"></ha-icon>Filters</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${n}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:translate"></ha-icon>Locale</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${i}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:palette"></ha-icon>Customization</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${a}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                </div>
            </ha-card>
        `}_getSchema(){let e=[{name:`header`,description:`Header text for the card.`,selector:{text:{}}},{name:`number_of_events`,description:`Number of most recent events to display. A maximum of 10 events can be displayed.`,selector:{number:{min:1,max:100,step:1}}},{name:`number_of_days`,description:`Number of days to look back for events. Useful for filtering older events.`,selector:{number:{min:1,max:365,step:1}}}],t=[{name:`category_filters`,description:`Filter events by category (title). Only events matching selected categories will be shown.`,selector:{select:{multiple:!0,options:Object.keys(s).map(e=>({value:e,label:e.charAt(0).toUpperCase()+e.slice(1)}))}}},{name:`camera_filters`,description:`Filter events by camera entity. Only events from selected cameras will be shown.`,selector:{select:{multiple:!0,options:Object.keys(this.hass.states).filter(e=>e.startsWith(`camera.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))}}},{name:`filter_false_positives`,description:`Hide events titled 'No activity observed'.`,selector:{boolean:{default:!0}}}],n=[{name:`language`,description:`Language for the card. This will be used to generate icons and translations.`,selector:{select:{options:[{value:`bg`,label:`Bulgarian`},{value:`ca`,label:`Catalan`},{value:`cz`,label:`Czech`},{value:`da`,label:`Danish`},{value:`nl`,label:`Dutch`},{value:`en`,label:`English`},{value:`fr`,label:`French`},{value:`de`,label:`German`},{value:`hu`,label:`Hungarian`},{value:`it`,label:`Italian`},{value:`pl`,label:`Polish`},{value:`pt`,label:`Portuguese`},{value:`sk`,label:`Slovak`},{value:`es`,label:`Spanish`},{value:`sv`,label:`Swedish`}]}}},{name:`time_format`,description:`Choose between 12-hour and 24-hour time display.`,selector:{select:{options:[{value:`24h`,label:`24-hour`},{value:`12h`,label:`12-hour`}]}}}],r=[{name:`default_icon`,description:`Icon when no category keyword matches.`,selector:{icon:{}}},{name:`default_color`,description:`Color for uncategorized events.`,selector:{color_rgb:{}}}].concat(Object.keys(s).map(e=>({name:`custom_colors.${e}`,description:`Color for ${e.charAt(0).toUpperCase()+e.slice(1)}`,selector:{color_rgb:{}}})));return[...e,...t,...n,...r]}_computeLabel(e){return{header:`Header`,number_of_events:`Number of Events`,number_of_days:`Number of Days`,category_filters:`Category Filters`,camera_filters:`Camera Filters`,filter_false_positives:`Filter False Positives`,custom_colors:`Custom Colors`,language:`Language`,time_format:`Time Format`,default_icon:`Default Icon`,default_color:`Default Color`}[e.name]||e.name}_computeHelper=e=>e.description||``;_valueChanged(e){let t=e.detail.value,n={...this._config.custom_colors||{}};for(let e of Object.keys(t))if(e.startsWith(`custom_colors.`)){let r=e.split(`.`)[1];n[r]=t[e],delete t[e]}Object.keys(n).length&&(t.custom_colors=n),this.dispatchEvent(new CustomEvent(`config-changed`,{detail:{config:t}}))}static get styles(){return o`ha-card{padding:16px;}`}};customElements.define(`timeline-card-editor`,i);var m=class extends d{setConfig(e){this.header=e.header||``,this.setCommonConfig(e,{requireEventLimits:!0})}static getConfigElement(){return document.createElement(`timeline-card-editor`)}static getStubConfig(){return{number_of_days:7,number_of_events:3,language:`en`,time_format:`24h`,filter_false_positives:!0}}getCardSize(){return 3}getGridOptions(){return{rows:5,columns:9,min_rows:2,max_rows:8,min_columns:9,max_columns:24}}set hass(e){if(!this.content)this.style.display=`block`,this.style.height=`100%`,this.style.width=`100%`,this.style.maxWidth=`100%`,this.style.boxSizing=`border-box`,this.innerHTML=`
                <ha-card style="padding:16px;">
                    ${this.header===``?``:`<div class="card-header" style="font-size:1.3em;font-weight:600;padding:0 0 5px 0;">${this.header||`LLM Vision Events`}</div>`}
                    <div class="card-content"></div>
                </ha-card>
                <style>
                    /* Stretch the card to the allocated grid cell */
                    :host{display:block;width:100%;max-width:100%;box-sizing:border-box;}
                    ha-card{height:100%;width:100%;max-width:100%;margin:0;display:flex;flex-direction:column;box-sizing:border-box;overflow:hidden;}

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
            `,this.content=this.querySelector(`.card-content`);else{let e=this.querySelector(`.card-header`);e&&(this.header===``?e.style.display=`none`:(e.style.display=``,e.textContent=this.header))}this._loadAndRender(e)}async _loadAndRender(e){let n=await this.fetchEvents(e,{limit:this.number_of_events,days:this.number_of_days,cameras:this.camera_filters,categories:this.category_filters,includeNoActivity:!this.filter_false_positives});if(!n)return;let r=this._hashState({...n,category_filters:this.category_filters,camera_filters:this.camera_filters,number_of_events:this.number_of_events,number_of_days:this.number_of_days,time_format:this.time_format,filter_false_positives:this.filter_false_positives});if(r!==this._lastEventHash){if(this._lastEventHash=r,!n.length){this.content.innerHTML=``;let e;e=this.category_filters.length?`noEventsCategory`:this.camera_filters.length?`noEventsCamera`:this.number_of_days?`noEventsHours`:`noEvents`;let n=t(e,this.language)||`No events found.`;e===`noEventsHours`&&(n=n.replace(`{hours}`,this.number_of_days)),this.content.innerHTML=`<div class="event-container empty-state"><h3>${n}</h3></div>`;return}this._render(n,e)}}_render(t,n){this.content.innerHTML=``;let r=``;t.forEach((t,i)=>{let a=new Date(t.startTime),o=this.formatDateLabel(a),s=this.formatTime(a);if(o!==r){let e=document.createElement(`div`);e.classList.add(`date-header`),e.innerHTML=`<h2>${o}</h2>`,this.content.appendChild(e),r=o}let{icon:c,color:l}=e(t.category,t.label);(t.category===void 0||t.category===``)&&this.default_icon&&(c=this.default_icon);let u=this.computeColors(t.category,l),d=document.createElement(`div`);d.classList.add(`event-container`),d.innerHTML=`
                <div class="icon-container" style="background-color:${u.bgColorRgba};">
                    <ha-icon icon="${c}" style="color:${u.iconColorRgba};"></ha-icon>
                </div>
                <div class="event-details">
                    <h3>${t.title}</h3>
                    <p>${t.cameraName?`${s} • ${t.cameraName}`:s}</p>
                </div>
                <img alt="Key frame ${i+1}" style="display:none;" onerror="this.style.display='none'">
            `;let f=d.querySelector(`img`);d.addEventListener(`click`,()=>{this.resolveKeyFrame(n,t.keyFrame).then(e=>{this.showPopup({event:t.title,summary:t.description,startTime:t.startTime,keyFrame:e,cameraName:t.cameraName,category:t.category,label:t.label,icon:c,prefix:`popup`,eventId:t.id},n)})}),this.content.appendChild(d),this.resolveKeyFrame(n,t.keyFrame).then(e=>{e&&(f.src=e,f.style.display=``)})})}static getStubConfig(){return{number_of_days:24,number_of_events:5,language:`en`,time_format:`24h`,filter_false_positives:!0}}};customElements.define(`llmvision-card`,m),window.customCards=window.customCards||[],window.customCards.push({type:`llmvision-card`,name:`LLM Vision Timeline Card`,description:`Display the LLM Vision Timeline on your dashboard`,preview:!0,getConfigElement:m.getConfigElement,getConfigElementStub:m.getConfigElementStub}),window.customCards.push({type:`llmvision-preview-card`,name:`LLM Vision Preview Card`,description:`Preview the latest LLM Vision event`,preview:!0,getConfigElement:u.getConfigElement,getConfigElementStub:u.getConfigElementStub})}));export default m();