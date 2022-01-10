import _ from 'lodash';
import HttpErrors from 'http-errors';

export default (roles = []) => async (req, res, next) => {
  try {
    const {
      user,
      method,
    } = req;

    if (method === 'OPTIONS') {
      next();
      return;
    }

    if (!_.isEmpty(user)) {
      if (!_.isEmpty(roles)) {
        const boolList = [];

        roles.forEach((r) => {
          boolList.push(req.user[r]);
        });

        if (!boolList.includes(true)) throw new HttpErrors(403);
      }

      next();
      return;
    }

    throw new HttpErrors(403);
  } catch (e) {
    next(e);
  }
};
