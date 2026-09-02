export const API_ENDPOINTS = {
    ORDERS: {
        LIST: '/orders',
        DETAIL: (id) => `/orders/${id}`,
        CREATE: '/orders',
        UPDATE: (id) => `/orders/${id}`,
        DELETE: (id) => `/orders/${id}`,
    },
    CUSTOMERS: {
        LIST: '/customers',
        SEARCH: (query) => `/customers/search?q=${query}`,
    },
    PRODUCTS: {
        LIST: '/products',
        STOCK: '/products/check-stock',
    },
    VUUPT: {
        GETCUSTOMER: '/vuupt/insert'
    }
};