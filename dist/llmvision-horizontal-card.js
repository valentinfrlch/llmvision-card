import{i as e,n as t,o as n,t as r,u as i}from"./assets/lit-B0LBCVuH.js";i(),r();var a=class extends t{static get properties(){return{_config:{type:Object}}}setConfig(e){this._config=e||{}}render(){if(!this._config)return e`<div>Please configure the card.</div>`;let t=this._getSchema().slice(0,2),n=this._getSchema().slice(2,7),r=this._getSchema().slice(7,7),i=this._getSchema().slice(7);return e`
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
                                .schema=${t}
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
                                .schema=${n}
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
                                .schema=${r}
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
                            .schema=${i}
                            .computeLabel=${this._computeLabel}
                            .computeHelper=${this._computeHelper}
                            @value-changed=${this._valueChanged}
                        ></ha-form>
                    </div>
                </details>
                </div>
            </ha-card>
        `}_getSchema(){let e=[{name:`header`,description:`Header text for the card.`,selector:{text:{}}},{name:`entity`,description:`Select the LLM Vision timeline entity to display.`,selector:{select:{mode:`dropdown`,options:[...Object.keys(this.hass.states).filter(e=>e.startsWith(`calendar.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))]}}}],t=[{name:`number_of_events`,description:`Number of most recent events to display. A maximum of 10 events can be displayed.`,selector:{number:{min:1,max:10,step:1}}},{name:`number_of_hours`,description:`Number of hours to look back for events. Useful for filtering older events.`,selector:{number:{min:1,max:168,step:1}}},{name:`category_filters`,description:`Filter events by category (title). Only events matching selected categories will be shown.`,selector:{select:{multiple:!0,options:Object.keys(colors.categories).map(e=>({value:e,label:e.charAt(0).toUpperCase()+e.slice(1)}))}}},{name:`camera_filters`,description:`Filter events by camera entity. Only events from selected cameras will be shown.`,selector:{select:{multiple:!0,options:Object.keys(this.hass.states).filter(e=>e.startsWith(`camera.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))}}}],n=[{name:`language`,description:`Language for the card. This will be used to generate icons and translations.`,selector:{select:{options:[{value:`bg`,label:`Bulgarian`},{value:`ca`,label:`Catalan`},{value:`cz`,label:`Czech`},{value:`da`,label:`Danish`},{value:`nl`,label:`Dutch`},{value:`en`,label:`English`},{value:`fr`,label:`French`},{value:`de`,label:`German`},{value:`hu`,label:`Hungarian`},{value:`it`,label:`Italian`},{value:`pl`,label:`Polish`},{value:`pt`,label:`Portuguese`},{value:`sk`,label:`Slovak`},{value:`es`,label:`Spanish`},{value:`sv`,label:`Swedish`}]}}}],r=Object.keys(colors.categories).map(e=>({name:`custom_colors.${e}`,description:`Color for ${e.charAt(0).toUpperCase()+e.slice(1)}`,selector:{color_rgb:{}}}));return[...e,...t,...n,...r]}_computeLabel(e){return{header:`Header`,entity:`Calendar Entity`,number_of_events:`Number of Events`,number_of_hours:`Number of Hours`,category_filters:`Category Filters`,camera_filters:`Camera Filters`,custom_colors:`Custom Colors`,language:`Language`}[e.name]||e.name}_computeHelper=e=>e.description||``;_valueChanged(e){let t=e.detail.value,n={...this._config.custom_colors||{}};for(let e of Object.keys(t))if(e.startsWith(`custom_colors.`)){let r=e.split(`.`)[1];n[r]=t[e],delete t[e]}Object.keys(n).length>0&&(t.custom_colors=n),this.dispatchEvent(new CustomEvent(`config-changed`,{detail:{config:t}}))}static get styles(){return n`
            ha-card {
                padding: 16px;
            }
            .card-content {
                display: flex;
                flex-direction: column;
                padding: 0 0 8px 0 !important;
            }
        `}};customElements.define(`timeline-horizontal-card-editor`,a);