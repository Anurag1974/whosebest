import db from '../config/db.js';
import session from 'express-session';
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import BusinessModel from '../models/busines.model.js';
import { generateToken } from '../utils/jwt.js';
import GlobalToggleService from '../services/globalToggleService.js';
import uploadMiddleware from '../middleware/multerMiddleware.js';

const OTP_EXPIRATION = 5 * 60 * 1000; // 5 minutes
const otpStore = {}; // Store OTPs in memory (Replace with Redis for production)

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});


export default class BusinessController {

    async sendOTP(req, res) {
        try {
            const { name, email, otp } = req.body;
            console.log(req.body);
    
            // Check if email is provided
            if (!email && !name) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }
    
            otpStore[email] = { otp, expiresAt: Date.now() + OTP_EXPIRATION };
    
            // Send OTP to email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Welcome to Whose Best - Your OTP Code",
                text: `Dear ${name},\n\nWelcome to Whose Best! We are thrilled to have you on board.\n\nYour OTP is: ${otp}\n\nPlease use this OTP to complete your registration.This OTP is valid for 5 minutes.\n\nThank you for being a part of us!\n\nBest regards,\nWhose Best Team`,
            });
    
            res.json({ success: true, message: "OTP sent successfully!" });
    
        } catch (error) {
            console.error("Error sending OTP:", error);
            res.status(500).json({ success: false, message: "Failed to send OTP" });
        }
    }
    
    async verifyOTP(req, res) {
        try {
            const { email, otp } = req.body;
    
            if (!email || !otp) {
                return res.status(400).json({ success: false, message: "Email and OTP are required." });
            }
    
            // Check if OTP exists and if it's expired
            if (!otpStore[email]) {
                return res.status(400).json({ success: false, message: "OTP not found. Please request a new one." });
            }
    
            if (otpStore[email].expiresAt < Date.now()) {
                delete otpStore[email]; // Clean up expired OTP
                return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
            }
    
            // Validate OTP
            if (otpStore[email].otp !== otp) {
                return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
            }
    
            // OTP verified, remove it from the store
            delete otpStore[email];
    
            return res.json({ success: true, message: "OTP verified successfully!" });
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return res.status(500).json({ success: false, message: "Failed to verify OTP. Please try again later." });
        }
    }
    
    


    async signup(req, res) {
    try {
        const { username, email, phone, password } = req.body;

        // Check if all required fields are provided
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Check if user already exists
        const existingUser = await BusinessModel.getUserByEmail(email);
        if (existingUser.length) {
            return res.status(400).json({ success: false, message: "Email already in use!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        await BusinessModel.createUser(username, email, hashedPassword, phone);

        // Send success response
        res.json({
            success: true,
            message: "✅ Signup successful! Redirecting...",
            redirectUrl: "/login",
        });

    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ success: false, message: " Internal server error. Please try again later." });
    }
    }

    async login(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await BusinessModel.getUserByEmail(email);
        if (!user.length) {
            return res.status(400).json({ success: false, message: "User not found. Please sign up first." });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user[0].password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Generate JWT Token
        const token = generateToken({ email: user[0].email, userId: user[0].user_id });

        // Store token in session
        req.session.user = {
            id: user[0].user_id,
            email: user[0].email,
        };

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({ success: true, message: "Login successful", token });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ success: false, message: "An error occurred during login. Please try again later." });
    }
    }

    async showOwnListedBusinessList(req, res) {
        if (!req.user) {
            // return res.status(401).json({ message: "Unauthorized" });
            return res.redirect('/login')
        }
        try {
            const registeredBusiness = await BusinessModel.getRegisteredBusiness(req.user.id,req.session.toggle);
            res.render('your-business', { user: req.user, registeredBusiness, toggle: req.session.toggle });
        }
        catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
    }
  
    showNamePage(req, res) {
        try {
            if (!req.user) {
                return res.redirect('/login');
            }
            res.render('enter-your-details', { user: req.user });
        } catch (error) {
            console.error("Error in showNamePage:", error);
            res.status(500).send("An error occurred while loading the page.");
        }
    }

    async showRatePage(req, res) {
        const businessId = req.params.id;
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.redirect('/login');
        }

        try {
            const ratingData = await BusinessModel.getUserRating(userId, businessId);
            res.render('rate', { user: req.user, businessId, ratingData, toggle: req.session.toggle });
        } catch (error) {
            console.error('Error fetching rating:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async submitReview(req, res) {
        const { rating, review } = req.body;
        const businessId = req.params.businessId;

        if (!req.user) {
            return res.redirect('/login')
            // return res.status(401).json({ message: 'User not logged in' });
        }

        try {
            // Save the rating and review using the model
            const result = await BusinessModel.saveRating(req.user.id, businessId, rating, review);

            if (result.success) {
                // Redirect to business details page
                return res.redirect(`/business-details/${businessId}`);
            } else {
                return res.status(500).json({
                    message: result.message,
                    error: result.error,
                });
            }
        } catch (error) {
            console.error('Error in submitReview:', error); // Log the error for debugging
            return res.status(500).json({
                message: 'An unexpected error occurred while submitting the review.',
                error: error.message,
            });
        }
    }
    async deleteReview(req, res) {
        try {
            const { id } = req.params;

            // console.log('in the controller of delete review')

            // Call model function to delete the review
            const result = await BusinessModel.deleteReviewById(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Review not found" });
            }

            res.json({ message: "Review deleted successfully" });
        } catch (error) {
            console.error("Error deleting review:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    // this will render the complete home page
    async showHome(req, res) {
        try {
            // Fetching data for the home page
            const paidAdvertisements = await BusinessModel.getPaidAdvertisements();
            const testimonials = await BusinessModel.getTestimonials();
            const businessCounts = await BusinessModel.getBusinessCount(req.session.toggle);

            // console.log(businessCounts)
            const recentActivity = await BusinessModel.getReviewRecentActivity();
    
            // Fetching top rated businesses
            const topRatedBusinesses = await BusinessModel.getTopRatedBusinessPerCategory();
            // console.log(topRatedBusinesses)
            const popperCategories=await BusinessModel.getPopperCategories();
    
            // Rendering the home page with the fetched data
            res.render('home', {
                user: req.user || null,
                toggle: req.session.toggle,
                paidAdvertisements: paidAdvertisements || 1,
                businessCounts,
                topRatedBusinesses: topRatedBusinesses || [],
                testimonials,
                popperCategories,
                recentActivity
            });
        } catch (error) {
            console.error("Error loading home page:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }

    showBusiness(req, res) {
        try {
            const { location, business } = req.body;
            // console.log(location, business);
    
            res.render('show-business', { location, business, toggle: req.session.toggle, user: req.user });
    
        } catch (error) {
            console.error("Error in showBusiness:", error);
            res.status(500).send("An error occurred while displaying the business.");
        }
    }
    
  
   



    // async bookguide (req, res)  {
    //      Check if user is logged in and if there's any specific data to pass to the view
    //     res.render('book-your-guide', { 
    //       user: req.user || null, // Passing user if exists
    //       toggle: req.user ? req.session.toggle : null // Conditionally passing toggle if the user exists
    //     });
    //   };


    // showToursAndTravelsPage(req, res) {
    //     res.render('tours-and-travels', { user: req.user || null ,toggle: req.user ? req.session.toggle : null });
    // }
    // async addNameDetails(req, res) {
    //     const { name, phone, userType } = req.body;
    //     const email = req.session.email;

        

    //     if (!name || !phone || !userType) {
    //         return res.status(400).send('All fields are required');
    //     }

    //     try {
    //         const result = await BusinessModel.insertNameDetails(name, email, phone, userType);
    //         // console.log(result)


    //         res.json({ success: true, message: 'name added successfully!', id: result.insertId });
    //     } catch (error) {
    //         console.error('Database error:', error);
    //         res.status(500).json({ success: false, message: 'Failed to add business' });
    //     }


    // }
    async addBusinessDetails(req, res) {
        try {
            // console.log('Inside addBusinessDetails controller');
            const {

                
                businessName,

                address,
                category,
                phone,
                // latitudeInput,
                // longitudeInput,
                evCharging,
                womenOwned,
                city, 
                state,
                website,
                
            } = req.body;


            // Handle uploaded images
            // const images = req.files ? req.files.map(file => file.filename) : [];

            if (!businessName || !address || !category || !phone  || !city || !state  || !womenOwned) {
                return res.status(400).json({ message: 'All required fields must be provided except website' });
            }

            // Assuming the user is authenticated and `req.user` is populated
            const userId = req.user ? req.user.id : null;

            // Save business details
            const businessId = await BusinessModel.addBusinessDetails(
                businessName,
                address,
                category,
                phone,
                // latitudeInput,
                // longitudeInput,
                city,
                state,
                
                
                website || null,
                
                evCharging,
                womenOwned,
                userId
            );

            // Save images to the database (if any)
            // if (images.length > 0) {
            //     await BusinessModel.addBusinessImages(businessId, images);
            // }

            res.status(201).json({
                message: 'Business details added successfully',
                redirectUrl: '/', // Update with your desired redirect route
            });
        } catch (error) {
            console.error('Error adding business details:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }

    }

   async updateBusinessDetails(req, res) {
    try {
        const { 
            businessId, businessName, address, phone, 
            website = null, state, city, overview, usp, ownerId, 
            businessService1, businessService2, businessService3, businessService4 
        } = req.body;

        // Access images (array) and thumbnail (single file)
        const images = req.files?.['images'] ? req.files['images'].map(file => file.filename) : [];
        const thumbnail = req.files?.['thumbnail'] ? req.files['thumbnail'][0].filename : null;

        // Validate required fields
        if (!businessId || !businessName || !address  || !phone || !state || !city || !overview || !usp || !ownerId) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        // Update business details
        const success = await BusinessModel.updateBusinessDetails(
            businessId, businessName, address, phone, website, state, city, overview, usp,
            businessService1, businessService2, businessService3, businessService4
        );

        if (!success) {
            return res.status(404).json({ success: false, message: 'Business not found or not updated' });
        }

        const baseUrl = `/uploads/${ownerId}/${businessId}`;
        const imageUrls = images.map(filename => `${baseUrl}/${filename}`);

        // Add images to the database if there are any
        if (imageUrls.length > 0) {
            await BusinessModel.addBusinessImages(businessId, imageUrls);
        }

        // Update thumbnail if it exists
        if (thumbnail) {
            const thumbnailUrl = `${baseUrl}/thumbnail/${thumbnail}`;
            await BusinessModel.updateThumbnail(businessId, thumbnailUrl);
        }

        res.json({ success: true, message: 'Business details updated successfully' });

    } catch (error) {
        console.error('Error updating business details:', error);
        res.status(500).json({ success: false, message: 'Failed to update business details. Please try again.' });
    }
}


    async showManageBusiness(req, res) {
        try {
            // Check if the user is logged in
            if (!req.user) {
                return res.redirect('/login');
            }
    
            const businessId = req.params.id;
    
            // Get business details by ID
            const business = await BusinessModel.getBusinessDetailsById(businessId);
            const businessCategory=business.category;
            // console.log(businessCategory)
    
            // Ensure the business exists and belongs to the logged-in user
            if (!business || business.user_id !== req.user.id) {
                return res.redirect('/login');
            }
    
            // Calculate the remaining images
            const maxImages = 7;
            const remainingImages = Math.max(maxImages - business.image_count, 0);
    
            // Fetch business hours and reviews
            const businessHours = await BusinessModel.getBusinessHours(businessId);
            const businessReview = await BusinessModel.getBusinessReview(businessId);
             const categoryByBusiness = await BusinessModel.getCategoryByBusiness(businessCategory);
            //  console.log(categoryByBusiness)
    
            // Render the manage business page with the data
            res.render('manage-business', { 
                user: req.user, 
                business: business, 
                email: req.session.email || null, 
                toggle: req.session.toggle, 
                businessHours: businessHours,
                reviews: businessReview,
                categoryByBusiness,
                
                remainingImages: remainingImages  // Pass the remaining images count to the view
            });
    
        } catch (error) {
            console.error("Error in showManageBusiness:", error);
            res.status(500).send("An error occurred while loading the business management page.");
        }
    }
    
   
    async showEnterBusinessDetails(req, res) {
        try {
            if (!req.user) {
                return res.redirect("/login");
            }
            const businessCategory = await BusinessModel.getBusinessesByCategory();
            res.render('enter-business-details', { user: req.user, toggle: req.session.toggle ,businessCategory });
        } catch (error) {
            console.error("Error in showEnterBusinessDetails:", error);
            res.status(500).send("An error occurred while loading the page.");
        }
    }
    
    async showBusinessDetails(req, res) {
        const businessId = req.params.id;
        let business;
        if (!id) {
            return res.status(400).send('Query parameter is required');
        }

        try {
            business = await BusinessModel.getBusinessDetailsById(businessId);
        }
        catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
        res.render('business-details', { business,user: req.user || null });


    }

    async getAllBusinessDetails(req, res) {
        if (!req.user) {
            return res.status(401).send('Unauthorized4');
        }
        try {
            const businessDetails = await BusinessModel.getAllBusinessDetails();
            res.json(businessDetails);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
    }

    async searchCategory(req, res) {
        // console.log(`user id ${req.user}`)
        const category = req.query.category;
        const sortBy = req.query.sortBy || 'rating';
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = 10; // Number of businesses per page
        const offset = (page - 1) * limit;

        if (!category) {
            return res.status(400).send('category parameter is required');
        }

        try {
            const { businesses, total } = await BusinessModel.getBusinessesByCategoryAndSort(category, sortBy, limit, offset, req.session.toggle);

            // console.log(req.session.toggle)

            const totalPages = Math.ceil(total / limit);
            res.render('list-of-businesses', {
                user: req.user,
                toggle: req.session.toggle,
                businesses,
                category,
                sortBy,
                currentPage: page,
                totalPages
            });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
    }
    async showBusinessDetailsById(req, res) {
        const businessId = req.params.businessId;
    
        try {
            // Fetch business details
            const businessDetails = await BusinessModel.getBusinessDetailsById(businessId); // No need for getBusinessImages
            const offDays = await BusinessModel.getOffDays(businessId);
            const reviewData = await BusinessModel.getReviewCount(businessId);
    
            let hasReviewed = null;
            if (req.user) {
                hasReviewed = await BusinessModel.hasUserReviewed(businessId, req.user.id);
            }
    
            // Extract and format average rating from reviewData
            const averageRating = reviewData?.average_rating 
                ? parseFloat(reviewData.average_rating).toFixed(1) 
                : "No rating"; 
    
            const reviewCount = reviewData?.review_count || 0; 
    
            // If the business details have images, split the string into an array of objects
            const images = businessDetails?.images
                ? businessDetails.images.split("||").map(image => ({ image_source: image }))
                : [];
    
            if (businessDetails && businessDetails.message !== "No business found with the provided ID") {
                res.render('business-details', { 
                    user: req.user || null, 
                    businessDetails, 
                    toggle: req.session.toggle, 
                    hasReviewed: hasReviewed || null, 
                    offDays, 
                    reviewCount,
                    averageRating, // Pass the formatted average rating
                    images // Pass images as an array of objects
                });
            } else {
                res.status(404).send("No business found with the given ID.");
            }
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
    }
    

async updateToggle(req, res) {
    try {
        const { toggleType, value } = req.body; // Expecting "ev" or "women"

        if (!toggleType || typeof value === 'undefined') {
            return res.status(400).json({ success: false, message: "Invalid request. Missing toggleType or value." });
        }

        if (!req.session.toggle) {
            req.session.toggle = { ev: false, women: false };
        }

        if (toggleType in req.session.toggle) {
            req.session.toggle[toggleType] = value; // Update only the relevant toggle
        } else {
            return res.status(400).json({ success: false, message: "Invalid toggle type." });
        }

        res.json({ success: true, message: "Toggle value updated", toggle: req.session.toggle });
    } catch (error) {
        console.error("Error updating toggle:", error);
        res.status(500).json({ success: false, message: "Failed to update toggle. Please try again." });
    }
}
// add review of the websites
    async addTestimonial(req, res) {
        try {
            const { name, city, country, rating, reviews } = req.body;
            // console.log("Request Body:", req.body);
    
            // Ensure user is authenticated
            if (!req.user || !req.user.id) {
                return res.redirect('/login');
            }
    
            const user_id = req.user.id;
            // console.log("User ID:", user_id);
    
            // Validate input
            if (!name || !city || !country || !rating || !reviews) {
                return res.status(400).json({ error: 'All fields are required' });
            }
    
            // Check if the user already has a testimonial
            const existingTestimonial = await BusinessModel.getTestimonialByUserId(user_id);
    
            let result;
            if (existingTestimonial) {
                // Update the existing testimonial
                result = await BusinessModel.updateTestimonial(user_id, name, city, country, rating, reviews);
                return res.redirect('/'); 
            } else {
                // Insert a new testimonial
                result = await BusinessModel.createTestimonial(user_id, name, city, country, rating, reviews);
                return res.redirect('/'); 
            }
    
        } catch (error) {
            console.error('Error adding testimonial:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    
    //  in edit page =========


    async showEditUser(req, res) {
        // Check if user is authenticated
        if (!req.user) {
            return res.redirect('/login'); // Redirect to login page if not logged in
        }
    
        const userId = req.user.id;
    
        try {
            // Fetch user details by ID
            const userDetails = await BusinessModel.getUserByUserId(userId);
    
            if (!userDetails) {
                return res.status(404).send('User not found');
            }
    
            // Assuming the user details contain a toggle value
            const toggle = req.session.toggle || userDetails.toggle || false; // Use session toggle or user-specific toggle
            userDetails.profile_image = userDetails.profile_image
                ? `/uploads/${userDetails.profile_image}` // Adjust the path as needed
                : null;
    
            // Render the edit page with user details and toggle value
            res.render('edit', {
                user: req.user || null,
                userDetails,
                toggle
            });
        } catch (error) {
            console.error("Error fetching user details:", error);
            res.status(500).json({ message: `Server error: ${error.message}` });
        }
    }
    
    // user update information name 

    async updateInformation(req, res) {
        try {
            const { userId, name, phoneNumber, email } = req.body;
            let profileImage = req.file ? req.file.filename : null;
    
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized: User not logged in' });
            }
            // console.log("Updating User ID:", userId);
    
            // Input validation
            if (!name || !phoneNumber) {
                return res.status(400).json({ success: false, message: 'Name and phone number are required' });
            }
    
            // Perform update
            const result = await BusinessModel.updateName(userId, name, phoneNumber, email, profileImage);
            // console.log("Update Result:", result);
    
            if (result.affectedRows === 0) {
                return res.status(200).json({ success: false, message: 'No changes were made' });
            }
    
            // If email is updated, destroy session and force re-login
            if (email) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err);
                        return res.status(500).json({ success: false, message: "Error updating session" });
                    }
                    res.clearCookie("connect.sid");
                    res.json({ 
                        success: true, 
                        message: "Email updated. Please log in again.", 
                        redirect: "/login" 
                    });
                });
                return; 
            }
    
            // Successful update response
            res.status(200).json({ success: true, message: 'User information updated successfully' });
    
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, message: 'Database update failed', details: error.message });
        }
    }
    
    
    
    //rendering footer-review-form
    async formfooter(req, res) {
        try {
            // Ensure user is authenticated
            if (!req.user || !req.user.id) {
                return res.redirect('/login')
            }
    
            const user_id = req.user.id;
    
            // Fetch existing testimonial data for the user
            const existingTestimonial = await BusinessModel.getTestimonialByUserId(user_id);
    
            res.render('form', {
                title: 'Your Form Page',
                user: req.user,      
                toggle: req.session.toggle, 
                testimonial: existingTestimonial // Pass testimonial data to the form
            });
    
        } catch (error) {
            console.error('Error rendering the form:', error.message);
            res.status(500).send('Error rendering the form');
        }
    }
    

    // Method to search for businesses based on location and category
    async searchBusiness(req, res) {
        const city = req.query.city;  // Location query parameter from the request
        const category = req.query.category; // Category query parameter from the request
        const toggles = req.session.toggle || {}; // Retrieve toggle state from session (default to empty object)
    
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = 10; // Number of businesses per page
        const offset = (page - 1) * limit; // Calculate offset for pagination
    
        // Check if either city or category is provided
        if (!city && !category) {
            return res.status(400).json({ error: "At least one of location or category must be provided" });
        }
    
        try {
            // Fetch businesses based on city, category, toggles, and pagination
            const { businesses, total } = await BusinessModel.filterBusiness(city, category, toggles, limit, offset);
            
            // console.log(businesses);
    
            // Calculate total pages for pagination
            const totalPages = Math.ceil(total / limit);
    
            // Render the results
            res.render('show-business', {
                businesses,  // Businesses fetched from the model
                category,      // Category from query (if provided)
                query: city,   // Location query from the search
                user: req.user, // User information from session (if available)
                toggle: toggles, // Toggle values from session (if available)
                currentPage: page,
                totalPages
            });
    
        } catch (error) {
            console.error("Error fetching businesses:", error);
            res.status(500).json({ error: "Failed to fetch businesses" });
        }
    }
    
    
//show what we do function 
async showWhatWeDo(req, res) {
    try {
        const toggle = req.session.toggle || false;

        res.render('what-we-do', {
            toggle, // Pass session toggle state
            user: req.user // Pass user details (logged-in user)
        });
    } catch (error) {
        console.error("Error in showWhatWeDo:", error);
        res.status(500).send("An error occurred while loading the page.");
    }
}

async findWhatYouWant(req, res) {
    try {
        const toggle = req.session.toggle || false;

        res.render('find-what-you-want', {
            toggle, // Pass session toggle state
            user: req.user // Pass user details (logged-in user)
        });
    } catch (error) {
        console.error("Error in findWhatYouWant:", error);
        res.status(500).send("An error occurred while loading the page.");
    }
}

async setupYourBusiness(req, res) {
    try {
        const toggle = req.session.toggle || false;

        res.render('setup-your-business', {
            toggle, // Pass session toggle state
            user: req.user // Pass user details (logged-in user)
        });
    } catch (error) {
        console.error("Error in setupYourBusiness:", error);
        res.status(500).send("An error occurred while loading the page.");
    }
}



    async addBusinessHours(req, res) {
        try {
            const { businessId, schedule } = req.body;
    
            // Logging received values for debugging
        //    console.log ("Received Data:");
        //     console.log("Business ID:", businessId);
        //     console.log("Schedule:", schedule);
    
            // Validate the schedule to ensure it contains all 7 days with the correct data
            if (!schedule || schedule.length !== 7) {
                return res.status(400).json({ error: "Schedule must contain 7 days" });
            }
    
            // For each day, check if the opening and closing time are 'CLOSED'
            for (const daySchedule of schedule) {
                if (daySchedule.openingTime !== "CLOSED" && daySchedule.closingTime !== "CLOSED") {
                    // Validate the time formats if needed (you can use regex or Date validation)
                    // if (!isValidTime(daySchedule.openingTime) || !isValidTime(daySchedule.closingTime)) {
                    //     return res.status(400).json({ error: `Invalid time format for ${daySchedule.day}` });
                    // }
                }
            }
    
            // Insert or update business hours for the business
            const result = await BusinessModel.insertBusinessHours(businessId, schedule);
    
            // Respond with success message
            res.json({ message: "Business hours added/updated successfully", data: result });
    
        } catch (error) {
            console.error("Error in addBusinessHours:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
    
    
    async updateBusinessHours(req, res) {
        try {
            const { businessId, selectedDays, opening_time, closing_time } = req.body;
    
            // Log incoming request data for debugging
            // console.log("Received request to update business hours:");
            // console.log("businessId:", businessId);
            // console.log("selectedDays:", selectedDays);
            // console.log("opening_time:", opening_time);
            // console.log("closing_time:", closing_time);
    
            // Call the businessModel to update business hours
            const result = await BusinessModel.updateBusinessHours(businessId, selectedDays, opening_time, closing_time);
    
            // Log the result of the database update
            // console.log("Database update result:", result);
    
            // Send success response
            res.json({ message: "Business hours updated successfully" });
        } catch (error) {
            // Log the error if any occurs
            // console.error("Error updating business hours:", error);
    
            // Send error response
            res.status(500).json({ error: error.message });
        }
    }

    async getBusinessHours(req, res) {
        try {
            const { businessId } = req.params; // Get the businessId from request parameters
            
            // Fetch business hours using the model
            const businessHours = await BusinessModel.getBusinessHours(businessId);
    
            // Send the fetched data back to the frontend
            res.json({ businessHours });
        } catch (error) {
            console.error('Error fetching business hours:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async addWhosbestReview(req, res) {
        try {
            const { name, rating, address, message } = req.body;
            const userId = req.user.id;
    
            if (!name || !rating || !address || !message) {
                return res.status(400).json({ error: "All fields are required" });
            }
    
            const result = await BusinessModel.insertWhosBestReview(name, rating, address, message, userId);
    
            return res.status(201).json({ message: "Review added successfully", reviewId: result.insertId });
        } catch (error) {
            console.error("Error adding review:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }


    // login page 
    userLogin(req, res) {
        try {
            if (req.user) {
                return res.redirect('/');  // ✅ Return to prevent multiple responses
            }
    
            res.render('login', { toggle: req.session.toggle });
        } catch (error) {
            console.error("Error in userLogin:", error);
            res.status(500).send("An error occurred while loading the login page.");
        }
    }
    
    //   business Profile render page
    async businessProfile(req, res) {
        try {
            res.render('business-profile', { 
                user: req.user, // Pass user data if exists
                toggle: req.session.toggle // Pass toggle value if user exists
            });
        } catch (error) {
            console.error("Error in businessProfile:", error);
            res.status(500).send("An error occurred while loading the business profile page.");
        }
    }
    

// delete business 

static async deleteBusiness(req, res) {
    const { businessId } = req.params;
    
    // if (!req.user) {
    //     return res.status(401).send('Unauthorized');
    // }

    try {
        const deleted = await BusinessModel.deleteBusinessById(businessId);
        if (deleted) {
            return res.redirect('/your-business/<%user.id%>'); // Redirect after successful deletion
        } else {
            return res.status(403).send("You don't have permission to delete this business.");
        }
    } catch (error) {
        console.error("Error deleting business:", error);
        res.status(500).send("Failed to delete business");
    }
}

// comming -soon 
comingSoon(req, res) {
    try {
        res.render('coming-soon', { 
            user: req.user, 
            toggle: req.session.toggle 
        });
    } catch (error) {
        console.error("Error in comingSoon:", error);
        res.status(500).send("An error occurred while loading the coming soon page.");
    }
}

async showDriverDashboard(req,res){
    try{
        if (!req.user) {
            // return res.status(401).json({ message: "Unauthorized" });
            return res.redirect('/login')
        }
        const userId = req.user ? req.user.id : null;
        const driverDetails = userId ? await BusinessModel.getDriverByUserId(userId) : null;

        if (!driverDetails) {
            return res.redirect('/register-driver');
        }

        res.render('driver-dashboard',{
            user: req.user,
                userId,
                toggle: req.session.toggle,
                driverDetails
        })
        
    } catch (error) {
        console.error('Error fetching driver details:', error);
        res.status(500).send('Internal Server Error');
    }

}
async showPinkDriverDashboard(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        const userId = req.user ? req.user.id : null;
        const driverDetails = userId ? await BusinessModel.getPinkDriverByUserId(userId) : null;

        if (!driverDetails) {
            return res.redirect('/register-pink-driver');
        }

        res.render('pink-driver-dashboard', {
            user: req.user,
            userId,
            toggle: req.session.toggle,
            driverDetails
        });

    } catch (error) {
        console.error('Error fetching driver details:', error);
        res.status(500).send('Internal Server Error');
    }
}

async  showDriverRegistration(req, res) {
    try {
        if (!req.user) {
            // return res.status(401).json({ message: "Unauthorized" });
            return res.redirect('/login')
        }
        const userId = req.user ? req.user.id : null;
        const driverDetails = userId ? await BusinessModel.getDriverByUserId(userId) : null;
        console.log(driverDetails)

        if (driverDetails) {
           res.redirect('/driver-dashboard')
        }
        else{
            res.render('driver-registration', {
                user: req.user,
                userId,
                toggle: req.session.toggle,
                driverDetails
            });
        }

       
    } catch (error) {
        console.error('Error fetching driver details:', error);
        res.status(500).send('Internal Server Error');
    }
}
async showPinkDriverRegistration(req,res){
    try {
        if (!req.user) {
            // return res.status(401).json({ message: "Unauthorized" });
            return res.redirect('/login')
        }
        const userId = req.user ? req.user.id : null;
        const driverDetails = userId ? await BusinessModel.getPinkDriverByUserId(userId) : null;
        // console.log(driverDetails)

        if (driverDetails) {
           res.redirect('/pink-driver-dashboard')
        }
        else{
            res.render('pink-driver-registration', {
                user: req.user,
                userId,
                toggle: req.session.toggle,
                driverDetails
            });
        }

       
    } catch (error) {
        console.error('Error fetching driver details:', error);
        res.status(500).send('Internal Server Error');
    }
}

async registerDriver(req, res) {
    try {
        

        const {
            driverUserId, name, phone, email, age, gender, experience,
            city, state, vehicleType, vehicleName, licensePlate,
            currentAddress, licenseAddress, licenseNumber
        } = req.body;

        // Check if required fields are missing
        if (!driverUserId || !name || !phone || !email || !age || !gender || !experience ||
            !city || !state || !vehicleType || !vehicleName || !licensePlate ||
            !currentAddress || !licenseAddress || !licenseNumber) {
            return res.status(400).json({ message: 'All fields are required', isSuccess: false });
        }

        // Check if email, licenseNumber, or licensePlate already exist
        const existingDriver = await BusinessModel.checkExistingDriver(email, licenseNumber, licensePlate);

        if (existingDriver) {
            return res.status(400).json({ message: 'Driver with provided email, license number, or license plate already exists', isSuccess: false });
        }

        // Define base path for driver uploads
        const basePath = `uploads/${driverUserId}/driver/`;

        // Get uploaded files from Multer with full path
        const vehicleImage = req.files['vehicleImage'] ? basePath + req.files['vehicleImage'][0].filename : null;
        const licenseFront = req.files['licenseFront'] ? basePath + req.files['licenseFront'][0].filename : null;
        const licenseBack = req.files['licenseBack'] ? basePath + req.files['licenseBack'][0].filename : null;
        const driverPhoto = req.files['driverPhoto'] ? basePath + req.files['driverPhoto'][0].filename : null;

        if (!vehicleImage || !licenseFront || !licenseBack || !driverPhoto) {
            return res.status(400).json({ message: 'All required images must be uploaded', isSuccess: false });
        }

        // Prepare data for database insertion
        const driverData = {
            driverUserId, name, phone, email, age, gender, experience,
            city, state, vehicleType, vehicleName, licensePlate,
            currentAddress, licenseAddress, licenseNumber,
            vehicleImage, licenseFront, licenseBack, driverPhoto
        };

        // Insert new driver
        await BusinessModel.registerDriver(driverData);
        res.status(201).json({ message: 'Driver registered successfully', redirectUrl: '/driver-dashboard', isSuccess: true });

    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).json({ message: 'Internal server error', isSuccess: false });
    }
}

async registerPinkDriver(req, res) {
    try {
        const {
            driverUserId, name, phone, email, age, experience,
            city, state, vehicleType, vehicleName, licensePlate,
            currentAddress, licenseAddress, licenseNumber
        } = req.body;

        // Check if the driver already exists
        const existingDriver = await BusinessModel.checkPinkExistingDriver(email, licenseNumber, licensePlate);
        if (existingDriver) {
            return res.status(400).json({ 
                message: 'Driver with provided email, license number, or license plate already exists', 
                isSuccess: false 
            });
        }

        // Define base path for driver uploads
        const basePath = `uploads/${driverUserId}/driver/`;

        // Get uploaded files from Multer with full path
        const vehicleImage = req.files['vehicleImage'] ? basePath + req.files['vehicleImage'][0].filename : null;
        const licenseFront = req.files['licenseFront'] ? basePath + req.files['licenseFront'][0].filename : null;
        const licenseBack = req.files['licenseBack'] ? basePath + req.files['licenseBack'][0].filename : null;
        const driverPhoto = req.files['driverPhoto'] ? basePath + req.files['driverPhoto'][0].filename : null;

        // Ensure all images are uploaded
        if (!vehicleImage || !licenseFront || !licenseBack || !driverPhoto) {
            return res.status(400).json({ 
                message: 'All required images must be uploaded', 
                isSuccess: false 
            });
        }

        // Prepare data for database insertion
        const driverData = {
            driverUserId, name, phone, email, age, experience,
            city, state, vehicleType, vehicleName, licensePlate,
            currentAddress, licenseAddress, licenseNumber,
            vehicleImage, licenseFront, licenseBack, driverPhoto
        };

        // Insert driver data into the database
        const insertResult = await BusinessModel.registerPinkDriver(driverData);

        if (insertResult) {
            return res.status(201).json({ 
                message: 'Pink Driver registered successfully', 
                redirectUrl: '/pink-driver-dashboard', 
                isSuccess: true 
            });
        } else {
            return res.status(500).json({ 
                message: 'Failed to register driver, please try again', 
                isSuccess: false 
            });
        }

    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).json({ 
            message: 'Internal server error', 
            isSuccess: false 
        });
    }
}

 async updateDriverStatus(req, res) {
    try {
        const {  status } = req.body;
        const userId = req.user.id;

        // Ensure status is only 1 or 0
        if (![0, 1].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const result = await BusinessModel.updateDriverStatus(userId, status);

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: 'Status updated successfully' });
        } else {
            return res.json({ success: false, message: 'No rows affected' });
        }
    } catch (error) {
        console.error('Error updating driver status:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
async updatePinkDriverStatus(req, res) {
    try {
        const {  status } = req.body;
        const userId = req.user.id;

        // Ensure status is only 1 or 0
        if (![0, 1].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const result = await BusinessModel.updatePinkDriverStatus(userId, status);

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: 'Status updated successfully' });
        } else {
            return res.json({ success: false, message: 'No rows affected' });
        }
    } catch (error) {
        console.error('Error updating driver status:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

showTaxiPage(req, res) {
    try {
        res.render('book-your-taxi', { user: req.user || null, toggle: req.session.toggle });
    } catch (error) {
        console.error('Error rendering book-your-taxi page:', error);
        res.status(500).send('Internal Server Error');
    }
}


async  showAvailableTaxi(req, res) {
    try {
        if (!req.user) {
            // return res.status(401).json({ message: "Unauthorized" });
            return res.redirect('/login')
        }
        const availableTaxis = await BusinessModel.getAvailableTaxis();

        // console.log("Available Taxis:", availableTaxis); // Debugging log

        res.render('available-taxis', {  // Render your EJS page
            user: req.user,
            availableTaxis,
            toggle: req.session.toggle
        });
    } catch (error) {
        console.error("Error fetching available taxis:", error);
        res.status(500).send("Internal Server Error");
    }
}

async  showAvailablePinkTaxi(req, res) {

    try {
        if (!req.user) {
            // return res.status(401).json({ message: "Unauthorized" });
            return res.redirect('/login')
        }
        const availableTaxis = await BusinessModel.getAvailablePinkTaxis();

        // console.log("Available Taxis:", availableTaxis); // Debugging log

        res.render('available-pink-taxi', {  // Render your EJS page
            user: req.user,
            availableTaxis,
            toggle: req.session.toggle
        });
    } catch (error) {
        console.error("Error fetching available taxis:", error);
        res.status(500).send("Internal Server Error");
    }
}


    
}









