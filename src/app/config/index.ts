import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  access_secret: process.env.ACCESS_TOKEN,
  access_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refresh_secret: process.env.REFRESH_TOKEN,
  refresh_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  store_id: process.env.STORE_ID,
  signature_key: process.env.SIGNATURE_KEY,
  payment_url:process.env.PAYMENT_URL,
  frontend_url:process.env.FRONTEND_URL,
  backend_url:process.env.BACKEND_URL,
  verify_url:process.env.VERIFY_URL,
  user_email:process.env.USER_EMAIL,
  user_pass: process.env.USER_PASS,
  nodemailer_host: process.env.NODEMAILER_HOST,
};
