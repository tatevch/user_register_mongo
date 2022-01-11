import express from "express";
import users from "./users";
const router = express.Router();
// import youtubeInfo from 'youtube-infofix';

/* GET home page. */

router.get('/', (req, res, next)=> {
  res.render('index', { title: 'User-Registration' });
})

router.use('/users', users);

export default router;
