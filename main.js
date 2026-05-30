class LottoNumber extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['number'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'number') {
            this.render();
        }
    }

    render() {
        const number = this.getAttribute('number') || '';
        const colorClass = this.getColorClass(parseInt(number, 10));

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #fff;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .ball {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .color-1 { background-color: #fbc400; }
                .color-2 { background-color: #69c8f2; }
                .color-3 { background-color: #ff7272; }
                .color-4 { background-color: #aaa; }
                .color-5 { background-color: #b0d840; }
            </style>
            <div class="ball ${colorClass}">${number}</div>
        `;
    }

    getColorClass(number) {
        if (number <= 10) return 'color-1';
        if (number <= 20) return 'color-2';
        if (number <= 30) return 'color-3';
        if (number <= 40) return 'color-4';
        return 'color-5';
    }
}

customElements.define('lotto-number', LottoNumber);

document.getElementById('generate-btn').addEventListener('click', () => {
    const numbersContainer = document.getElementById('numbers');
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    Array.from(numbers).sort((a, b) => a - b).forEach(number => {
        const lottoNumber = document.createElement('lotto-number');
        lottoNumber.setAttribute('number', number);
        numbersContainer.appendChild(lottoNumber);
    });
});
