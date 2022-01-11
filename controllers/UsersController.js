import Users from '../models/Users';
import md5 from 'md5';
import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;
class UsersController {
  static register = async (req, res, next) => {
    try {
      const {name, lname, bdate, phone, email, password} = req.body;
      const existUser = await Users.findOne({email, phone});
    if (existUser) {
       const errors = {};
       if (existUser.email === email) {
         errors.email = ['Email must be unique'];
       }
       if (existUser.phone === phone) {
         errors.phone = ['Phone must be unique'];
       }
       throw HttpError(422, {errors});
     }
      const user = await Users.create({
        name,
        lname,
        bdate,
        phone,
        email,
        password: md5(md5(password)),
      });
      const token = jwt.sign({userId: user.id}, JWT_SECRET);
      res.json({
        status: 'ok',
        user,
        token,
      });

    } catch (e) {
      next(e);
    }
  }
  static login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
      const user = await Users.findOne({email});
      const pass = Users.passHash(password);
      if (!user||user.password !==pass) {
        throw HttpError(422, 'Such user does not exist');
      }
      const token = jwt.sign({userId: user.id}, JWT_SECRET);
      res.json({
        status: 'ok',
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  }

  static updateUser = async (req, res, next) => {
    const {id} = req.body;
    const {name, lname, bdate, phone, password, email} = req.body;
    try {
      const updateuser = await Users.findByIdAndUpdate(id, {$set: {name, lname, bdate, phone, password, email}});
      //const update=Users.updateOne({});
      //const res = await Person.updateOne({ name: 'Jean-Luc Picard' }, { ship: 'USS Enterprise' });
      res.json({
        status: 'ok',
        updateuser,
      });
    } catch (e) {
      next(e);
    }
  }
  static updateManyUsers =async (req,res,next)=>{
    const {name,name1}=req.body;
    try{
      const user= await Users.updateMany({name:name},{name:name1});
      res.json({
        status:'ok',
        user,
      });
    } catch (e) {
      next(e);
    }
  }
  static getAllUsers =async (req,res,next)=>{
    try{
      const list=await Users.find({});
      res.json({
        status:'ok',
        list,
      });
    }catch (e) {
      next(e);
    }
  }
  static userDelete = async (req, res, next) => {
    const {id} = req.body;
    try {
      const deleteuser = await Users.findOne({id});
      await Users.deleteOne({id: deleteuser.id});
      res.json({
        status:'ok',
      });
    } catch (e) {
      next(e);
    }
  }
};

export default UsersController;
