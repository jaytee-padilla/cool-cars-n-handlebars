const router = require('express').Router();
const { Car, User, Vote } = require('../../models/index');
const sequelize = require('../../config/connection');

// GET all car posts
router.get('/', (req, res) => {
  Car.findAll({
    attributes: [
      'id',
      'year_made',
      'brand',
      'model',
      'drivetrain',
      'image_url',
      'created_at',
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM vote WHERE car.id = vote.car_id)'
        ),
        'vote_count',
      ],
    ],
    order: [['created_at', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
      },
    ],
  })
    .then((dbCarData) => {
      res.status(200).json(dbCarData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// GET a single car post
router.get('/:id', (req, res) => {
  Car.findOne({
    where: { id: req.params.id },
    attributes: [
      'id',
      'year_made',
      'brand',
      'model',
      'drivetrain',
      'image_url',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE car.id = vote.car_id)'), 'vote_count']
    ],
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
      },
    ],
  })
    .then((dbCarData) => {
      if (!dbCarData) {
        res.status(404).json({ message: 'No car found with the provided id' });
        return;
      }

      res.status(200).json(dbCarData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// POST a new car
router.post('/', (req, res) => {
  Car.create({
    year_made: req.body.year_made,
    brand: req.body.brand,
    model: req.body.model,
    drivetrain: req.body.drivetrain,
    image_url: req.body.image_url,
    user_id: req.body.user_id,
  })
    .then((dbCarData) => {
      res.status(201).json(dbCarData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// PUT/edit vote count on a car post
router.put('/upvote', (req, res) => {
  Vote.create({
    user_id: req.body.user_id,
    car_id: req.body.car_id,
  })
    .then(() => {
      return Car.findOne({
        where: {
          id: req.body.car_id,
        },
        attributes: [
          'id',
          'year_made',
          'brand',
          'model',
          'drivetrain',
          'image_url',
          'created_at',
          [
            // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
            sequelize.literal(
              '(SELECT COUNT(*) FROM vote WHERE car.id = vote.car_id)'
            ),
            'vote_count',
          ],
        ],
      });
    })
    .then((dbCarData) => res.json(dbCarData))
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// PUT/edit a single car post
router.put('/:id', (req, res) => {
  Car.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbCarData) => {
      if (!dbCarData[0]) {
        res.status(404).json({ message: 'No car found with the provided id' });
        return;
      }

      res.status(200).json({ message: 'Car post updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

// DELETE a single car post
router.delete('/:id', (req, res) => {
  Car.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbCarData) => {
      if (!dbCarData) {
        res.status(404).json({ message: 'No car found with the provided id' });
        return;
      }

      res.json({ message: `Car id ${req.params.id} deleted successfully` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

module.exports = router;
