import { User } from '../../src/models/user.model.js';
import { sequelize } from '../../src/db/index.js';
import { Sequelize } from 'sequelize';

describe('User Model', () => {
  let testDb;

  beforeAll(async () => {
    testDb = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });

    const UserTest = testDb.define('User', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: Sequelize.DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 30],
          notEmpty: true,
        },
      },
      fullName: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [3, 100],
          notEmpty: true,
        },
      },
      email: {
        type: Sequelize.DataTypes.STRING,
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
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 255],
          notEmpty: true,
        },
      },
      profilePicture: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
        validate: {
          isUrl: true,
        },
      },
      coverImage: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: 'https://ih1.redbubble.net/cover.4093136.2400x600.jpg',
        validate: {
          isUrl: true,
        },
      },
      bio: {
        type: Sequelize.DataTypes.STRING(100),
        defaultValue: '✨ Crafting cool apps with MERN! 💻',
      },
      isDpVerify: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      location: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: true,
        validate: {
          isDate: true,
          isOldEnough(value) {
            if (value) {
              const today = new Date();
              const birthDate = new Date(value);
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              
              if (age < 13) {
                throw new Error('User must be at least 13 years old');
              }
            }
          },
        },
      },
      followers: {
        type: Sequelize.DataTypes.JSON,
        defaultValue: [],
      },
      following: {
        type: Sequelize.DataTypes.JSON,
        defaultValue: [],
      },
      website: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'Please enter a valid URL'
          }
        },
      },
      role: {
        type: Sequelize.DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false,
        validate: {
          isIn: {
            args: [['user', 'admin']],
            msg: 'Role must be either user or admin'
          }
        }
      },
    }, {
      timestamps: true,
      tableName: 'users',
    });

    await testDb.sync({ force: true });
    global.UserTest = UserTest;
  });

  afterAll(async () => {
    await testDb.close();
  });

  beforeEach(async () => {
    await global.UserTest.destroy({ where: {}, truncate: true });
  });

  describe('User Creation', () => {
    test('should create a valid user', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await global.UserTest.create(userData);

      expect(user.username).toBe('testuser');
      expect(user.fullName).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
      expect(user.role).toBe('user');
      expect(user.isDpVerify).toBe(false);
      expect(user.followers).toEqual([]);
      expect(user.following).toEqual([]);
    });

    test('should set email to lowercase', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      };

      const user = await global.UserTest.create(userData);
      expect(user.email).toBe('test@example.com');
    });

    test('should set default values correctly', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await global.UserTest.create(userData);

      expect(user.profilePicture).toBe('https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg');
      expect(user.coverImage).toBe('https://ih1.redbubble.net/cover.4093136.2400x600.jpg');
      expect(user.bio).toBe('✨ Crafting cool apps with MERN! 💻');
      expect(user.role).toBe('user');
      expect(user.isDpVerify).toBe(false);
    });
  });

  describe('User Validation', () => {
    test('should fail with invalid email', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(global.UserTest.create(userData)).rejects.toThrow();
    });

    test('should fail with short username', async () => {
      const userData = {
        username: 'ab',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(global.UserTest.create(userData)).rejects.toThrow();
    });

    test('should fail with long username', async () => {
      const userData = {
        username: 'a'.repeat(31),
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(global.UserTest.create(userData)).rejects.toThrow();
    });

    test('should fail with short password', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: '12345'
      };

      await expect(global.UserTest.create(userData)).rejects.toThrow();
    });

    test('should fail with short fullName', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'ab',
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(global.UserTest.create(userData)).rejects.toThrow();
    });

    test('should fail with empty required fields', async () => {
      await expect(global.UserTest.create({})).rejects.toThrow();
    });

    test('should fail with invalid website URL', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        website: 'invalid-url'
      };

      await expect(global.UserTest.create(userData)).rejects.toThrow();
    });

    test('should accept valid website URL', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        website: 'https://example.com'
      };

      const user = await global.UserTest.create(userData);
      expect(user.website).toBe('https://example.com');
    });

    test('should fail with underage user', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        dob: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000)
      };

      await expect(global.UserTest.create(userData)).rejects.toThrow('User must be at least 13 years old');
    });

    test('should accept valid age user', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        dob: new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000)
      };

      const user = await global.UserTest.create(userData);
      expect(user.dob).toBeDefined();
    });
  });

  describe('User Role', () => {
    test('should create admin user', async () => {
      const userData = {
        username: 'adminuser',
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      };

      const user = await global.UserTest.create(userData);
      expect(user.role).toBe('admin');
    });

    test('should fail with invalid role', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid'
      };

      await expect(global.UserTest.create(userData)).rejects.toThrow();
    });
  });

  describe('User Uniqueness', () => {
    test('should fail with duplicate username', async () => {
      const userData1 = {
        username: 'testuser',
        fullName: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123'
      };

      const userData2 = {
        username: 'testuser',
        fullName: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123'
      };

      await global.UserTest.create(userData1);
      await expect(global.UserTest.create(userData2)).rejects.toThrow();
    });

    test('should fail with duplicate email', async () => {
      const userData1 = {
        username: 'testuser1',
        fullName: 'Test User 1',
        email: 'test@example.com',
        password: 'password123'
      };

      const userData2 = {
        username: 'testuser2',
        fullName: 'Test User 2',
        email: 'test@example.com',
        password: 'password123'
      };

      await global.UserTest.create(userData1);
      await expect(global.UserTest.create(userData2)).rejects.toThrow();
    });
  });
});