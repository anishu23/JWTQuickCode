const express = require('express')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken');
const body  = require('body-parser');
const ejwt = require('express-jwt');

app.use(body.urlencoded({ extended: true }));
app.use(body.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

var router = express.Router();

router.post('/signin', function(req, res) {
  var obj = {token: ''}
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  var tokenGenerated = jwt.sign(
    {
      _id: req.body.id,
      name: req.body.name,
      value: req.body.value,
      password: req.body.password,
      exp: exp.getTime() / 1000,
    },
    'p4sta.w1th-b0logn3s3-s@uce',
  );
  obj.token = tokenGenerated;
  console.log(obj)
  res.json(obj);   
});

router.get('/me', (req, res) => {
  var key = 'p4sta.w1th-b0logn3s3-s@uce'
  var tokenfromheader = req.get('Authorization');
  console.log(tokenfromheader)
  var isAuth = false;
  var user = {}
  jwt.verify(tokenfromheader, key, (error, decoded) => {
    if(error) {
      console.log(error)
      isAuth = false;
      res.status(401).send({message: 'authentication failed'})
    } else {
      console.log(decoded)
      isAuth = true;
      user.name = decoded.name;
    }
  })

  if(isAuth) {
    res.json(user)
  }
})

app.use('/api', router)

app.listen(port, () => {
  
})