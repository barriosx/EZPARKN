//routes/queues/create.js

module.exports = (db, express, verifyToken) => ({
  router() {
    const router = express.Router();
    router.post('/', verifyToken, this.createQueue);
    return router;
  },
  createQueue(req, res) {
    console.log(req.body.msg);
    if (!req.body.msg) {
      res.status(400).json({success: false, msg: 'Need to send back msg'});
    }
    else {
      db.users.find({
        where: {
          id: req.id
        }
      }).then(user => {
        if(user){
          db.queues.create({
            userId: req.id,
            msg: req.body.msg
          }).then(msg => {
            res.status(201).json({success: true, msg});
          })
        } else {
          res.status(400).json({success: false, msg: 'Could not find user'});
        }
      })
    }
  }
});

