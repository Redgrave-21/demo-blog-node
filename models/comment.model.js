const mongoose= require('mongoose')

var commentSchema = new mongoose.Schema(
    { 
        author:{
            type:String,
        },
        text:{
            type: String,
            required:true
        },
        date:{
            type:Date,
            default: Date.now
        },

        article:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'

        }
       
    }
)

module.exports=mongoose.model('Comment',commentSchema)