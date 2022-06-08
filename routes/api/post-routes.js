const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection'); //Need it to set up visualization of vote count

// get all users
router.get('/', (req, res) => {
  Post.findAll({
    // Query configuration
    attributes: ['id',
    'post_url',
    'title', 
    'created_at',
    [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']  
    ], // This gets vote count posted. 
     //In Post.js, "underscored: true". Sequelize camelcases by default
    order: [['created_at', 'DESC']],  
    include: [
      {
        model: User, //Pull username from other model
        attributes: ['username']
      }
    ]
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

  // Get a single post
  router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 
      'post_url', 
      'title', 
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      // This gets vote count posted. 
    ],
      include: [
        {
          model: User,
          attributes: ['username']  
        }
      ]
    })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

//Post a post
router.post('/', (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// PUT /api/posts/upvote
//Must be before '/:id' because if not, express will think "upvote" is a valid id#
router.put('/upvote', (req, res) => {
  // custom static method created in models/Post.js
  Post.upvote(req.body, { Vote })
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

//Update posts
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Delete posts
router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router; 