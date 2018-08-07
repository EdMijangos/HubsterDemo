const Schema = require('mongoose').Schema;

const commentSchema = new Schema({
  owner:{
    type:Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  hub:{
    type:Schema.Types.ObjectId,
    ref: 'Hub',
    required:true,
  },
  content:{
    type:String,
    default:'(Empty comment)'
  },
},{
  timestamps:{
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  } 
});

module.exports = require('mongoose').model('Comment', commentSchema);