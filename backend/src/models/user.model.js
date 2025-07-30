import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';
import validator from 'validator';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
      notEmpty: true,
    },
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100],
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255],
      notEmpty: true,
    },
  },
  profilePicture: {
    type: DataTypes.TEXT,
    defaultValue: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
    validate: {
      isUrl: true,
    },
  },
  coverImage: {
    type: DataTypes.TEXT,
    defaultValue: 'https://ih1.redbubble.net/cover.4093136.2400x600.jpg',
    validate: {
      isUrl: true,
    },
  },
  bio: {
    type: DataTypes.STRING(100),
    defaultValue: '✨ Crafting cool apps with MERN! 💻',
  },
  isDpVerify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: true,
      isOldEnough(value) {
        if (value) {
          const ageLimit = 13;
          const birthDate = new Date(value);
          const currentDate = new Date();
          const age = currentDate.getFullYear() - birthDate.getFullYear();
          if (age < ageLimit) {
            throw new Error('You must be at least 13 years old');
          }
        }
      },
    },
  },
  followers: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  following: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Please enter a valid URL'
      }
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'users',
});

export { User };