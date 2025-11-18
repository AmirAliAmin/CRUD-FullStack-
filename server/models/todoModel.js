import {Schema,model} from 'mongoose'

const todoSchema = new Schema({
    task:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default: false
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true});

const todoModel = model("Todo", todoSchema);
export default todoModel;