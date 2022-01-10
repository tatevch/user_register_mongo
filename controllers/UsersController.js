import Users from '../models/Users';
import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';

class UsersController {
  static register = async (req, res, next) => {
    try {
      const {name, lname, bdate, phone, email, password} = req.body;
      const existUser = await Users.findOne(email, phone);
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
        password
      });
      const token = jwt.sign({userId: user.id}, JWT_SECRET);
      res.json({
        status: 'ok',
        token,
        user,
      });

    } catch (e) {
      next(e);
    }
  }
  static login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
      const user = await Users.findOne({email});
      if (!user || user.password !== password) {
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
    const {id} = req.query;
    const {name, lname, bdate, phone, password, email} = req.body;
    try {
      const updateuser = Users.findByIdAndUpdate(id, {$set: {name, lname, bdate, phone, password, email}});
      res.json({
        status: 'ok',
        updateuser,
      });
    } catch (e) {
      next(e);
    }
  }
  static userDelete = async (req, res, next) => {
    const {email} = req.body;
    try {
      const deleteuser = await Users.findOne({email});
      await Users.delete({email: deleteuser.email});
    } catch (e) {
      next(e);
    }
    ;
  }
};

export default UsersController;
