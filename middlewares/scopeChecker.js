import _ from 'lodash';
import HttpErrors from 'http-errors';
import ScopeChecker from '../services/ScopeChecker';

// if (!await ScopeChecker.check(req.user._id, ['IMPORT_CARRIERS'])) {
//   throw new HttpErrors(403, 'Access denied!');
// }

export default (scopes = [], operator = 'all') => async (req, res, next) => {
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
      if (!_.isEmpty(scopes)) {
        const haveAccess = await ScopeChecker.check(user._id, scopes, operator);

        if (!haveAccess) throw new HttpErrors(403, 'Access denied!');
      }

      next();
      return;
    }

    throw new HttpErrors(403);
  } catch (e) {
    next(e);
  }
};
