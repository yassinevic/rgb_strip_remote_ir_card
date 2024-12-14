class RGBStripRemoteEditor extends HTMLElement {
    setConfig(config) {
        this._config = config;
        this.services = [];
        this._loadServices();
    }

    set hass(hass) {
        this._hass = hass;
        if (!this.services?.length) {
            this._loadServices();
        }
    }

    _loadServices() {
        if (this._hass) {
            this.services = Object.entries(this._hass.services).flatMap(
                ([domain, actions]) =>
                    Object.keys(actions).map((service) => `${domain}.${service}`)
            );
            this.render();
        }
    }


render() {
    if (!this._config || !this.services?.length) {
        this.innerHTML = '<p>Loading services...</p>';
        return;
    }

    this.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px; font-family: Arial, sans-serif;">
            <label style="font-size: 16px; font-weight: bold; color: #333; width:max-content" >
                <span>Select Service:</span>
                <input 
                    id="service-search" 
                    list="services-list" 
                    value="${this._config.service || ''}" 
                    placeholder="Type or select a service..." 
                    style="
                        padding: 12px 14px; 
                        border: 1px solid #ccc; 
                        border-radius: 8px; 
                        width: 100%; 
                        font-size: 14px; 
                        background-color: #f9f9f9; 
                        transition: all 0.3s ease;
                    "
                />
                <datalist id="services-list">
                    ${this.services
                        .map(
                            (service) =>
                                `<option value="${service}"></option>`
                        )
                        .join('')}
                </datalist>
            </label>
        </div>
    `;

    const searchInput = this.querySelector('#service-search');

    searchInput.addEventListener('change', (event) => {
        const newConfig = { ...this._config, service: event.target.value };
        this._configChanged(newConfig);
    });

    // Adding styles for hover and focus effects
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#007bff';  // Blue border on focus
        searchInput.style.backgroundColor = '#e8f4ff';  // Light blue background
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#ccc';  // Reset border color
        searchInput.style.backgroundColor = '#f9f9f9';  // Reset background
    });
}


    _configChanged(newConfig) {
        const event = new CustomEvent('config-changed', {
            detail: { config: newConfig },
        });
        this.dispatchEvent(event);
    }

    get value() {
        return this._config;
    }
}
customElements.define('rgb-strip-remote-card-editor', RGBStripRemoteEditor);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "rgb-strip-remote-card",
    name: "RGB Strip Remote Card",
    description: "A custom card for RGB strip remote control.",
});

class RGBStripRemote extends HTMLElement {
    set hass(hass) {
        this._hass = hass;
        if (!this.cardElement) {
            this.render();
        }
    }

    setConfig(config) {
        if (!config.service) {
            throw new Error('You must define a service to call.');
        }

        this.config = {
            ...config,
            service: config.service || "esphome.send_rgb_strip_remote_ir_signal",
            service_data: config.service_data || {}
        };
    }

    render() {
          const html = `   
             <style>
                    .bg-gray-100 { background-color: #f7fafc; }
                    .min-h-screen { min-height: 100vh; }
                    .flex { display: flex; }
                    .items-center { align-items: center; }
                    .justify-center { justify-content: center; }
                    .p-4 { padding: 1rem; }
                    .bg-gray-800 { background-color: #2d3748; }
                    .rounded-3xl { border-radius: 1.5rem; }
                    .p-6 { padding: 1.5rem; }
                    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
                    .w-[280px] { width: 280px; }
                    .space-y-4 { > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1rem * var(--tw-space-y-reverse)); } }
                    .grid { display: grid; }
                    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .gap-2 { gap: 0.5rem; }
                    .bg-white { background-color: #ffffff; }
                    .rounded-full { border-radius: 9999px; }
                    .p-3 { padding: 0.75rem; }
                    .flex { display: flex; }
                    .items-center { align-items: center; }
                    .justify-center { justify-content: center; }
                    .text-white { color: #ffffff; }
                    .bg-red-500 { background-color: #ef4444; }
                    .bg-green-500 { background-color: #22c55e; }
                    .bg-blue-500 { background-color: #3b82f6; }
                    .bg-gray-200 { background-color: #e5e7eb; }
                    .bg-gray-700 { background-color: #4a5568; }
                    .bg-orange-500 { background-color: #f97316; }
                    .bg-green-400 { background-color: #66c66c; }
                    .bg-blue-400 { background-color: #66a3f2; }
                    .bg-pink-200 { background-color: #f9a8d4; }
                    .bg-orange-400 { background-color: #f99b7d; }
                    .bg-cyan-400 { background-color: #66c6c6; }
                    .bg-indigo-700 { background-color: #4c51bf; }
                    .bg-pink-300 { background-color: #f9a8d4; }
                    .bg-orange-300 { background-color: #fdba74; }
                    .bg-teal-400 { background-color: #20c997; }
                    .bg-purple-700 { background-color: #7e22ce; }
                    .bg-blue-200 { background-color: #a5b4fc; }
                    .bg-yellow-400 { background-color: #facc15; }
                    .bg-teal-500 { background-color: #14b8a6; }
                    .bg-pink-600 { background-color: #db2777; }
                    .bg-blue-300 { background-color: #93c5fd; }
                    .p-2 { padding: 0.5rem; }
                    .text-xs { font-size: 0.75rem; }
                    button {
                        outline: none;
                        border: none;
                        cursor: pointer;
                    }
                </style>

                 <ha-card>
                      <div class="bg-gray-800 rounded-3xl p-6 shadow-lg w-[280px] space-y-4">
                        <!-- Top Controls -->
                        <div class="grid grid-cols-4 gap-2">
                            <button data-id="0x5C" class="bg-white rounded-full p-3 flex items-center justify-center">☀️</button>
                            <button data-id="0x5D" class="bg-white rounded-full p-3 flex items-center justify-center">🌙</button>
                            <button data-id="0x41" class="bg-gray-700 rounded-full p-3 flex items-center justify-center text-white">▶</button>
                            <button data-id="0x40" class="bg-red-500 rounded-full p-3 flex items-center justify-center text-white">⭘</button>
                        </div>
                
                        <!-- RGBW Buttons -->
                        <div class="grid grid-cols-4 gap-2">
                            <button data-id="0x58" class="bg-red-500 rounded-full p-3 text-white">R</button>
                            <button data-id="0x59" class="bg-green-500 rounded-full p-3 text-white">G</button>
                            <button data-id="0x45" class="bg-blue-500 rounded-full p-3 text-white">B</button>
                            <button data-id="0x44" class="bg-gray-200 rounded-full p-3">W</button>
                        </div>
                
                        <!-- Color Grid -->
                        <div class="grid grid-cols-4 gap-2">
                            <button data-id="0x54" class="bg-orange-500 rounded-full p-3"></button>
                            <button data-id="0x55" class="bg-green-400 rounded-full p-3"></button>
                            <button data-id="0x49" class="bg-blue-400 rounded-full p-3"></button>
                            <button data-id="0x48" class="bg-pink-200 rounded-full p-3"></button>
                
                            <button data-id="0x50" class="bg-orange-400 rounded-full p-3"></button>
                            <button data-id="0x51" class="bg-cyan-400 rounded-full p-3"></button>
                            <button data-id="0x4D" class="bg-indigo-700 rounded-full p-3"></button>
                            <button data-id="0x4C" class="bg-pink-300 rounded-full p-3"></button>
                
                            <button data-id="0x1C" class="bg-orange-300 rounded-full p-3"></button>
                            <button data-id="0x1D" class="bg-teal-400 rounded-full p-3"></button>
                            <button data-id="0x1E" class="bg-purple-700 rounded-full p-3"></button>
                            <button data-id="0x1F" class="bg-blue-200 rounded-full p-3"></button>
                
                            <button data-id="0x18" class="bg-yellow-400 rounded-full p-3"></button>
                            <button data-id="0x19" class="bg-teal-500 rounded-full p-3"></button>
                            <button data-id="0x1A" class="bg-pink-600 rounded-full p-3"></button>
                            <button data-id="0x1B" class="bg-blue-300 rounded-full p-3"></button>
                        </div>
                
                        <!-- Arrow Controls -->
                        <div class="grid grid-cols-4 gap-2">
                            <button data-id="0x14" class="bg-white rounded-full p-2">↑</button>
                            <button data-id="0x16" class="bg-white rounded-full p-2">↑</button>
                            <button data-id="0x10" class="bg-white rounded-full p-2">↑</button>
                            <button data-id="0x08" class="bg-white rounded-full p-2 text-xs">QUICK</button>
                
                            <button data-id="0x15" class="bg-white rounded-full p-2">↓</button>
                            <button data-id="0x17" class="bg-white rounded-full p-2">↓</button>
                            <button data-id="0x11" class="bg-white rounded-full p-2">↓</button>
                            <button data-id="0x09" class="bg-white rounded-full p-2 text-xs">SLOW</button>
                        </div>
                
                        <!-- DIY Buttons -->
                        <div class="grid grid-cols-4 gap-2">
                            <button data-id="0x12" class="bg-white rounded-full p-2 text-xs">DIY1</button>
                            <button data-id="0x13" class="bg-white rounded-full p-2 text-xs">DIY2</button>
                            <button data-id="0x0C" class="bg-white rounded-full p-2 text-xs">DIY3</button>
                            <button data-id="0x0A" class="bg-white rounded-full p-2 text-xs">AUTO</button>
                
                            <button data-id="0x0D" class="bg-white rounded-full p-2 text-xs">DIY4</button>
                            <button data-id="0x0E" class="bg-white rounded-full p-2 text-xs">DIY5</button>
                            <button data-id="0x0F" class="bg-white rounded-full p-2 text-xs">DIY6</button>
                            <button data-id="0x0B" class="bg-white rounded-full p-2 text-xs">FLASH</button>
                        </div>
                
                        <!-- Bottom Controls -->
                        <div class="grid grid-cols-4 gap-2">
                            <button data-id="0x04" class="bg-white rounded-full p-2 text-xs">JUMP3</button>
                            <button data-id="0x05" class="bg-white rounded-full p-2 text-xs">JUMP7</button>
                            <button data-id="0x06" class="bg-white rounded-full p-2 text-xs">FADE3</button>
                            <button data-id="0x07" class="bg-white rounded-full p-2 text-xs">FADE7</button>
                        </div>
                    </div>
                 </ha-card>`;

        this.cardElement = document.createElement('div');
        this.innerHTML = html;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const buttons = this.querySelectorAll('button');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const command = event.target.getAttribute('data-id');
                if (!command){
                    this.showError(`The command should not be empty check your data-id`);
                    return;
                } 

                try {
                    this.handleTapAction(command);
                } catch (err) {
                    this.showError(`Failed to execute command: ${err.message}`);
                }
            });
        });
    }

    handleTapAction(command) {
        if (!this._hass) {
            this.showError("Home Assistant instance is not available.");
            return;
        }

        if (!this.config.service) {
            this.showError("Service is not defined in the card configuration.");
            return;
        }

        const [domain, service] = this.config.service.split(".");
        if (!domain || !service) {
            this.showError("Invalid service format. Ensure it is 'domain.service'.");
            return;
        }

        const serviceData = { command, ...this.config.service_data };

        this._hass
            .callService(domain, service, serviceData)
            .then(() => this.clearError())
            .catch((err) => this.showError(`Service call failed: ${err.message}`));
    }

    showError(message) {
        const errorElement = this.querySelector("#error-message");
        if (errorElement) {
            errorElement.style.display = "block";
            errorElement.textContent = message;
        }
    }

    clearError() {
        const errorElement = this.querySelector("#error-message");
        if (errorElement) {
            errorElement.style.display = "none";
            errorElement.textContent = "";
        }
    }

    getCardSize() {
        return 3; // Card height in rows
    }

    static getConfigElement() {
        return document.createElement('rgb-strip-remote-card-editor');
    }

    static getStubConfig() {
        return {
            service: "esphome.send_rgb_strip_remote_ir_signal",
            service_data: {}
        };
    }
}

customElements.define('rgb-strip-remote-card', RGBStripRemote);
