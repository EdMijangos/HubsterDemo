const Schema = require('mongoose').Schema;

const hubSchema = new Schema({
  title:{
    type:String,
    required:true,
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  numberParticipants:{
    type:Number,
    default:2
  },
  participants:[
    {
      type:Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  category:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    default:'Nothing here!'
  },
  location:{
    type:String,
    default:'Nothing here!'
  },
  date:{
    type:String,
    default:'Now'
  },
  comments:[{
    type:Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  status:{
    type:String,
    enum:['open', 'closed'],
    default: 'open'
  },
},{
  timestamps:{
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  } 
});

module.exports = require('mongoose').model('Hub', hubSchema);