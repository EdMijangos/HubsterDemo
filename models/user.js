const passportLocalMongoose = require('passport-local-mongoose');
const Schema = require('mongoose').Schema;
const userSchema = new Schema({
    username: {
      type:String,
      require:true,
    },
    photoURL: {
      type:String,
      default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg'
    },
    email: {
      type:String,
      require:true,
    },
    hubs:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Hub'
      }
    ],
    hobbies:[
      {
        type:String,
      }
    ],
    points:{
      type:Number,
      default:0,
    },
    friendList: [
      {
        type:Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },{
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    } 
});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'})

module.exports = require('mongoose').model('User', userSchema);