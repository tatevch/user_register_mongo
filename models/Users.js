import mongoose from 'mongoose';
import md5 from 'md5';

const schema = new mongoose.Schema(
  {
    name: String,
    lname: String,
    bdate: Date,
    phone: String,
    email: String,
    password: String,
    role: String
  },
  {
    timestamps: true,
    collection: 'users',
  },
);
schema.index({phone: 1});

schema.index({email: 1});

function passHash(password) {
  return md5(md5(password));
}

schema.static('passHash', passHash);

const Users = mongoose.model('Users', schema);
export default Users;
