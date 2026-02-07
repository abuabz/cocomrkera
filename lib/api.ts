const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
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
