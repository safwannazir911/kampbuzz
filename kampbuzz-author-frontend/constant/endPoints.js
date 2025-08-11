// export const BACKEND_URL = "http://localhost:3000/api/v1";
// export const BACKEND_URL = "https://kampbuzz-beryl.vercel.app/api/v1";


// Implemented dynamic url based of env mode
// changes to local on npm run dev and to deployed backend on npm run deployment
export const BACKEND_URL = `${import.meta.env.VITE_BASE_URL}/api/v1`;
