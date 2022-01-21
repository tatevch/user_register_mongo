import express from "express";
import users from "./users";
import location from "./location";
//import inventory from "./inventory";
const router = express.Router();
// import youtubeInfo from 'youtube-infofix';

/* GET home page. */

router.get('/', (req, res, next)=> {
  res.render('index', { title: 'User-Registration' });
})

router.use('/location',location);
router.use('/users', users);

export default router;
