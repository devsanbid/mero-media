import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const UserFollow = sequelize.define('UserFollow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'user_follows',
  indexes: [
    {
      unique: true,
      fields: ['followerId', 'followingId']
    }
  ]
});

export { UserFollow };