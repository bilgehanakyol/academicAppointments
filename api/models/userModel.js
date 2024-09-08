import mongoose, { model } from 'mongoose';
const {Schema} = mongoose;

const UserSchema = new Schema ({
    name: String,
    email: {type: String, unique: true},
    password: String
});

const UserModel = model('User', UserSchema);

export default UserModel;