import {Schema,model} from 'mongoose';

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    role:{
        type:String,
        required: true,
        enum:["admin", "manager", "user"],
    }
},{timestamps:true});

const userModel = model('User', userSchema);
export default userModel;