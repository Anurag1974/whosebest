import BusinessController from '../controllers/business.controller.js';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


const businessController = new BusinessController();

router.get("/",authMiddleware, businessController.showHome)
router.get('/add-name', businessController.showNamePage)



router.get('/business-login', businessController.businessLogin)

router.get('/manage-business/:id',authMiddleware, businessController.showManageBusiness)
router.get('/enter-business-details',authMiddleware, businessController.showEnterBusinessDetails)
router.get('/logout', businessController.logout)
// >extra
router.get('/enter-your-details',authMiddleware, businessController.showNamePage)
router.get('your-business',authMiddleware, businessController.showOwnListedBusinessList)

router.get('/business-details/:businessId', authMiddleware,  businessController.showBusinessDetailsById)
router.get('/search-category', authMiddleware, businessController.searchCategory);
router.get('/book-your-taxi', businessController.showTaxiPage)
router.get('/tours-and-travels', businessController.showToursAndTravelsPage)
router.get('/rate/:id',authMiddleware, businessController.showRatePage)
// Route to get business details by ID
router.get('/edit',authMiddleware, businessController.showEditUser);


router.post('/enter-your-details', businessController.addNameDetails)
router.post('/show-business', businessController.showBusiness)
router.post('/send-otp', businessController.sendOtp);
router.post('/verify-otp', businessController.verifyOtpHandler);
router.post('/verify-otp-pop', businessController.verifyOtpHandlerPopupPage);
router.post('/list-business',authMiddleware, businessController.addBusinessDetails);
router.post('/submit-rating/:businessId',authMiddleware,  businessController.submitReview);
router.post('/update-toggle', businessController.updateToggle);

// update user information
router.post('/update-user', businessController.updateInformation);
router.delete("/delete/:id", businessController.deleteReview);

export default router;