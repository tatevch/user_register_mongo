import _ from 'lodash';
import qs from 'query-string';
import JWT from 'jsonwebtoken';
import geoTz from 'geo-tz';
import moment from 'moment-timezone';
import HttpErrors from 'http-errors';

import {
  Users,
  Companies,
  Subscriptions, Roles,
} from '../models';

const { JWT_SECRET } = process.env;

const whiteList = [
  ['/', ['GET']],
  ['/users/login', ['POST']],
  ['/webhook/shipper/charge', ['POST']],
  ['/webhook/account/update', ['POST']],
  ['/webhook/carrier/transfer', ['POST']],
  ['/webhook/payment/status', ['POST']],
  ['/users/verify', ['POST']],
  ['/users/verify/phone', ['POST']],
  ['/users/register/phone', ['POST']],
  ['/users/register/phone-check', ['POST']],
  ['/users/register/carrier', ['POST']],
  ['/users/register/shipper/step-one', ['POST']],
  ['/users/register/shipper/step-two', ['POST']],
  ['/users/register/shipper/step-three', ['POST']],
  ['/users/register/shipper/resend', ['POST']],
  ['/users/create/shipper/step-two', ['POST']],
  ['/users/create/user/step-two', ['POST']],
  ['/users/create/manager/step-two', ['POST']],
  ['/users/forgot/password', ['POST', 'PUT']],
  ['/static/marker/pickup/', ['GET']],
  ['/company-management/members/register', ['POST']],
];

const checkInWhiteList = (url, method) => {
  let bool = false;

  whiteList.every((element, i) => {
    if (i === 0 && element[0] === '/') if (element[0] !== url) return true;

    if (url.indexOf(element[0]) > -1 && element[1].includes(method.toUpperCase())) {
      bool = true;
      return false;
    }
    return true;
  });

  return bool;
};

export default async (req, res, next) => {
  try {
    const {
      headers: { 'x-geolocation': geolocation },
      originalUrl: _originalUrl,
      method,
    } = req;

    if (method === 'OPTIONS') {
      next();
      return;
    }

    const [originalUrl] = _originalUrl.split(/[?#]/);

    let allow = false;

    if (checkInWhiteList(originalUrl, method)) allow = true;

    let userId;

    const authorization = req.headers.authorization || req.body.authorization || req.query.authorization || '';
    const token = authorization.replace('Bearer ', '');

    try {
      const { id } = JWT.verify(token, JWT_SECRET);
      userId = id;
    } catch (e) {
      //
    }

    if (!userId && !allow) throw new HttpErrors(401, 'Invalid authorization token!');

    const user = await Users.findById(userId).lean();

    if (!_.isEmpty(user)) {
      if (['disabled'].includes(user.userStatus)) {
        throw new HttpErrors(401, 'Your account is deactivated. Please contact to your manager!');
      }

      if (geolocation) {
        try {
          const parse = qs.parse(geolocation);

          if (!_.isEmpty(parse)) {
            const data = geoTz(+parse.lat, +parse.lng);

            user.currentLocation = {
              type: 'Point',
              coordinates: [
                +parse.lng,
                +parse.lat,
              ],
            };

            user.timeZone = moment().tz(data[0]).format('z');

            user.accuracy = parse.accuracy;

            await Users.updateOne({
              _id: user._id,
            }, {
              timeZone: user.timeZone,
              currentLocation: user.currentLocation,
            });
          }
        } catch (e) {
          //
        }
      }

      user.isAdmin = user.userType === 'admin';
      user.isManager = user.userType === 'manager';
      user.isCarrier = user.userType === 'carrier';
      user.isShipper = user.userType === 'shipper';

      user.isActive = user.userStatus === 'active';
      user.inConfirmation = user.userStatus === 'confirmation';
      user.inPending = user.userStatus === 'pending';

      user.isAdminOrManager = user.userType === 'admin' || user.userType === 'manager';

      if (user.inConfirmation || user.inPending) {
        user.canBook = false;
        user.canSeeLoads = true;
      } else if (user.isActive) {
        user.canBook = true;
        user.canSeeLoads = true;
      } else {
        user.canBook = false;
        user.canSeeLoads = false;
      }

      user.company = await Companies.findOne({
        $or: [
          { admins: { $in: [user._id] } },
          { members: { $in: [user._id] } },
        ],
      });

      user.noCompany = !user.company;

      user.roleId = user.roleId ? await Roles.findById(user.roleId).lean() : null;

      user.subscription = await Subscriptions.findOne({ userId: user._id });

      if (user.subscription && user.subscription.status !== 'active') {
        throw new HttpErrors(401, 'Invalid authorization token!');
      }

      if (user.company) {
        user.comapnyId = user.company._id;

        // i now about Comapny :)
        user.isComapnyAdmin = user.company.admins.some((a) => `${a}` === `${user._id}`);

        await Users.updateOne({
          _id: user._id,
        }, {
          isChild: !user.isComapnyAdmin,
        });
      } else {
        user.comapnyId = null;
        user.isComapnyAdmin = false;
      }

      req.user = user;
    } else if (!allow) {
      throw new HttpErrors(401, 'Invalid authorization token!');
    } else {
      req.user = {};
    }

    next();
  } catch (e) {
    next(e);
  }
};
