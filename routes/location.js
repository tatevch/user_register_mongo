import express from "express";
import LocationController from "../controllers/LocationController";
const router = express.Router();

router.post('/new-location',LocationController.newlocation);
router.get('/all',LocationController.getAllLocations);
router.get('/near-location',LocationController.getNearestLoc);
router.delete('/delete',LocationController.deleteLocation);
router.put('/change-location',LocationController.changeLocation);
export default router
