// making the subscription model for the user to subscribe to the channel and also to keep track of the subscription of the user

import mongoose, {Schema} from "mongoose"



const SubscriptionSchema = Schema({
      
      Subscriber :{
        type : Schema.Types.ObjectId,
        ref:"User"
      },
      Channel :{
           type : Schema.Types.ObjectId,
             ref:"User"
      }

},{timestamps:true})


export const Subscription = mongoose.model("Subscription",SubscriptionSchema) ;



