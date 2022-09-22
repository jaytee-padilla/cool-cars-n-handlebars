const router = require('express').Router();
const { User, Car, Vote, Comment } = require('../../models/index');
const sequelize = require('../../config/connection');

// GET all comments
router.get('/', (req, res) => {
  Comment.findAll({
    order: [['created_at', 'DESC']]
  })
  .then(dbCommentData => res.json(dbCommentData))
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

// GET a specific comment via id
router.get('/:id', (req, res) => {
  Comment.findOne({
    where: { id: req.params.id }
  })
  .then(dbCommentData => {
    if (!dbCommentData) {
      res.status(404).json({ message: 'No comment found with the provided id' });
      return;
    }
    
    res.json(dbCommentData);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

// POST a new comment
router.post('/', (req, res) => {
  Comment.create({
    comment_text: req.body.comment_text,
    user_id: req.body.user_id,
    car_id: req.body.car_id
  })
  .then(dbCommentData => res.json(dbCommentData))
  .catch(err => {
    console.error(err);
    res.status(400).json(err);
  });
});

// DELETE a single comment
router.delete('/:id', (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbCommentData => {
    if (!dbCommentData) {
      res.status(404).json({ message: 'No car found with the provided id' });
      return;
    }

    res.json({ message: `Car id ${req.params.id} deleted successfully `});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

module.exports = router;