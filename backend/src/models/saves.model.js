import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const SavedItem = sequelize.define('SavedItem', {
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
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'saved_items',
});

export { SavedItem };