//routes/car/create.js
module.exports = (db, express, verifyToken) => ({

  router() {
    const router = express.Router();
    router.put('/', verifyToken, this.createCar);
    return router;
  },
 
  createCar(req, res) {
    if (!req.body.make || !req.body.model || !req.body.color || !req.body.size)
      res.status(400).json({success: false, msg: 'Failed to create car'});
    else {
      db.users.find({
        where: {
          id: req.id
        }
      }).then(user => {
        db.cars.find({
          where:{
            userId: user.id,
          }
        }).then(oldCar => {

          if(!oldCar){
            db.cars.create({
              userId: user.id,
              size: req.body.size,
              make: req.body.make,
              model: req.body.model,
              color: req.body.color
            }).then((car) => {
                res.status(200).json({success: true, msg: 'Car created'});
            }).catch(() => {
                res.status(400).json({success: false, msg: 'Failed to create a car'});
            });
            
          }
          else{
            db.cars.update({
              size: req.body.size,
              make: req.body.make,
              model: req.body.model,
              color: req.body.color
            },
            {
              where:{
                userId: user.id,
              },
              returning: true,
            }).then((car) => {
                res.status(200).json({success: true, msg: 'Car updated'});
            }).catch(() => {
                res.status(400).json({success: false, msg: 'Failed to update a car'});
            });
          }
        }).catch(()=>{
          res.status(400).json({success: false, msg: 'Failed to create a car'});
        });
      }).catch(() => {
        //Good token but no user found?????
        console.log(req.id);
        res.status(404).json({success: false, msg: 'You seem to be lost... Are you sure you are logged in?'});  
      });
    }
  }
});
