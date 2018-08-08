const User = require('../models/user');
const router = require('express').Router();
const Hub = require('../models/hub');
const Commentario = require('../models/comment') //se le llamo en español porque Comment es una variable reservada.


//middlewares
//termine por no usarlos
function isAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return next()
  }else{
      res.redirect('/login');
  }
}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      res.redirect('/')
  }else{
      next();
  }
}

//lista de usuarios
router.get('/people', (req,res)=>{
  User.find()
  .then(users=>{
    res.json(users)
  })
  .catch(err=>res.json(err))
})

//profile de usuario en especifico
router.get('/people/:id', (req,res)=>{
  User.findById(req.params.id)
  .populate('hubs')
  .populate('friendList')
  .then(user=>{
    res.json(user)
  })
  .catch(err=>res.json(err))
})

//agrega el hub al usuario cuando te unes a él
router.put('/peopleHub/:id', (req,res)=>{
  User.findByIdAndUpdate(req.params.id, {$push:{hubs:req.body.valueToUpdate}}, {new:true})
  .populate('hubs')
  .populate('friendList')
  .then(user=>{
    res.json(user)
  })
  .catch(err=>res.json(err))
})

//agrega un usuario a tu Friend List
router.put('/peopleFriend/:id', (req,res)=>{
  User.findByIdAndUpdate(req.params.id, {$push:{friendList:req.body.valueToUpdate}}, {new:true})
  .populate('hubs')
  .populate('friendList')
  .then(user=>{
    res.json(user)
  })
  .catch(err=>res.json(err))
})

//actualiza tu nueva foto de perfil en la DB
router.put('/peoplePhoto/:id', (req,res)=>{
  console.log(req.body)
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .populate('hubs')
  .populate('friendList')
  .then(user=>{
    res.json(user)
  })
  .catch(err=>res.json(err))
})

//crea un nuevo hub
router.post('/newHub', (req,res,next)=>{
  let hub = {}
  Hub.create(req.body)
  .then(newHub=>{
    hub = newHub;
    User.findByIdAndUpdate(hub.owner, {$push:{hubs:hub._id}}, {new:true})
  .catch(err=>res.json(err))
    res.json(newHub)
  })
  .catch(err=>res.json(err))
})

//lista de hubs
router.get('/hubs', (req,res)=>{
  Hub.find()
  .populate('owner')
  .then(hubs=>{
    res.json(hubs)
  })
  .catch(err=>res.json(err))
})

//muestra un hub en especifico
router.get('/hubs/:id', (req,res,next)=>{
  Hub.findById(req.params.id)
  .populate('owner')
  .populate('participants')
  .populate('comments')
  .then(hub=>{
    res.json(hub)
  })
  .catch(err=>res.json(err))
})

//agrega un usuario a la lista de participantes del hub
router.put('/hubParticipant/:id', (req,res)=>{
  Hub.findByIdAndUpdate(req.params.id, {$push:{participants:req.body.valueToUpdate}}, {new:true})
  .populate('owner')
  .populate('participants')
  .populate('comments')
  .then(hub=>{
    res.json(hub)
  })
  .catch(err=>res.json(err))
})

//crea un comentario nuevo y se lo agrega al hub correspondiente
router.post('/newComment', (req,res,next)=>{
  let comment = {}
  Commentario.create(req.body)
  .then(newComment=>{
    comment = newComment;
    Hub.findByIdAndUpdate(comment.hub, {$push:{comments:comment._id}}, {new:true})
  .catch(err=>res.json(err))
    res.json(newComment)
  })
  .catch(err=>res.json(err))
})

//muestra los comentarios del hub accedido
router.get('/comments/:hubId', (req,res)=>{
  let hubId = req.params.hubId 
  Commentario.find({hub:hubId})
  .populate('owner')
  .then(comments=>{
    res.json(comments)
  })
  .catch(err=>res.json(err))
})

module.exports = router;