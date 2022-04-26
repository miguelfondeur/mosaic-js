import template from './template.js';

export default class GlobalHeader extends HTMLElement {
    constructor() {
        super();
    
        //data
        this.data = {

        }

        //attach root
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['count', 'color', 'name', 'avatar'];       
    }

    //getters
    
    //setters
    
    render() {
        this.shadow.innerHTML = template();
    }

    //methods
    methods() {
        return {
            
        };
    }

    //Life Cycle Hooks
    attributeChangedCallback(prop, oldVal, newVal) {
        
    }

    connectedCallback() {
        //render
        this.render();
    }

    disconnectedCallback() {
        
    }
}

customElements.define('global-header', GlobalHeader);