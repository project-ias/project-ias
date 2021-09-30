var ENV_BACKEND_URL, ENV_FRONTEND_URL;

if(process.env.NODE_ENV === "production") {
    ENV_BACKEND_URL = "https://api.project-ias.com";
    ENV_FRONTEND_URL = "https://project-ias.com";
}

else if(process.env.NODE_ENV === "development") {
    ENV_BACKEND_URL = "http://localhost:5000";
    ENV_FRONTEND_URL = "http://localhost:3000";
}

export {ENV_BACKEND_URL, ENV_FRONTEND_URL};