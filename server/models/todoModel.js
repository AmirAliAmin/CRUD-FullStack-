import {Schema,model} from 'mongoose'

const todoSchema = new Schema({
    task:{
        type:String,
        required:true
    }
});

const todoModel = model("Todo", todoSchema);
export default todoModel;