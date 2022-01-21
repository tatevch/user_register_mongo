import mongoose from 'mongoose';
import md5 from 'md5';

const schema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      //required: true
    },
    coordinates: {
      type: [Number,Number],
      //required: true
    }
  }
});

schema.index({ location: '2dsphere' });
const Location = mongoose.model('Location', schema);
export default Location;


