(function () {
    const localHosts = ['localhost', '127.0.0.1'];
    const isLocalFrontend = localHosts.includes(window.location.hostname);
    const apiBase = isLocalFrontend && window.location.port !== '3000'
        ? `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.hostname}:3000`
        : window.location.origin;

    async function request(path, options = {}) {
        if (window.location.protocol === 'file:') {
            throw new Error('Open the website from http://localhost:3000 so it can connect to the backend.');
        }

        let response;
        try {
            response = await fetch(`${apiBase}/api/${path}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
        } catch {
            throw new Error('Cannot reach the backend. Start it with "npm start" in the Backend folder, then try again.');
        }

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.message || 'The request could not be completed.');
        }

        return data;
    }

    window.restaurantApi = {
        getMenu() {
            return request('menu');
        },
        createOrder(order) {
            return request('orders', {
                method: 'POST',
                body: JSON.stringify(order),
            });
        },
        createContact(message) {
            return request('contact', {
                method: 'POST',
                body: JSON.stringify(message),
            });
        },
    };
})();
