import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const CommentLike = sequelize.define('CommentLike', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  commentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'comments',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'comment_likes',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'commentId']
    }
  ]
});

export { CommentLike };