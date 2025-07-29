import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const Post = sequelize.define('Post', {
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
  content: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
      notEmpty: true,
    },
  },
  feeling: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  backgroundColor: {
    type: DataTypes.STRING,
    defaultValue: 'bg-white',
  },
  pollOptions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  pollEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pollActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  tableName: 'posts',
});

export { Post };