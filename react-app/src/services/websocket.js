class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = new Set();
        this.isConnecting = false;
        this.reconnectTimeout = null;
    }

    connect(token) {
        // Don't try to connect if already connecting or no token
        if (this.isConnecting || !token) {
            return;
        }

        this.isConnecting = true;
        
        const API = import.meta.env.VITE_API || "http://localhost:8080";
        const wsUrl = API.replace(/^http/, 'ws');
        
        // Clear existing connection
        this.disconnect();

        try {
            this.ws = new WebSocket(`${wsUrl}/notifications?token=${token}`);

            this.ws.onopen = () => {
                this.isConnecting = false;
                // Clear any existing reconnect timeout
                if (this.reconnectTimeout) {
                    clearTimeout(this.reconnectTimeout);
                    this.reconnectTimeout = null;
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'notification') {
                        this.notifyListeners(data.data);
                    }
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            this.ws.onclose = (event) => {
                this.isConnecting = false;
                
                if (event.code === 1008) {
                    console.error('WebSocket closed due to authentication error:', event.reason);
                    // Don't reconnect on auth errors
                    return;
                }
                
                // Only attempt reconnect if we have a token and no existing reconnect timeout
                if (token && !this.reconnectTimeout) {
                    this.reconnectTimeout = setTimeout(() => {
                        this.reconnectTimeout = null;
                        this.connect(token);
                    }, 5000);
                }
            };

            this.ws.onerror = (error) => {
                this.isConnecting = false;
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            this.isConnecting = false;
            console.error('Failed to create WebSocket connection:', error);
        }
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.isConnecting = false;
    }

    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners(data) {
        this.listeners.forEach(listener => {
            try {
                listener(data);
            } catch (error) {
                console.error('Error in WebSocket listener:', error);
            }
        });
    }
}

export const wsService = new WebSocketService();
