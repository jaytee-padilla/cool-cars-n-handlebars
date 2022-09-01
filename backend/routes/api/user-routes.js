const router = require('express').Router();
const { User } = require('../../models/index');

// GET all users /api/users
router.get('/', (req, res) => {
  User.findAll({
    attributes: {
      exclude: ['password']
    }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// GET a specific user /api/user/:id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: {
      exclude: ['password']
    },
    where: {id: req.params.id}
  })
  .then(dbUserData => {
    if(!dbUserData) {
      res.status(404).json({message: 'No user found with the provided id'});
      return;
    }

    res.json(dbUserData);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  })
});

// POST a new user /api/user
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  })
  .then(dbUserData => {
    res.status(201).json(dbUserData);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  })
});

// PUT a specific user /api/user/:id
router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if(!dbUserData[0]) {
      res.status(404).json({message: 'No user found with the provided id'});
      return;
    }

    res.json(dbUserData);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  })
});

// DELETE a specific user /api/user/:id
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if(!dbUserData) {
      res.status(404).json({message: 'No user found with the provided id'});
      return;
    }

    res.json({message: `User id ${dbUserData} deleted successfully`});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  })
});

module.exports = router;