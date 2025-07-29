import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const UserFriend = sequelize.define('UserFriend', {
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
  friendId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'user_friends',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'friendId']
    }
  ]
});

export { UserFriend };