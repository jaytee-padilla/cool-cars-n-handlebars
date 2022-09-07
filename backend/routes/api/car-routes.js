const router = require('express').Router();
const { Car, User } = require('../../models/index');

// GET all car posts
router.get('/', (req, res) => {
  Car.findAll({
    attributes: ['id', 'year_made', 'brand', 'model', 'drivetrain', 'image_url', 'created_at'],
    order: [['created_at', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['id', 'username']
      }
    ]
  })
    .then(dbCarData => {
      res.status(200).json(dbCarData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// GET a single car post
router.get('/:id', (req, res) => {
  Car.findOne({
    where: { id: req.params.id },
    attributes: ['id', 'year_made', 'brand', 'model', 'drivetrain', 'image_url', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['id', 'username']
      }
    ]
  })
    .then(dbCarData => {
      if (!dbCarData) {
        res.status(404).json({ message: 'No car found with the provided id' });
        return;
      }

      res.status(200).json(dbCarData);
    })
    .catch(err => {
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
    user_id: req.body.user_id
  })
    .then(dbCarData => {
      res.status(201).json(dbCarData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// PUT/edit a single car post
router.put('/:id', (req, res) => {
  Car.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(dbCarData => {
      if (!dbCarData[0]) {
        res.status(404).json({ message: 'No car found with the provided id'});
        return;
      }

      res.status(200).json({ message: 'Car post updated successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// DELETE a single car post
router.delete('/:id', (req, res) => {
  Car.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCarData => {
      if (!dbCarData) {
        res.status(404).json({ message: 'No car found with the provided id' });
        return;
      }

      res.json({ message: `Car id ${req.params.id} deleted successfully` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

module.exports = router;