import mongoose from 'mongoose';

const mongodb=mongoose.connect('mongodb://localhost:27017/list');
export  default mongodb;
