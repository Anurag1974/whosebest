import db from '../config/db.js';
import session from 'express-session';
import nodemailer from 'nodemailer';
import BusinessModel from '../models/busines.model.js';
import { generateToken } from '../utils/jwt.js';
import GlobalToggleService from '../services/globalToggleService.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
export default class BusinessController {

    async showOwnListedBusinessList(req, res) {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }
        try {
            const registeredBusiness = await BusinessModel.getRegisteredBusiness(req.user.id);
            res.render('your-business', { user: req.user, registeredBusiness });
        }
        catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
    }
    showNamePage(req, res) {
        if (!req.user) {
            return res.status(401).send('Unauthorizd');
        }
        res.render('enter-your-details', { user: req.user });
    }
    showRatePage(req, res) {
        // if (!req.user) {
        //     return res.redirect('/login');
        // }
        const businessId = req.params.id;
        res.render('rate', { user: req.user , businessId, toggle:null});
    }
    async submitReview(req, res) {
        const { rating, review } = req.body;
        const businessId = req.params.businessId;

        if(!rating || !review){

        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not logged in' });
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
    async showHome(req, res) {
        console.log(`User: ${req.user}`);
        const paidAdvertisements = await BusinessModel.getPaidAdvertisements();
        res.render('home', { user: req.user || null, toggle: req.session.toggle ,  paidAdvertisements: paidAdvertisements || 1 });




    }
    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }
    showBusiness(req, res) {
        const { location, business } = req.body;
        console.log(location, business)

        res.render('business', { location, business });

    }
    businessLogin(req, res) {

        // console.log(generateOTP());
        res.render('business-login', { user: req.user, message: null })

    }
    showTaxiPage(req, res) {
        res.render('book-your-taxi', { user: req.user || null });
    }
    showToursAndTravelsPage(req, res) {
        res.render('tours-and-travels', { user: req.user || null });
    }
    async addNameDetails(req, res) {
        const { name, phone, userType } = req.body;
        const email = req.session.email;

        if (!name || !phone || !userType) {
            return res.status(400).send('All fields are required');
        }

        try {
            const result = await BusinessModel.insertNameDetails(name, email, phone, userType);
            console.log(result)


            res.json({ success: true, message: 'name added successfully!', id: result.insertId });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Failed to add business' });
        }


    }
    async addBusinessDetails(req, res) {
        if (!req.user) {
            return res.status(401).send('Unauthorized2');
        }
        const { businessName, pincode, city, state, category, phone, latitudeInput, longitudeInput, website } = req.body;
        if (!businessName || !pincode || !city || !state || !category || !phone || !latitudeInput || !longitudeInput) {
            return res.status(400).send('All fields are required');
        }
        try {
            const userId = await BusinessModel.addBusinessDetails(businessName, pincode, city, state, category, phone, latitudeInput, longitudeInput, website);

            const email = req.session.email;
            await BusinessModel.setOwner(email);
            const redirectUrl = `/manage-business/${userId}`;



            res.json({ redirectUrl, success: true, message: 'Business details added successfully', });
        }
        catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Failed to add business' });
        }


    }

    async showManageBusiness(req, res) {
        if (!req.user) {
            return res.status(401).send('Unauthorized3');
        }
        const business = await BusinessModel.getBusinessDetailsById(req.params.id);
        console.log(business);
        res.render('manage-business', { user: req.user, business: business, email: req.session.email || null });
    }
    showEnterBusinessDetails(req, res) {

        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }
        res.render('enter-business-details', { user: req.user });
    }

    async sendOtp(req, res) {
        const { email } = req.body;
        console.log(email);
        if (!email) {
            return res.status(400).send('email is required')
        }
        const otp = generateOTP();
        req.session.otp = otp;
        req.session.email = email;
        console.log('Email stored in session:', req.session.email);


        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };
        try {
            await transporter.sendMail(mailOptions);


            const emailIsPresent = await BusinessModel.getEmail(email);
            console.log(`email status in send otp is email is present: ${emailIsPresent}`);
            res.status(200).json({ success: true, message: 'OTP sent successfully', emailIsPresent });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to send email' });
        }

    }
    async verifyOtpHandler(req, res) {
        const { otp } = req.body;

        if (!otp) {
            console.log('OTP is missing');
            return res.status(400).send('OTP is required');
        }



        if (req.session.otp === otp) {
            console.log('OTP is valid');
            const token = generateToken({ email: req.session.email });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            req.session.otp = null;
            const email = req.session.email;
            console.log(`The email is ${email}`);

            const emailIsPresent = await BusinessModel.getEmail(email);
            if (emailIsPresent) {
                try {
                    const { user_type, user_id } = await BusinessModel.getUserByEmail(email);
                    // console.log(`Business owner: ${businessOwner}`);

                    if (user_type === 'business_owner') {
                        console.log('User is business owner');

                        console.log('Token set in cookie, redirecting to /manage-business');
                        return res.json({ redirectUrl: '/manage-business/user_id=' + user_id }); // Redirect to manage-business
                    } else {
                        console.log('user is the customer');
                        const token = generateToken({ email: email, user_id });
                        res.cookie('token', token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            maxAge: 24 * 60 * 60 * 1000 // 24 hours
                        });
                        console.log('Token set in cookie, redirecting to /enter-business-details');
                        return res.json({ redirectUrl: '/enter-business-details' }); // Redirect to enter-business-details
                    }
                } catch (error) {
                    console.error('Database error while fetching business owner:', error);
                    return res.status(500).send('An error occurred while checking the email'); // Ensure return
                }

            } else {
                const email = req.session.email;
                const user_type = 'customer';
                const { userName, userPhone } = req.body;
                console.log(`The email is ${email}, the name is ${userName}, the phone is ${userPhone}`);
                try {
                    const result = await BusinessModel.insertNameDetails(userName, email, userPhone, user_type);
                    console.log(result);
                    res.json({ redirectUrl: '/enter-business-details', success: true, message: 'name added successfully!', id: result.insertId });
                } catch (error) {
                    console.error('Database error:', error);
                    res.status(500).json({ success: false, message: 'Failed to add business' });
                }
            }






        } else {
            console.log('Invalid OTP');
            return res.status(400).send('Invalid OTP. Please try again.'); // Ensure return
        }
    }
    async verifyOtpHandlerPopupPage(req, res) {

        console.log('Request received:', req.body);

        const { otp, userName, userPhone } = req.body;

        if (!otp) {
            console.log('OTP is missing');
            return res.status(400).send('OTP is required');
        }

        if (req.session.otp !== otp) {
            console.log('Invalid OTP');
            return res.status(400).send('Invalid OTP. Please try again.');
        }

        console.log('OTP is valid');
        req.session.otp = null; // Clear OTP after verification

        const email = req.session.email;
        console.log(`The email is ${email}`);
        try {

            const emailIsPresent = await BusinessModel.getEmail(email);
            if (emailIsPresent) {
                const { user_type, user_id } = await BusinessModel.getUserByEmail(email);
                console.log(`User type: ${user_type}, User ID: ${user_id}`);

                // Generate JWT token and set cookie
                const token = generateToken({ email, user_id, user_type });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                });

                // Redirect based on user type
                const redirectUrl = '/';

                console.log(`Redirecting to ${redirectUrl}`);
                return res.json({ redirectUrl });
            } else {
                if (!userName || !userPhone) {
                    return res.status(400).json({ message: 'User name and phone are required for registration.' });
                }

                const user_type = 'customer';
                console.log(`New user details - Email: ${email}, Name: ${userName}, Phone: ${userPhone}`);

                const result = await BusinessModel.insertNameDetails(userName, email, userPhone, user_type);
                const user_id = result.insertId;

                // Generate JWT token and set cookie
                const token = generateToken({ email, user_id, user_type });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000,
                });

                console.log('New user registered successfully');
                return res.json({
                    redirectUrl: '/',
                    success: true,
                    message: 'User registered successfully!',
                    id: user_id,
                });

            }



        }
        catch (error) {
            console.error('Error during OTP verification or user handling:', error);
            return res.status(500).send('An internal server error occurred');
        }


    }
    async showBusinessDetails(req, res) {
        const businessId = req.params.id;
        if (!id) {
            return res.status(400).send('Query parameter is required');
        }
    
        try {
            const business = await BusinessModel.getBusinessDetailsById(businessId);
        }
        catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
        res.render('business-details', { user: req.user || null });


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
        console.log(`user id ${req.user}`)
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
        const id = req.params.id;
        if (!id) {
            return res.status(400).send('Query parameter is required');
        }
        try {
            const businessDetails = await BusinessModel.getBusinessDetailsById(id);
            const hasReviewed = await BusinessModel.hasUserReviewed(req.user.id, id);
    
            if (businessDetails && businessDetails.message !== "No business found with the provided ID") {
                console.log("Business Details for Rendering: ", businessDetails);
                
                res.render('business-details', { user: req.user, businessDetails, toggle: req.session.toggle,  hasReviewed : hasReviewed });
            } else {
                res.status(404).send("No business found with the given ID.");
            }
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
    }

    // reviewsss===========================================================================

    async addReview(req, res) {
        const { businessId, userId, rating, review } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        try {
            await Reviews.addReview(businessId, userId, rating, review);
            res.status(201).json({ message: "Review added successfully!" });
        } catch (err) {
            res.status(500).json({ message: "Error adding review", error: err.message });
        }


    }
    updateToggle(req, res) {
        const { toggle } = req.body;
        req.session.toggle = toggle;
        console.log(req.session.toggle);
        if(toggle){

        }
        res.json({ message: 'Toggle value updated in session' });


    }




}