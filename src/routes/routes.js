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
router.get('/tours-and-travels', businessController.showToursAndTravelsPage)
router.get('/rate/:id',authMiddleware, businessController.showRatePage)
// Route to get business details by ID
router.get('/edit/:id',authMiddleware, businessController.showEditUser);


router.post('/enter-your-details', businessController.addNameDetails)
router.post('/show-business', businessController.showBusiness)
router.post('/send-otp', businessController.sendOtp);
router.post('/verify-otp', businessController.verifyOtpHandler);
router.post('/verify-otp-pop', businessController.verifyOtpHandlerPopupPage);

router.post('/submit-rating/:businessId',authMiddleware,  businessController.submitReview);
router.post('/update-toggle', businessController.updateToggle);

// router.post('/list-business',authMiddleware, businessController.addBusinessDetails);
router.post('/list-business',authMiddleware,  upload.array('images', 5), businessController.addBusinessDetails);
// update user information
router.post('/update-user', businessController.updateInformation);
router.delete("/delete/:id", businessController.deleteReview);

export default router;