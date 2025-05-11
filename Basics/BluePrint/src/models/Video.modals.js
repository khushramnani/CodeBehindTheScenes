import mongoose from 'mongoose'
import {Schema} from 'mongoose' 
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoModals = new Schema({
    videofile:{
        type:String,
        required:true,

    },
    thumbnail:{
        type:String,
        required:true
    }, 
    owner:{
        type: mongoose.Schema.types.ObjectId,
        ref: 'User',
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ispublished:{
        type:Boolean,
        default:true,
    },
    view:{
        type:Number,
        default:0
    },
    duration:{
        type:Number,
        required:true,
    }
},{timestamps:true})


videoModals.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model('Video',videoModals)

