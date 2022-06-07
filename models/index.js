const User = require('./User');
const Post = require('./Post');

// Create associations
// One to Many relationship. 1 to *
User.hasMany(Post, {
  foreignKey: 'user_id'
}); 

Post.belongsTo(User, {
  foreignKey: 'user_id'
}); 


module.exports = { User, Post };