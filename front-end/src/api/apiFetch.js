export const apiFetch = async (endpoint, options = {}) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  /* const token = getCookie('XSRF-TOKEN');
  console.log("TOKEN EXTRAÍDO DE COOKIE:", token);
   */
  //const baseUrl = "http://192.168.1.116/server"; // Cambia esto por la URL de tu backend
 //const baseUrl=import.meta.env.VITE_API_URL; // toma la IP de .env del frontend
  const baseUrl = "http://localhost:8000"; // Cambia esto por la URL de tu backend

  let headers = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    // ...options.headers,
    ...(options.headers || {}),
  };

  //Print
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions = {
    ...options,
    credentials: "include",
    headers,
    cache: 'no-store'
  };

  //return fetch(`${baseUrl}${endpoint}`, fetchOptions);
  const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

  // sesión expirada
  if (response.status === 401) {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    return;
  }
  return response;
};
/*  export const apiFetch = (url, options = {}) => {
  return fetch(`http://localhost:8000${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers
    },
    ...options   
  });
}; */

/* //options (method, body,heaers)
EX: await apiFetch("/api/payments", {
  method: "POST",
  body: JSON.stringify({ amount: 100 })
    headers: {
    "X-Custom-Header": "123"
  }
}); 

*/
