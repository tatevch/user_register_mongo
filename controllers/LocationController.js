import Location from "../models/Location";
import  randomCoordinates from 'random-coordinates';
class LocationController{
  static newlocation =async (req,res, next)=>{
    try {
      const randlocation= randomCoordinates();
      const coordinate=randlocation.split(',');
      const lat =coordinate[0];
      const lng=coordinate[1];
      console.log("lng : "+lng);
      console.log("lat :"+lat);
      const location= await Location.create({
        location:{
          type:"Point",
          coordinates:[lng,lat],
        }
      });
      res.json({
        status:'ok',
        location,
      })
    }
    catch (e) {
      next(e);
    }
  }
  static getAllLocations =async (req,res,next)=>{
    try{
      const all=await Location.find({});
      res.json({
        status:'ok',
        all
      });
    }catch (e) {
      next(e);
    }
  }
  static deleteLocation=async (req,res,next)=>{
    try {
      const {id}=req.body;
      await Location.findByIdAndDelete({_id:id});
      res.json({
        status:'ok',
      });
    }catch (e) {
      next(e);
    }
  }
  static getNearestLoc =async (req,res,next)=>{
    const {lng,lat}=req.body
    try{
      const nearlocation =await Location.find({
        "location":{
          $near: {
            $geometry:{
              type:"Point",
              coordinates: [lng,lat],
            },
            $minDistance: 1000,
            $maxDistance: 5000
          }
        }
      }).limit(4);
      res.json({
        status:'ok',
        nearlocation
      });
    }catch (e) {
      next(e);
    }
  }
  static changeLocation= async (req,res,next)=>{
    const{id,lng,lat}=req.body;
    try{
      const update =await Location.findByIdAndUpdate({"_id":id},
        {"location.coordinates":[lng,lat]});
      res.json({
        status:'ok',
        update
      });
    }catch (e) {
      next(e);
    }
  }
}
export default LocationController;
