const BASE_URL = '/api';

/** AUTH UTILS **/
export const getToken = () => localStorage.getItem('userToken');

export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
};

/** API REQUEST HELPER **/
async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: HeadersInit = {
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            // Handle unauthorized/forbidden
            console.warn('Auth error:', response.status);
            // Optional: logout();
        }

        if (response.ok) {
            return { success: true, data: data.data !== undefined ? data.data : data };
        } else {
            return { success: false, message: data.message || data.massage || 'Request failed' };
        }
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return { success: false, message: 'Network error. Please check your connection.' };
    }
}

/** AUTH API **/
export const login = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Robustly check for token in various potential locations
            const token = data.token || (data.data && data.data.token);
            const user = data.user || (data.data && data.data.user) || data.data || data;

            if (token) {
                localStorage.setItem('userToken', token);
                localStorage.setItem('userData', JSON.stringify(user));
                return { success: true, data: user };
            } else {
                console.error('Login successful but no token found in response:', data);
                return { success: false, message: 'Invalid server response: No token' };
            }
        } else {
            return { success: false, message: data.message || data.massage || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
};

/** MEMBERS API **/
export const getAllMembers = () => apiRequest('/members/getAllMembers');

export const createMember = (memberData: any) => {
    const formData = new FormData();
    Object.keys(memberData).forEach(key => {
        if (memberData[key] !== undefined && memberData[key] !== null) {
            formData.append(key, memberData[key]);
        }
    });
    return apiRequest('/members/createMember', {
        method: 'POST',
        body: formData,
    });
};

export const updateMember = (id: string | number, memberData: any) => {
    const formData = new FormData();
    Object.keys(memberData).forEach(key => {
        if (memberData[key] !== undefined && memberData[key] !== null) {
            formData.append(key, memberData[key]);
        }
    });
    return apiRequest(`/members/updateMember/${id}`, {
        method: 'POST',
        body: formData,
    });
};

export const getMemberById = (id: string | number) => apiRequest(`/members/getMemberById/${id}`);

/** STAFF API **/
export const getAllStaff = () => apiRequest('/staff/getAllStaff');

export const createStaff = (staffData: any) => {
    const formData = new FormData();
    Object.keys(staffData).forEach(key => {
        if (staffData[key] !== undefined && staffData[key] !== null) {
            formData.append(key, staffData[key]);
        }
    });
    return apiRequest('/staff/createStaff', {
        method: 'POST',
        body: formData,
    });
};

export const getStaffById = (id: string | number) => apiRequest(`/staff/getStaffById/${id}`);

/** DASHBOARD & ALERTS API **/
export const getDashboardSummary = () => apiRequest('/dashboard/summary');
export const getUpcomingExpirations = () => apiRequest('/members/expiringSoon');
export const getPendingPayments = () => apiRequest('/members/pendingPayments');

/** FINANCE API **/
export const getFinanceTransactions = (type: 'income' | 'expenses' | 'all' = 'all') => 
    apiRequest(`/finance/transactions?type=${type}`);

export const getFinanceSummary = () => apiRequest('/finance/summary');

/** ATTENDANCE API **/
export const getAttendance = (date?: string) => {
    const endpoint = date ? `/attendance/get?date=${date}` : '/attendance/getToday';
    return apiRequest(endpoint);
};

export const markAttendance = (memberId: string | number, status: 'IN' | 'OUT') => {
    return apiRequest('/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, status }),
    });
};

/** PACKAGES API **/
export const getAllPackages = () => apiRequest('/packages/getAllPackages');
