import db from '../config/db.js';
import session from 'express-session';
import nodemailer from 'nodemailer';
import BusinessModel from '../models/busines.model.js';
import { generateToken } from '../utils/jwt.js';
import GlobalToggleService from '../services/globalToggleService.js';
import uploadMiddleware from '../middleware/multerMiddleware.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
export default class BusinessController {

    async showOwnListedBusinessList(req, res) {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }
        try {
            const registeredBusiness = await BusinessModel.getRegisteredBusiness(req.user.id);
            res.render('your-business', { user: req.user, registeredBusiness, toggle: req.session.toggle });
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
        res.render('rate', { user: req.user, businessId, toggle: null });
    }
    async submitReview(req, res) {
        const { rating, review } = req.body;
        const businessId = req.params.businessId;

        if (!rating || !review) {

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
    async deleteReview(req, res) {
        try {
            const { id } = req.params;

            console.log('in the controller of delete review')

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
    async showHome(req, res) {
        console.log(`User: ${req.user}`);
        const paidAdvertisements = await BusinessModel.getPaidAdvertisements();
        const businessCounts = await BusinessModel.getBusinessCount(req.session.toggle);

        // top rated business

        const topRatedBusinesses = await BusinessModel.getTopRatedBusinessPerCategory();
        res.render('home', { user: req.user || null, toggle: req.session.toggle ,  paidAdvertisements: paidAdvertisements || 1, businessCounts , topRatedBusinesses: topRatedBusinesses || [] });
    }
    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }
    showBusiness(req, res) {
        const { location, business } = req.body;
        console.log(location, business)

        res.render('show-business', { location, business,toggle: req.session.toggle,user: req.user });

    }
    showbusinessLogin(req, res) {

        // console.log(generateOTP());
        res.render('business-login', { user: req.user, message: null, toggle: req.session.toggle })

    }
    showTaxiPage(req, res) {
        res.render('book-your-taxi', { user: req.user || null, toggle: req.user ? req.user.toggle : null });
    }
    // Method to render the "Book Your Guide" form
    async bookguide (req, res)  {
        // Check if user is logged in and if there's any specific data to pass to the view
        res.render('book-your-guide', { 
          user: req.user || null, // Passing user if exists
          toggle: req.user ? req.user.toggle : null // Conditionally passing toggle if the user exists
        });
      };
    showToursAndTravelsPage(req, res) {
        res.render('tours-and-travels', { user: req.user || null ,toggle: req.user ? req.user.toggle : null });
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
       
        // Extract business details from request body
        const { businessName, pincode, address, category, phone, latitudeInput, longitudeInput , website = null} = req.body;
        
         // Handle uploaded images
         const images = req.files ? req.files.map(file => file.filename) : [];
         if (!businessName || !pincode || !address || !category || !phone || !latitude || !longitude) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }
        const userId = req.user.id ;

       
        try {
            const userId2 = await BusinessModel.addBusinessDetails(businessName, pincode, address, category, phone, latitudeInput, longitudeInput, website, userId);

            const email = req.user.email;
            console.log(`email in session is ${email}`)
            await BusinessModel.setOwner(email);
            const redirectUrl = `/manage-business/${userId2}`;



            res.json({ redirectUrl, success: true, message: 'Business details added successfully', });
        }
        catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Failed to add business' });
        }


    }
    //update business details 
    static async updateBusinessDetails(req, res) {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        console.log('Button clicked - Updating business details');

        // Extract business details from request body
        const { businessId, businessName, address, category, phone, website = null, state, city } = req.body;

        console.log('Received Business Data for Update:', req.body);

        // Validate required fields
        if (!businessId || !businessName || !address || !category || !phone || !state || !city) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        try {
            // Update business details in the database
            const success = await BusinessModel.updateBusinessDetails(businessId, businessName, address, category, phone, website, state, city);

            if (!success) {
                return res.status(404).json({ success: false, message: 'Business not found or not updated' });
            }

            res.json({ success: true, message: 'Business details updated successfully' });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Failed to update business' });
        }
    }

    
    static async getBusinessById(req, res) {
        const { businessId } = req.params;

        try {
            const business = await BusinessModel.getBusinessById(businessId);
            if (!business) {
                return res.status(404).json({ success: false, message: 'Business not found' });
            }
            res.json({ success: true, business });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch business details' });
        }
    }


    // async addBusinessDetails(req, res) {
    //     // Use Multer middleware to handle file uploads
    //     uploadMiddleware(req, res, async (err) => {
    //         if (err) {
    //             return res.status(400).send(err.message); // Handle file upload errors
    //         }

    // if (!req.user) {
    //     return res.status(401).send('Unauthorized'); // User not logged in
    // }

    // // Extract business details from request body
    // const { businessName, pincode, address, category, phone, latitudeInput, longitudeInput , website = null} = req.body;

    //         // Validate required fields
    //         if (!businessName || !pincode || !address || !category || !phone || !latitudeInput || !longitudeInput ) {
    //             return res.status(400).send('All fields are required');
    //         }

    //         try {
    //             // Get file paths of uploaded images
    //             // const businessImages = req.files.map((file) => `/uploads/${file.filename}`);

    //             // Save business details and images to the database
    //             const businessId = await BusinessModel.addBusinessDetails(
    //                 businessName, pincode, address, category, phone, latitudeInput, longitudeInput, website
    //             );

    //             // Redirect user after successful addition
    //             const redirectUrl = `/manage-business/${businessId}`;
    //             res.json({
    //                 success: true,
    //                 message: 'Business details added successfully',
    //                 redirectUrl,
    //             });
    //         } catch (error) {
    //             console.error('Database error:', error);
    //             res.status(500).json({ success: false, message: 'Failed to add business' });
    //         }
    //     });
    // }

    async showManageBusiness(req, res) {
        if (!req.user) {
            return res.status(401).send('Unauthorized3');
        }
        const business = await BusinessModel.getBusinessDetailsById(req.params.id);
        console.log(business);
        res.render('manage-business', { user: req.user, business: business, email: req.session.email || null, toggle: req.session.toggle });
    }
    showEnterBusinessDetails(req, res) {

        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }
        res.render('enter-business-details', { user: req.user, toggle: req.user.toggle });
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
        const businessId = req.params.businessId;
        if (!businessId) {
            return res.status(400).send('Query parameter is required');
        }
        try {
            const businessDetails = await BusinessModel.getBusinessDetailsById(businessId);
            let hasReviewed = null;
            if (req.user) {
                hasReviewed = await BusinessModel.hasUserReviewed(req.user.id, businessId);
            }


            if (businessDetails && businessDetails.message !== "No business found with the provided ID") {
                console.log("Business Details for Rendering: ", businessDetails);

                res.render('business-details', { user: req.user || null, businessDetails, toggle: req.session.toggle, hasReviewed: hasReviewed || null });
            } else {
                res.status(404).send("No business found with the given ID.");
            }
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Failed to fetch business details" });
        }
    }

    
    updateToggle(req, res) {
        const { toggle } = req.body;
        req.session.toggle = toggle;
        console.log(req.session.toggle);
        if (toggle) {

        }
        res.json({ message: 'Toggle value updated in session' });


    }
    async addTestimonial(req, res){
        try {
            const { name, location, stars, comment } = req.body;
            const userId = req.user.id;
    
            // Validate input
            if (!user_id || !name || !location || !stars || !comment) {
                return res.status(400).json({ error: 'All fields are required' });
            }
    
            const result = await BusinessModel.createTestimonial({
                userId,
                name,
                location,
                stars,
                comment,
            });
    
            res.status(201).json({
                message: 'Testimonial added successfully',
                id: result.insertId,
            });
        } catch (error) {
            console.error('Error adding testimonial:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    //  in edit page =========


    async showEditUser(req, res) {

        const userId = req.user.id;


        // Check if ID is provided
        if (!userId) {
            return res.status(400).send('Query parameter is required');
        }

        try {
            // Fetch business details by ID
            const userDetails = await BusinessModel.getUserByUserId(userId);

            if (!userDetails) {
                return res.status(404).send('Business not found');
            }

            // Assuming the business details contain a toggle value
            const toggle = req.session.toggle || userDetails.toggle || false; // Use session toggle or the business-specific toggle
            userDetails.profile_image = userDetails.profile_image
            ? `/uploads/${userDetails.profile_image}` // Adjust the path as needed
            : null;

            // Render the edit page with business details and the toggle value
            res.render('edit', {
                user: req.user || null,
                userDetails,
                toggle
            });
        } catch (error) {
            // Send an error response if something goes wrong
            res.status(500).json({ message: `Server error: ${error.message}` });
        }
    }






    //  async editUser(req, res) {
    //     const id = req.params.id;

    //     // Check if ID is provided
    //     if (!id) {
    //         return res.status(400).send('Query parameter is required');
    //     }

    //     try {
    //         // Fetch business details by ID
    //         const businessDetails = await BusinessModel.getBusinessDetailsById(id);

    //         if (!businessDetails) {
    //             return res.status(404).send('Business not found');
    //         }

    //         // Assuming the business details contain a toggle value
    //         const toggle = req.session.toggle || businessDetails.toggle || false; // Use session toggle or the business-specific toggle

    //         // Render the edit page with business details and the toggle value
    //         res.render('edit', { 
    //             user: req.user,
    //             // user:req.name, 
    //             businessDetails, 
    //             toggle 
    //         });
    //     } catch (error) {
    //         console.error('Database error:', error);
    //         res.status(500).json({ error: "Failed to fetch business details" });
    //     }
    // }

    // user update information name 

    async updateInformation(req, res) {
        try {
            const { name, phoneNumber } = req.body;
            const userId = req.user?.id; // Ensure `req.user` exists
            let profileImage = req.file ? req.file.filename : null; 
    
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: User not logged in' });
            }
    
            // Input validation
            if (!name || !phoneNumber) {
                return res.status(400).json({ message: 'Name and phone number are required' });
            }
    
           
    
            console.log(`User ID ${userId} update attempt: name = "${name}", phoneNumber = "${phoneNumber}"`);
    
            const result = await BusinessModel.updateName(userId, name, phoneNumber, profileImage);
    
            if (result.affectedRows === 0) {
                return res.status(200).json({ message: 'No changes were made' }); // Handle unchanged data
            }
    
            res.status(200).json({ message: 'User information updated successfully' });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Database update failed', details: error.message });
        }

        
    }



    //rendering footer-review-form
    async formfooter (req, res) {
        try {
          res.render('form', {
            title: 'Your Form Page',
            user: req.user,          // Passing user info from the request
            toggle: req.user?.toggle // Optional chaining to avoid errors if user is undefined
          });
        } catch (error) {
          res.status(500).send('Error rendering the form');
        }
      }; 


    // Method to search for businesses based on location and category
    async searchBusiness(req, res) {
        
        const query = req.query.city;  // Location query parameter from the request
        const category = req.query.category; // Category query parameter from the request
        const toggle = req.session.toggle || false; // Retrieve toggle state from session (if any)

        // Check if either location or category is provided
        if (!query && !category) {
            return res.status(400).json({ error: "At least one of location or category must be provided" });
        }

        try {
            // Fetch businesses based on location and/or category
            const businesses = await BusinessModel.filterBusiness(query, category);
            console.log(businesses)
            // Render the results or return the data
            res.render('show-business', {
                businesses: businesses,  // Businesses fetched from the model
                category: category,      // Category from query (if provided)
                query: query,            // Location query from the search
                user: req.user,          // User information from session (if available)
                toggle: toggle           // Toggle value from session (if available)
            });

        } catch (error) {
            console.error("Error fetching businesses:", error);
            res.status(500).json({ error: "Failed to fetch businesses" });
        }
    }
//show what we do function 
    async showWhatWeDo(req,res){
        const toggle = req.session.toggle || false;

        res.render('what-we-do', {
                   // Pass the list of services to the view
            toggle , // Pass session toggle state
            user: req.user       // Pass user details (logged-in user)
        });

    }
    async findWhatYouWant(req,res){
        const toggle = req.session.toggle || false;

        res.render('find-what-you-want', {
                   // Pass the list of services to the view
            toggle , // Pass session toggle state
            user: req.user       // Pass user details (logged-in user)
        });

    }
    async setupYourBusiness(req,res){
        const toggle = req.session.toggle || false;

        res.render('setup-your-business', {
                   // Pass the list of services to the view
            toggle , // Pass session toggle state
            user: req.user       // Pass user details (logged-in user)
        });

    }
}


 // Export the controller as an instance for usage in routes




