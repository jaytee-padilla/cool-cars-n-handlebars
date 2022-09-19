const router = require('express').Router();
const { User, Car, Vote } = require('../../models/index');
const sequelize = require('../../config/connection');

// GET all users /api/users
router.get('/', (req, res) => {
  User.findAll({
    attributes: {
      exclude: ['password'],
      include: [
        [
          // return total amount of cars user has voted on
          sequelize.literal(
            '(SELECT COUNT(*) FROM vote WHERE user.id = vote.user_id)'
          ),
          'total_vote_count',
        ],
      ],
    },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// GET a specific user /api/user/:id
router.get('/:id', (req, res) => {
  User.findOne({
    where: { id: req.params.id },
    attributes: {
      exclude: ['password'],
    },
    include: [
      {
        model: Car,
        attributes: [
          'id',
          'year_made',
          'brand',
          'model',
          'drivetrain',
          'image_url',
          'created_at',
        ],
      },
      {
        model: Car,
        attributes: ['year_made', 'brand', 'model'],
        through: Vote,
        as: 'voted_cars',
      },
    ],
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with the provided id' });
        return;
      }

      res.json(dbUserData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// POST a new user /api/user
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((dbUserData) => {
      res.status(201).json(dbUserData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// Login via user's username
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user with that username found' });
        return;
      }

      dbUserData.checkPassword(req.body.password).then((validPassword) => {
        if (!validPassword) {
          res.status(400).json({ message: 'Incorrect password' });
          return;
        }

        res
          .status(200)
          .json({ user: dbUserData, message: 'You are now logged in' });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// PUT a specific user /api/user/:id
router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with the provided id' });
        return;
      }

      res.json(dbUserData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// DELETE a specific user /api/user/:id
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with the provided id' });
        return;
      }

      res.json({ message: `User id ${req.params.id} deleted successfully` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

module.exports = router;
