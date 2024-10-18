// import * as dotenv from 'dotenv';
// import path from "path";

// dotenv.config({ path: path.join((process.cwd(), ".env")) });

// export default {
//   NODE_ENV: process.env.NODE_ENV,
//   port: process.env.PORT,
//   db_url: process.env.DB_URL,
//   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
//   jwt_access_secret: process.env.JWT_ACCESS_SECRET,
//   jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
//   jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
//   jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,


//   cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
//   cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,



//   client_live_url: process.env.CLIENT_LIVE_URL_LINK,


//   live_backend_url:process.env.BACKEND_LIVE_URL_LINK
// };


import dotenv from 'dotenv'
dotenv.config()

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,




store_id: process.env.STORE_ID, 
signature_key: process.env.SIGNATURE_KEY,
aamarpay_url: process.env.PAYMENT_URL,
payment_verify_url: process.env.PAYMENT_VERIFY_URL,


backendUrl: process.env.BACKEND_LIVE_URL_LINK,
frontendUrl: process.env.CLIENT_LIVE_URL_LINK

}