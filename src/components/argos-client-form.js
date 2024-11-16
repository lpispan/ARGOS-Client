import { css, html } from 'lit-element';
import ArgosclientEntity from './argos-client-entity';
import CryptoJS from 'crypto-js';
import '@vaadin/accordion';
import '@vaadin/combo-box';
import '@vaadin/number-field';
import '@vaadin/text-field';
import '@vaadin/password-field';
import '@vaadin/radio-group';
import '@vaadin/vertical-layout';

export default class ArgosclientForm extends ArgosclientEntity {
    static styles = css`
        :host {
           display: block;
           background-color: var(--neutral-color);
           width: 100%;
        }

        vaadin-accordion-panel,
        vaadin-vertical-layout {
            padding-left: 10px;
            width: 400px;
        }

        .control {
           display: flex;
           justify-content: flex-end;
           margin: 1em;
        }

        .control button {
            margin-right: 15x;
            border-radius: 10px;
            cursor: pointer;
            font-family: inherit;
            font-size: 1em;
            height: 40px;
            width: 120px;
            background-color: var(--main-color);
        }

        .control button:hover {
            background-color: var(--dark-shade);
            color: white;
        }

        vaadin-text-field,
        vaadin-number-field,
        vaadin-password-field,
        vaadin-combo-box {
            width: 100%;
        }
    `;

    static properties = {
        envVariables: { type: Object}
    };

    logMode = [
        {
            value: 'error',
            label: 'Error'
        },
        {
            value: 'warning',
            label: 'Warning'
        },
        {
            value: 'info',
            label: 'Information'
        },
        {
            value: 'debug',
            label: 'Dedug'
        }
    ];


    firstUpdated() {
        this.#loadEnvVariables();
    }

    render() {
        return html`
            <vaadin-accordion>
                <vaadin-accordion-panel summary="${this.getTranslation('general')}">
                    <vaadin-vertical-layout>
                        <vaadin-number-field id="ARGOS_PORT" label="${this.getTranslation('argosPortClient')}" placeholder="3000"></vaadin-number-field>
                        <vaadin-combo-box id="LOG_MODE" label="${this.getTranslation('logMode')}" .items="${this.logMode}"></vaadin-combo-box>
                        <vaadin-radio-group id="USE_SWAGGER" label="${this.getTranslation('swagger')}">
                            <vaadin-radio-button value="true" label="${this.getTranslation('active')}" checked></vaadin-radio-button>
                            <vaadin-radio-button value="false" label="${this.getTranslation('inactive')}"></vaadin-radio-button>
                        <vaadin-text-field id="HOST_WHITELIST" label="${this.getTranslation('hostWhiteList')}" placeholder=""></vaadin-text-field>
                    </vaadin-vertical-layout>
                </vaadin-accordion-panel>
                <vaadin-accordion-panel summary="${this.getTranslation('elasticsearchConnection')}">
                    <vaadin-vertical-layout>
                        <vaadin-text-field id="ELASTICSEARCH_URL" label="${this.getTranslation('elasticsearchURL')}" placeholder="http://localhost:9200"></vaadin-text-field>
                        <vaadin-text-field id="ELASTICSEARCH_USER" label="${this.getTranslation('elasticsearchUser')}" placeholder="user"></vaadin-text-field>
                        <vaadin-password-field id="ELASTICSEARCH_PASSWORD" label="${this.getTranslation('elasticsearchPassword')}" placeholder="password"></vaadin-password-field>
                    </vaadin-vertical-layout>
                </vaadin-accordion-panel>
                <vaadin-accordion-panel summary="${this.getTranslation('elasticsearchIndices')}">
                    <vaadin-vertical-layout>
                        <vaadin-text-field id="INDEX_ARGOS_PATTERN" label="${this.getTranslation('argosPattern')}" placeholder="argos_request"></vaadin-text-field>
                        <vaadin-text-field id="INDEX_LOG_PATTERN" label="${this.getTranslation('logPattern')}" placeholder="argos_logs"></vaadin-text-field>
                        <vaadin-number-field id="INDEX_LOG_MAX_DAYS" label="${this.getTranslation('indexMaxDays')}" placeholder="7"></vaadin-number-field>
                    </vaadin-vertical-layout>
                </vaadin-accordion-panel>
                <vaadin-accordion-panel summary="${this.getTranslation('userSession')}">
                    <vaadin-vertical-layout>
                        <vaadin-text-field id="ARGOS_CLIENT_USER" label="${this.getTranslation('argosClientUser')}" placeholder="argos"></vaadin-text-field>
                        <vaadin-password-field id="ARGOS_CLIENT_PASSWORD" label="${this.getTranslation('argosClientPassword')}"></vaadin-password-field>
                        <vaadin-text-field id="ARGOS_SERVER_USER" label="${this.getTranslation('argosServertUser')}" placeholder="guacadmin"></vaadin-text-field>
                        <vaadin-password-field id="ARGOS_SERVER_PASSWORD" label="${this.getTranslation('argosServerPassword')}"></vaadin-password-field>
                        <vaadin-text-field id="USER_NAME" label="${this.getTranslation('userSO')}" placeholder="argos"></vaadin-text-field>
                        <vaadin-radio-group id="MANAGE_SERVICE" label="${this.getTranslation('manageService')}">
                            <vaadin-radio-button value="true" label="${this.getTranslation('active')}" checked></vaadin-radio-button>
                            <vaadin-radio-button value="false" label="${this.getTranslation('inactive')}"></vaadin-radio-button>
                        </vaadin-radio-group>
                  </vaadin-vertical-layout>
                </vaadin-accordion-panel>
                <vaadin-accordion-panel summary="${this.getTranslation('password')}">
                    <vaadin-vertical-layout>        
                        <vaadin-number-field id="MAX_LENGTH" label="${this.getTranslation('maxPaswordLength')}" placeholder="12"></vaadin-number-field>
                        <vaadin-radio-group id="USE_NUMBER" label="${this.getTranslation('useNumberPassword')}">
                             <vaadin-radio-button value="true" label="${this.getTranslation('active')}" checked></vaadin-radio-button>
                            <vaadin-radio-button value="false" label="${this.getTranslation('inactive')}"></vaadin-radio-button>
                        </vaadin-radio-group>
                        <vaadin-radio-group id="USE_SPECIAL_CHARACTER" label="${this.getTranslation('useSpecialPassword')}">
                              <vaadin-radio-button value="true" label="${this.getTranslation('active')}" checked></vaadin-radio-button>
                            <vaadin-radio-button value="false" label="${this.getTranslation('inactive')}"></vaadin-radio-button>
                        </vaadin-radio-group>
                        <vaadin-text-field id="SPECIAL_CHARACTERS_ALLOW" label="${this.getTranslation('specialCharactersAllowed')}" placeholder="!@"></vaadin-text-field>
                        <vaadin-text-field id="CHARACTERS_ALLOW" label="Characters allowed" placeholder="ABCDEF"></vaadin-text-field>
                    </vaadin-vertical-layout>
                </vaadin-accordion-panel>
            </vaadin-accordion>

            <div class="control">
                <button @click=${this.#save}>${this.getTranslation('save')}</button>
            </div> 
        `;
    }

