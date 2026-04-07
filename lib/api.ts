const getApiBaseUrl = () => {
    // Get the environment variable
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    // Default to localhost for development
    const defaultUrl = 'http://localhost:5005';

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

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    try {
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            // Handle unauthorized globally if needed
            if (response.status === 401 && typeof window !== 'undefined' && endpoint !== '/auth/login') {
                // Potential redirect or state clear could happen here
                console.warn('[API] Unauthorized access detected');
            }
            throw new Error(data.message || `Server responded with ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error: any) {
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
    getEmployeeReports: (from?: string, to?: string) => {
        let url = '/stats/employee-reports'
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

export const backupApi = {
    export: () => apiCall('/backup/export', { method: 'GET' }),
    import: (data: any) => apiCall('/backup/import', { method: 'POST', body: JSON.stringify(data) }),
};

export const authApi = {
    login: (credentials: any) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data: any) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => apiCall('/auth/me', { method: 'GET' }),
};

export const userApi = {
    getAll: () => apiCall('/users', { method: 'GET' }),
    create: (data: any) => apiCall('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/users/${id}`, { method: 'DELETE' }),
};

export const savingsApi = {
    getAll: () => apiCall('/savings'),
    getStats: () => apiCall('/savings/stats'),
    getOne: (id: string) => apiCall(`/savings/${id}`),
    create: (data: any) => apiCall('/savings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/savings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/savings/${id}`, { method: 'DELETE' }),
};

export const expensesApi = {
    getAll: () => apiCall('/expenses'),
    getStats: () => apiCall('/expenses/stats'),
    getOne: (id: string) => apiCall(`/expenses/${id}`),
    create: (data: any) => apiCall('/expenses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/expenses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/expenses/${id}`, { method: 'DELETE' }),
};
