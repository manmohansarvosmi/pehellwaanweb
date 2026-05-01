const BASE_URL = 'https://pahellwaanbackend.helixioninnovations.com/api';

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
            if (data.token) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data));
            }
            return { success: true, data };
        } else {
            return { success: false, message: data.message || data.massage || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
};

export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
};

export const getToken = () => localStorage.getItem('userToken');

/** MEMBERS API **/

export const getAllMembers = async () => {
    try {
        const token = getToken();
        if (!token) return { success: false, message: 'Auth required' };
        const response = await fetch(`${BASE_URL}/members/getAllMembers`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const createMember = async (memberData: any) => {
    try {
        const token = getToken();
        const formData = new FormData();
        Object.keys(memberData).forEach(key => {
            if (memberData[key] !== undefined && memberData[key] !== null) {
                formData.append(key, memberData[key]);
            }
        });

        const response = await fetch(`${BASE_URL}/members/createMember`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        return response.ok ? { success: true, data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const updateMember = async (id: string | number, memberData: any) => {
    try {
        const token = getToken();
        const formData = new FormData();
        Object.keys(memberData).forEach(key => {
            if (memberData[key] !== undefined && memberData[key] !== null) {
                formData.append(key, memberData[key]);
            }
        });

        const response = await fetch(`${BASE_URL}/members/updateMember/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        return response.ok ? { success: true, data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const getMemberById = async (id: string | number) => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/members/getMemberById/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

/** STAFF API **/

export const getAllStaff = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/staff/getAllStaff`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const createStaff = async (staffData: any) => {
    try {
        const token = getToken();
        const formData = new FormData();
        Object.keys(staffData).forEach(key => {
            if (staffData[key] !== undefined && staffData[key] !== null) {
                formData.append(key, staffData[key]);
            }
        });
        const response = await fetch(`${BASE_URL}/staff/createStaff`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        return response.ok ? { success: true, data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const getStaffById = async (id: string | number) => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/staff/getStaffById/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

/** DASHBOARD & ALERTS API **/

export const getDashboardSummary = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/dashboard/summary`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const getUpcomingExpirations = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/members/expiringSoon`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const getPendingPayments = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/members/pendingPayments`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

/** FINANCE API **/

export const getFinanceTransactions = async (type: 'income' | 'expenses' | 'all' = 'all') => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/finance/transactions?type=${type}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const getFinanceSummary = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/finance/summary`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

/** ATTENDANCE API **/

export const getAttendance = async (date?: string) => {
    try {
        const token = getToken();
        const url = date ? `${BASE_URL}/attendance/get?date=${date}` : `${BASE_URL}/attendance/getToday`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const markAttendance = async (memberId: string | number, status: 'IN' | 'OUT') => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/attendance/mark`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ memberId, status }),
        });
        const data = await response.json();
        return response.ok ? { success: true, data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

/** PACKAGES API **/

export const getAllPackages = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/packages/getAllPackages`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data: data.data } : { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};
