const getApiBaseUrl = () => {
    // Get the environment variable
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    // Default to localhost for development
    const defaultUrl = 'http://localhost:5000';

    // Use environment URL if set, otherwise use default
    let baseUrl = envUrl || defaultUrl;

    // Remove trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');

    // Ensure /api suffix is present
    if (!baseUrl.endsWith('/api')) {
        baseUrl = `${baseUrl}/api`;
    }

    return baseUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL being used (helpful for debugging)
if (typeof window !== 'undefined') {
    console.log('[API Config] Base URL:', API_BASE_URL);
    console.log('[API Config] Raw Environment:', process.env.NEXT_PUBLIC_API_URL);
    console.log('[API Config] All NEXT_PUBLIC vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
}

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    try {
        console.log(`[API] Calling: ${fullUrl}`);
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error(`[API] Error ${response.status} from ${fullUrl}:`, data);
            throw new Error(data.message || `Server responded with ${response.status}: ${response.statusText}`);
        }

        console.log(`[API] Success from ${fullUrl}`);
        return data;
    } catch (error: any) {
        console.error(`[API] Call failed: ${fullUrl}`, error);
        if (error.message === 'Failed to fetch') {
            throw new Error(`Connection failed. Cannot reach backend at ${API_BASE_URL}`);
        }
        throw error;
    }
};

export const customersApi = {
    getAll: () => apiCall('/customers'),
    getOne: (id: string) => apiCall(`/customers/${id}`),
    create: (data: any) => apiCall('/customers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/customers/${id}`, { method: 'DELETE' }),
};

export const employeesApi = {
    getAll: () => apiCall('/employees'),
    getOne: (id: string) => apiCall(`/employees/${id}`),
    create: (data: any) => apiCall('/employees', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/employees/${id}`, { method: 'DELETE' }),
};

export const salesApi = {
    getAll: () => apiCall('/sales'),
    getOne: (id: string) => apiCall(`/sales/${id}`),
    create: (data: any) => apiCall('/sales', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/sales/${id}`, { method: 'DELETE' }),
};

export const ordersApi = {
    getAll: () => apiCall('/orders'),
    getOne: (id: string) => apiCall(`/orders/${id}`),
    create: (data: any) => apiCall('/orders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/orders/${id}`, { method: 'DELETE' }),
};

export const followupsApi = {
    getAll: () => apiCall('/followups'),
    getOne: (id: string) => apiCall(`/followups/${id}`),
    create: (data: any) => apiCall('/followups', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/followups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/followups/${id}`, { method: 'DELETE' }),
};

export const statsApi = {
    getDashboard: () => apiCall('/stats/dashboard'),
    getReports: (from?: string, to?: string) => {
        let url = '/stats/reports'
        if (from || to) {
            const params = new URLSearchParams()
            if (from) params.append('from', from)
            if (to) params.append('to', to)
            url += `?${params.toString()}`
        }
        return apiCall(url)
    },
};

export const salariesApi = {
    getAll: () => apiCall('/salaries'),
    getOne: (id: string) => apiCall(`/salaries/${id}`),
    create: (data: any) => apiCall('/salaries', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/salaries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/salaries/${id}`, { method: 'DELETE' }),
};
