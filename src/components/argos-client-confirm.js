import { css, html  } from 'lit-element';
import ArgosclientEntity from './argos-client-entity';;

export default class ArgosclientConfirm extends ArgosclientEntity {
    static styles = css`
        :host {
            align-items: center;
            background-color: rgba(0, 0, 0, 0.3);
            display: block;
            height: 100%;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: 10;
        }

        .wrapper {
            background-color: var(--default-background);
            display: flex;
            flex-direction: column;
            gap: 1em;
            left: 33%;
            position: relative;
            top: 30%;
            width: 33%;
        }

        .wrapper .title {
            background-color: var(--main-color);
            color: var(--default-background);
            height: 20px;
            font-size: 1.2rem;
            font-weight: bold;
            padding: 10px;
        }

        .wrapper .body {
            padding: 2em;
        }

        .control {
           display: flex;
           justify-content: flex-end;
           margin: 1em;
           gap: 20px;
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

    render() {
        return html`
            <div class="wrapper">
                <div class="title">${this.getTranslation('confirmTitle')}</div>
                <div class="body">${this.getTranslation('questionConfirm')}</div>    
                <div class="control">
                    <button @click=${this.#close}>${this.getTranslation('cancel')}</button>
                    <button @click=${this.#save}>${this.getTranslation('save')}</button>
                </div>  
             </div>
        `;
    }

    #close() {
       this.remove();
    }

    #save() {
        this.dispatchEvent(
            new CustomEvent('saveConfirm', {
                bubbles: true,
                composed: true,     
            }),
        );
        this.remove();
    }
}

customElements.define('argos-client-confirm', ArgosclientConfirm);
