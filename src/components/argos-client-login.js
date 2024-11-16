import { css, html  } from 'lit-element';
import ArgosclientEntity from './argos-client-entity';
import '@vaadin/text-field';
import '@vaadin/password-field';
import CryptoJS from 'crypto-js';

export default class ArgosclientLogin extends ArgosclientEntity {
    static styles = css`
        :host {
           display: block;
           border-radius: 4px;
           border: 1px solid #929292;
           max-width: 400px;
           background-color: var(--neutral-color)
        }

        .wrapper {
            display: flex;
            flex-direction: column;
            padding: 2em;
            gap: 1em;
        }

        .captcha {
            padding: 0em 2em;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
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

        .toast {
            align-items: center;
            background-color: var(--error-color);
            color: var(--default-background);
            display: flex;
            font-size: 16px;
            font-weight: bold;
            height: 35px;
            justify-content: center;
        }

        .hidden {
            display: none !important;
        }
    `;

    static properties = {
        number1: { type: Number },
        number2: { type: Number },   
    };
    
    constructor() {
        super();
        this.number1 = Math.floor(Math.random() * 21);
        this.number2 = Math.floor(Math.random() * 21);
        
    }

    render() {
        return html`
            <div class="toast hidden" id="toast"></div>    
            <div class="wrapper">
                <vaadin-text-field required id="user" label="${this.getTranslation('user')}" placeholder="${this.getTranslation('user')}"></vaadin-text-field>
                <vaadin-password-field required id="password" label="${this.getTranslation('password')}" placeholder="${this.getTranslation('password')}"></vaadin-password-field>
            </div>
            <div class="captcha">
                <span>${this.number1}</span>
                <span>&nbsp;+&nbsp;</span>
                <span>${this.number2}</span>
                <span>&nbsp;=&nbsp;</span>
                <vaadin-text-field id="captcha" required></vaadin-text-field>
            </div>
            <div class="control">
                <button @click=${this.#login}>${this.getTranslation('login')}</button>
            </div>  
        `;
    }

    #errorLogin() {
        this.renderRoot.querySelector('#toast').classList.remove('hidden');
        this.renderRoot.querySelector('#toast').innerHTML = this.getTranslation('errorLogin');
    }

    async #login() {
        const data = {};
        data.user = this.renderRoot.querySelector('#user').value;
        data.password = this.renderRoot.querySelector('#password').value;
        data.captcha = this.renderRoot.querySelector('#captcha').value;

        if (data.captcha == (this.number1 + this.number2)) {
            const response = await fetch('/argos-client/env');
            this.envVariables = await response.json();
            const bytes = CryptoJS.AES.decrypt(this.envVariables.ARGOS_CLIENT_PASSWORD, this._seed);
            if ((this.envVariables.ARGOS_CLIENT_USER !== data.user) ||  (bytes.toString(CryptoJS.enc.Utf8) !== data.password)) {
               this.#errorLogin();
            } else {
                this.renderRoot.querySelector('#toast').classList.add('hidden');
                this.dispatchEvent(
                    new CustomEvent('login', {
                        bubbles: true,
                        composed: true,     
                    }),
                );
            }
        } else {
            this.#errorLogin();
        }
    }
}

customElements.define('argos-client-login', ArgosclientLogin);
