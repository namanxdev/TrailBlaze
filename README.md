# TrailBlaze - Campgrounds Web Application

TrailBlaze is a full-stack web application that allows users to create, edit, delete, and review campgrounds. It includes user authentication, image uploads, and flash messaging.

## 📌 Features
- ✅ **User Authentication** – Sign up, login, and logout using Passport.js
- ✅ **Campground CRUD Operations** – Create, read, update, and delete campgrounds
- ✅ **Review System** – Users can leave reviews for campgrounds
- ✅ **Flash Messages** – Display success/error messages to users
- ✅ **Image Uploads** – Upload multiple images using Multer & Cloudinary
- ✅ **Secure Sessions** – Sessions stored using Express-session & MongoDB
- ✅ **Error Handling** – Custom error handling middleware
- ✅ **MongoDB Integration** – Data stored in MongoDB using Mongoose
- ✅ **Security Enhancements** – Helmet & Mongo-sanitize implemented
- ✅ **Map Integration** – Campgrounds displayed using MapTiler API
- ✅ **Cloud Database** – MongoDB Atlas used for cloud storage
- ✅ **Deployment** – Hosted on Render

## 🛠 Technologies Used
- **Backend:** Node.js, Express.js
- **Frontend:** EJS, Bootstrap 5
- **Database:** MongoDB & Mongoose (MongoDB Atlas)
- **Authentication:** Passport.js & Express-session
- **File Uploads:** Multer & Cloudinary
- **Middleware:** Method-Override, Flash Messages, Helmet, Mongo-sanitize
- **Map API:** MapTiler
- **Deployment:** Render

## 📂 Project Structure
```
yelp-camp/
├── routes/                  # Express routes (campgrounds, reviews, users)
├── models/                  # Mongoose models (User, Campground, Review)
├── views/                   # EJS templates
├── public/                  # Static assets (CSS, JS, Images)
├── cloudinary/              # Cloudinary config for image uploads
├── middleware/              # Custom middleware
├── utils/                   # Utility functions (Error handling)
├── app.js                   # Main Express application
├── package.json             # Dependencies
└── README.md                # Project documentation
```
## 🛠 Usage
- **1.Register/Login**
- **2.Create a Campground**
- **3.Upload Images**
- **4.Edit or Delete Your Campgrounds**
- **5.Leave Reviews on Campgrounds**
- **6.View Campgrounds on a Map**
- **7.Logout**

## 📸 Image Uploads
- Image uploads are handled using Multer & Cloudinary.
- You can upload multiple images when creating or editing a campground.

## 🗺️ Map Integration
- MapTiler API is used to display campgrounds on an interactive map.

## 🔒 Authentication & Authorization
- Users must sign up or log in to create/edit campgrounds.
- Only the campground owner can edit or delete a campground.
- Only the review author can delete their review.

## ⚠️ Error Handling
This project includes custom error handling for:
- Page Not Found (404)
- Unauthorized Actions
- Server Errors
- If an error occurs, users are redirected to an error page with a message.

## 📌 Future Improvements
- Add a messaging system between users
