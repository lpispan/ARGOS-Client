import { LitElement } from 'lit-element';

export default class ArgosclientEntity extends LitElement {
    static properties = {
        translations: { type: Object }
    };
   
    async loadTranslations() {
      const language = navigator.language.substring(0, 2);
    
      try {
        const response = await fetch(`../../locales/${language}.json`);
        this.translations = await response.json();
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    }
  
    constructor() {
      super();
      this._seed = '01ARGOS10!';
      this.loadTranslations();
    }

    getTranslation(key) {
        return this.translations[key] || key;
    }
}
