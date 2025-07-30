import { User } from './user.model.js';
import { Post } from './post.model.js';
import { Comment } from './comment.model.js';
import { FriendRequest } from './friendRequests.model.js';
import { Notification } from './notification.model.js';
import { Story } from './story.model.js';
import { SavedItem } from './saves.model.js';
import { PostLike } from './postLikes.model.js';
import { CommentLike } from './commentLikes.model.js';
import { UserFriend } from './userFriends.model.js';
import { UserFollow } from './userFollow.model.js';

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(FriendRequest, { foreignKey: 'senderId', as: 'sentRequests' });
User.hasMany(FriendRequest, { foreignKey: 'receiverId', as: 'receivedRequests' });
FriendRequest.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
FriendRequest.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

User.hasMany(Notification, { foreignKey: 'senderUserId', as: 'sentNotifications' });
User.hasMany(Notification, { foreignKey: 'receiverUserId', as: 'receivedNotifications' });
Notification.belongsTo(User, { foreignKey: 'senderUserId', as: 'senderUser' });
Notification.belongsTo(User, { foreignKey: 'receiverUserId', as: 'receiverUser' });

User.hasMany(Story, { foreignKey: 'userId', as: 'stories' });
Story.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(SavedItem, { foreignKey: 'userId', as: 'savedItems' });
Post.hasMany(SavedItem, { foreignKey: 'postId', as: 'savedBy' });
SavedItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SavedItem.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(PostLike, { foreignKey: 'userId', as: 'postLikes' });
Post.hasMany(PostLike, { foreignKey: 'postId', as: 'likes' });
PostLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PostLike.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(CommentLike, { foreignKey: 'userId', as: 'commentLikes' });
Comment.hasMany(CommentLike, { foreignKey: 'commentId', as: 'likes' });
CommentLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CommentLike.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });

User.hasMany(UserFriend, { foreignKey: 'userId', as: 'friendships' });
User.hasMany(UserFriend, { foreignKey: 'friendId', as: 'friendOf' });
UserFriend.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserFriend.belongsTo(User, { foreignKey: 'friendId', as: 'friend' });

User.hasMany(UserFollow, { foreignKey: 'followerId', as: 'followingRelations' });
User.hasMany(UserFollow, { foreignKey: 'followingId', as: 'followerRelations' });
UserFollow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
UserFollow.belongsTo(User, { foreignKey: 'followingId', as: 'followedUser' });

export {
  User,
  Post,
  Comment,
  FriendRequest,
  Notification,
  Story,
  SavedItem,
  PostLike,
  CommentLike,
  UserFriend,
  UserFollow
};