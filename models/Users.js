import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: 'string',
    lname: 'string',
    bdate: 'date',
    phone: 'string',
    email: 'string',
    password: 'string',
    role: {
      type: 'string',
      default: null,
    },
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
