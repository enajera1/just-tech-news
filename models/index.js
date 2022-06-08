const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// Create relationships
//Direct relationship
Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});
//One to many
User.hasMany(Vote, {
  foreignKey: 'user_id'
});
//Many to one
Post.hasMany(Vote, {
  foreignKey: 'post_id'
});


module.exports = { User, Post, Vote };

/* NOTES *** */
// // One to Many relationship. 1 to *
// User.hasMany(Post, {
//   foreignKey: 'user_id'
// }); 
// // One post belongs to one User. (Many to One)
// Post.belongsTo(User, {
//   foreignKey: 'user_id'
// }); 

// //Many to many relationship
// //Compare to e commerce website. A necklace can be in a single category with multiple tags.
// User.belongsToMany(Post, {
//   through: Vote,
//   as: 'voted_posts',
//   foreignKey: 'user_id'
// });

// Post.belongsToMany(User, {
//   through: Vote,
//   as: 'voted_posts',
//   foreignKey: 'post_id'
// });