import BusinessController from '../controllers/business.controller.js';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { initializeToggle } from '../middleware/toggleMiddleware.js';
import multerMiddleware from '../middleware/multerMiddleware.js'; 
import categoryMiddleware from '../middleware/categoryMiddleware.js';



const router = express.Router();


const businessController = new BusinessController();

router.get("/",authMiddleware, categoryMiddleware,businessController.showHome)
router.get('/about-us',authMiddleware,categoryMiddleware,businessController.showAboutUs)
router.get('/services',authMiddleware,categoryMiddleware,businessController.showOurService)
router.get('/add-name',  categoryMiddleware,businessController.showNamePage)
router.get('/register-driver',authMiddleware, categoryMiddleware,businessController.showDriverRegistration)
router.get('/register-pink-driver',authMiddleware,  categoryMiddleware,businessController.showPinkDriverRegistration)
router.get('/driver-dashboard',authMiddleware, categoryMiddleware,businessController.showDriverDashboard)
 router.get('/pink-driver-dashboard',authMiddleware,categoryMiddleware,businessController.showPinkDriverDashboard)
 router.get('/privacy-policy',categoryMiddleware,authMiddleware,businessController.getPrivacyPolicy)
 router.get('/term-conditions',categoryMiddleware, authMiddleware,businessController.getTermConditions)


// router.get('/business-login',authMiddleware, businessController.showbusinessLogin)
router.get('/login', authMiddleware,categoryMiddleware,businessController.userLogin)

router.get('/manage-business/:id',authMiddleware, categoryMiddleware,initializeToggle,  businessController.showManageBusiness)
router.get('/enter-business-details', initializeToggle, authMiddleware, categoryMiddleware,businessController.showEnterBusinessDetails)
router.get('/logout', businessController.logout)
// >extra

router.get('/coming-soon',authMiddleware,categoryMiddleware,businessController.comingSoon)
router.get('/enter-your-details',authMiddleware, categoryMiddleware,businessController.showNamePage)
router.get('/your-business/:id',authMiddleware, initializeToggle, categoryMiddleware, businessController.showOwnListedBusinessList)

router.get('/business-details/:businessId', authMiddleware, categoryMiddleware, businessController.showBusinessDetailsById)
router.get('/search-category', authMiddleware, categoryMiddleware,businessController.searchCategory);
router.get('/book-your-taxi', authMiddleware,categoryMiddleware,businessController.showTaxiPage)
router.get('/available-taxis', authMiddleware, categoryMiddleware,businessController.showAvailableTaxi);
router.get('/available-pink-taxis', authMiddleware, categoryMiddleware,businessController.showAvailablePinkTaxi);
// Render the Book Your Guide form
// router.get('/book-your-guide', businessController.bookguide);

// router.get('/tours-and-travels', businessController.showToursAndTravelsPage)
router.get('/rate/:id',authMiddleware, categoryMiddleware,businessController.showRatePage)
// Route to get business details by ID
router.get('/edit',authMiddleware,categoryMiddleware, businessController.showEditUser);

router.get('/show-business', authMiddleware, categoryMiddleware,businessController.searchBusiness)
router.get('/what-we-do',authMiddleware, categoryMiddleware,businessController.showWhatWeDo);
router.get('/find-what-you-want',authMiddleware,categoryMiddleware,businessController.findWhatYouWant);
router.get('/setup-your-business',authMiddleware,categoryMiddleware, businessController.setupYourBusiness);
router.get('/form',authMiddleware,categoryMiddleware, businessController.formfooter);

// Use PUT instead of POST
// router.get('/business/:businessId', businessController.getBusinessById);

router.get('/business-profile', authMiddleware,categoryMiddleware,businessController.businessProfile)

// router.post('/enter-your-details', businessController.addNameDetails)
router.post('/manage-business/:businessId/delete', BusinessController.deleteBusiness);
//router.post('/show-business', businessController.showBusiness)
// prouter.ost('/send-otp', businessController.sendOtp);
// router.post('/verify-otp', businessController.verifyOtpHandler);
// router.post('/verify-otp-pop', businessController.verifyOtpHandlerPopupPage);

router.post('/submit-rating/:businessId',authMiddleware,  businessController.submitReview);
router.post('/update-toggle', businessController.updateToggle);

// router.post('/list-business',authMiddleware, businessController.addBusinessDetails);
router.post('/list-business', authMiddleware, multerMiddleware.upload.array('images', 5), businessController.addBusinessDetails);
router.post('/form', authMiddleware,businessController.addTestimonial);
router.post('/submit-whosbest-review', authMiddleware,  businessController.addWhosbestReview)
// update user information
// router.put('/update-user', authMiddleware, businessController.updateInformation);
router.put('/update-business', 
    authMiddleware,                               // 1. Auth middleware to authenticate the user
              
    multerMiddleware.upload.fields([              // 3. Multer to handle file uploads
        { name: 'thumbnail', maxCount: 1 },        // Allow 1 thumbnail image
        { name: 'images', maxCount: 7 }            // Allow up to 5 other images
    ]),
    businessController.updateBusinessDetails     // 4. Controller to update business details
);



router.put('/update-user', 
    authMiddleware, 
    multerMiddleware.upload.single('profileImage'), // Use the default export `upload` for single file upload
    businessController.updateInformation
);
// router.put('/update-user', authMiddleware, upload.single('profileImage'), businessController.updateInformation);
// router.put('/update-business',authMiddleware, upload.array('images', 5), businessController.updateBusinessDetails);

router.post("/business-hours", businessController.addBusinessHours);
router.put("/business-hours", businessController.updateBusinessHours);
router.get('/business-hours/:businessId',categoryMiddleware, businessController.getBusinessHours)


router.delete("/delete/:id", businessController.deleteReview);

router.post("/send-otp", businessController.sendOTP);
router.post("/verify-otp", businessController.verifyOTP);
router.post("/signup", businessController.signup);
router.post("/login",authMiddleware,businessController.login );

router.put('/update-driver', authMiddleware, multerMiddleware.upload.fields([
    { name: 'vehicleImage', maxCount: 1 },
    { name: 'licenseFront', maxCount: 1 },
    { name: 'licenseBack', maxCount: 1 },
    { name: 'driverPhoto', maxCount: 1 }
]), businessController.registerDriver);

router.put('/update-pink-driver', authMiddleware, multerMiddleware.upload.fields([
    { name: 'vehicleImage', maxCount: 1 },
    { name: 'licenseFront', maxCount: 1 },
    { name: 'licenseBack', maxCount: 1 },
    { name: 'driverPhoto', maxCount: 1 }
]), businessController.registerPinkDriver);

router.put('/update-driver-status', authMiddleware, businessController.updateDriverStatus);
router.put('/update-pink-driver-status', authMiddleware, businessController.updatePinkDriverStatus);

// router.post('/update-driver')


router.get('*', authMiddleware,categoryMiddleware,businessController.show404);

export default router;