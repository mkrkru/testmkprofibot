import { model, Schema } from 'mongoose';

export const User = model('User', new Schema({
    tg_id: Number,
    city: String
}));

export const Order = model('Order', new Schema({
    customer_id: Number,
    title: String,
    desc: String
}));
