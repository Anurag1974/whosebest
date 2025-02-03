import BusinessController from '../controllers/business.controller.js';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { initializeToggle } from '../middleware/toggleMiddleware.js';
import upload from '../middleware/multerMiddleware.js';

const router = express.Router();


const businessController = new BusinessController();

router.get("/",authMiddleware, businessController.showHome)
router.get('/add-name', businessController.showNamePage)



router.get('/business-login',authMiddleware, businessController.showbusinessLogin)

router.get('/manage-business/:id',authMiddleware, initializeToggle,  businessController.showManageBusiness)
router.get('/enter-business-details', initializeToggle, authMiddleware, businessController.showEnterBusinessDetails)
router.get('/logout', businessController.logout)
// >extra
router.get('/enter-your-details',authMiddleware, businessController.showNamePage)
router.get('/your-business/:id',authMiddleware, initializeToggle,  businessController.showOwnListedBusinessList)

router.get('/business-details/:businessId', authMiddleware,  businessController.showBusinessDetailsById)
router.get('/search-category', authMiddleware, businessController.searchCategory);
router.get('/book-your-taxi', businessController.showTaxiPage)
// Render the Book Your Guide form
router.get('/book-your-guide', businessController.bookguide);

router.get('/tours-and-travels', businessController.showToursAndTravelsPage)
router.get('/rate/:id',authMiddleware, businessController.showRatePage)
// Route to get business details by ID
router.get('/edit',authMiddleware, businessController.showEditUser);

router.get('/show-business', authMiddleware, businessController.searchBusiness)
router.get('/what-we-do',authMiddleware, businessController.showWhatWeDo);
router.get('/find-what-you-want',authMiddleware,businessController.findWhatYouWant);
router.get('/setup-your-business',authMiddleware, businessController.setupYourBusiness);
router.get('/form',authMiddleware, businessController.formfooter);

// Use PUT instead of POST
router.get('/business/:businessId', businessController.getBusinessById);

 

router.post('/enter-your-details', businessController.addNameDetails)
//router.post('/show-business', businessController.showBusiness)
router.post('/send-otp', businessController.sendOtp);
router.post('/verify-otp', businessController.verifyOtpHandler);
router.post('/verify-otp-pop', businessController.verifyOtpHandlerPopupPage);

router.post('/submit-rating/:businessId',authMiddleware,  businessController.submitReview);
router.post('/update-toggle', businessController.updateToggle);

// router.post('/list-business',authMiddleware, businessController.addBusinessDetails);
router.post('/list-business', authMiddleware, upload.array('images', 5), businessController.addBusinessDetails);
router.post('/testimonials', businessController.addTestimonial);
router.post('/submit-whosbest-review', authMiddleware,  businessController.addWhosbestReview)
// update user information
// router.put('/update-user', authMiddleware, businessController.updateInformation);
router.put('/update-user', authMiddleware, upload.single('profileImage'), businessController.updateInformation);
router.put('/update-business',authMiddleware, upload.array('images', 5), businessController.updateBusinessDetails);

router.post("/business-hours", businessController.addBusinessHours);
router.put("/business-hours", businessController.updateBusinessHours);
router.get('/business-hours/:businessId', businessController.getBusinessHours)


router.delete("/delete/:id", businessController.deleteReview);

export default router;