export default (req, res, next) => {
  try {
    const { origin = '*' } = req.headers;
    res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Headers', 'Origin,Stripe-Signature,Content-Type,Authorization,X-CompanyId,X-Geolocation,origin,stripe-signature,content-type,authorization,x-companyid,x-geolocation');

    next();
  } catch (e) {
    next(e);
  }
};