    async #loadEnvVariables() {
        const response = await fetch('/argos-client/env');
        this.envVariables = await response.json();
        Object.keys(this.envVariables).forEach(item => {
            try{
                if (item === 'HOST_WHITELIST') {
                    this.renderRoot.querySelector(`#${item}`).value = this.envVariables[item].replaceAll("'", "").replaceAll("[", "").replaceAll("]", ""); 
                } else if (item.endsWith('PASSWORD')) {
                    const bytes  = CryptoJS.AES.decrypt(this.envVariables[item], this._seed);
                    this.renderRoot.querySelector(`#${item}`).value = bytes.toString(CryptoJS.enc.Utf8);
                } else {
                    this.renderRoot.querySelector(`#${item}`).value = this.envVariables[item]; 
                }

            } catch(Error) {
                console.error(Error);
            }
        });
    }

   
    #save() {
        const newData = {};
    
        Object.keys(this.envVariables).forEach(item => {
            try{
                if (item === 'HOST_WHITELIST') {
                    newData.HOST_WHITELIST = this.renderRoot.querySelector(`#${item}`).value.split(",");
                } else if (item.endsWith('PASSWORD')) {
                    newData[item] = CryptoJS.AES.encrypt(this.renderRoot.querySelector(`#${item}`).value, this._seed).toString();
                } else {
                    newData[item] = this.renderRoot.querySelector(`#${item}`).value;
                }
            } catch(Error) {
                console.error(Error);
            }    
        });

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
             method: "POST",
             headers: myHeaders,
             body: JSON.stringify(newData),
             redirect: "manual"
        };

        fetch('/argos-client/env', requestOptions)
             .then((response) => response.text())
             .then((result) => console.log(result))
             .catch((error) => console.error(error));
    }

}

customElements.define('argos-client-form', ArgosclientForm);
