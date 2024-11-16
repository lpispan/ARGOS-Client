import { LitElement, html, css } from 'lit';
import './components/argos-client-form';
import './components/argos-client-login';

class ARGOSCLient extends LitElement {
  static styles = css`
    :host {
      background-color: white;
    }

    .container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .container .header {
      align-items: center;
      background-color: var(--dark-shade);
      color: white;
      display: flex;
      font-size: 24px;
      justify-content: space-between;
      padding: 5px;
      text-align: center;
    }

    .container .header .logout button {
      background: none;
      border: none;
      cursor: pointer;
    } 

    .container .header .logout button svg {
      width: 20px;
    }

    .container .main {
      align-items: center;
      background-color: var(--default-background);
      display: flex;
      flex: 1;
      justify-content: center;
      padding: 5px;
    }

    .container .footer {
      background-color: var(--main-footer);
      color: white;
      font-size: 14px;
      padding: 10px;
      text-align: end;
    }

    .bigSize {
      align-items: flex-start !important;
    }
  `;

  static properties = {
    activeLogin: { type: Boolean }
  };


  constructor() {
      super();
      this.activeLogin = true;
  }

  firstUpdated() {
    window.addEventListener('login', () => {
      this.activeLogin = true;
    });
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <div>
            <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="30" r="15" stroke="#000000" stroke-width="2" fill="#FFFFFF"/>
              <circle cx="50" cy="30" r="5" fill="#FFC107" />
              <circle cx="52" cy="32" r="2.5" fill="#FFFFFF"/>
              <circle cx="25" cy="20" r="15" stroke="#000000" stroke-width="2" fill="#FFFFFF" />
              <circle cx="25" cy="20" r="5" fill="#4CAF50" />
              <circle cx="27.5" cy="17.5" r="2.5" fill="#FFFFFF"/>
              <circle cx="75" cy="20" r="15" stroke="#000000" stroke-width="2" fill="#FFFFFF" />
              <circle cx="75" cy="20" r="5" fill="#4CAF50" />
              <circle cx="72.5" cy="17.5" r="2.5" fill="#FFFFFF"/>
            </svg>
          </div>
          <div class="title">ARGOS Client</div>
          <div>
            ${this.activeLogin ? 
              html ``
              :
              html `<div class="logout" >
                  <button @click="${this.#logout}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" fill="#FFFFFF"/></svg>
                  </button>
                </div>`
            }
          </div>
        </div>
        <div class="main ${this.activeLogin ? '' : 'bigSize'}">
            ${this.activeLogin ? 
              html `<argos-client-login></argos-client-login>`
              :
              html `<argos-client-form></argos-client-form>`
            }
        </div>
        <div class="footer">MIT License. 2024</div>
      </div>
    `;
  }

  #logout() {
    this.activeLogin = true;
  }
}

customElements.define('argos-client', ARGOSCLient);
