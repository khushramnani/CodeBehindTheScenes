import mongoose from "mongoose";

const orderItemsSchema = mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    
    quantity:{
        type: Number,
        required: true
    }

})

const orderSchema  = new mongoose.Schema({
    orderPrice:{
        type: Number,
        required: true,

    },

    Customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items:{
        type: [orderItemsSchema],

    },

    address:{
        type: String,
        required: true,
    },

    status:{
        type: String,
        enum: ["PENDING", "CANCELED", "DELIVERED"],
        default: "PENDING"
    }

},{timestamps:true})


export const Order = mongoose.model("Order", orderSchema)

