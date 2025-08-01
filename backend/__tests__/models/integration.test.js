import { Sequelize } from 'sequelize';

describe('Model Integration Tests', () => {
  let testDb;
  let UserTest, PostTest, CommentTest;

  beforeAll(async () => {
    testDb = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });

    UserTest = testDb.define('User', {
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
      role: {
        type: Sequelize.DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false,
      },
    }, {
      timestamps: true,
      tableName: 'users',
    });

    PostTest = testDb.define('Post', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: UserTest,
          key: 'id',
        },
      },
      content: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [1, 100],
          notEmpty: true,
        },
      },
      backgroundColor: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'bg-white',
      },
    }, {
      timestamps: true,
      tableName: 'posts',
    });

    CommentTest = testDb.define('Comment', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      postId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: PostTest,
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: UserTest,
          key: 'id',
        },
      },
      content: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [1, 100],
          notEmpty: true,
        },
      },
    }, {
      timestamps: true,
      tableName: 'comments',
    });

    UserTest.hasMany(PostTest, { foreignKey: 'userId', as: 'posts' });
    PostTest.belongsTo(UserTest, { foreignKey: 'userId', as: 'user' });
    
    UserTest.hasMany(CommentTest, { foreignKey: 'userId', as: 'comments' });
    CommentTest.belongsTo(UserTest, { foreignKey: 'userId', as: 'user' });
    
    PostTest.hasMany(CommentTest, { foreignKey: 'postId', as: 'comments' });
    CommentTest.belongsTo(PostTest, { foreignKey: 'postId', as: 'post' });

    await testDb.sync({ force: true });
  });

  afterAll(async () => {
    await testDb.close();
  });

  beforeEach(async () => {
    await CommentTest.destroy({ where: {}, truncate: true });
    await PostTest.destroy({ where: {}, truncate: true });
    await UserTest.destroy({ where: {}, truncate: true });
  });

  describe('User-Post Relationships', () => {
    test('should create user with posts', async () => {
      const user = await UserTest.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const post1 = await PostTest.create({
        userId: user.id,
        content: 'First post'
      });

      const post2 = await PostTest.create({
        userId: user.id,
        content: 'Second post'
      });

      const userWithPosts = await UserTest.findByPk(user.id, {
        include: [{ model: PostTest, as: 'posts' }]
      });

      expect(userWithPosts.posts).toHaveLength(2);
      expect(userWithPosts.posts[0].content).toBe('First post');
      expect(userWithPosts.posts[1].content).toBe('Second post');
    });

    test('should find post with user', async () => {
      const user = await UserTest.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const post = await PostTest.create({
        userId: user.id,
        content: 'Test post'
      });

      const postWithUser = await PostTest.findByPk(post.id, {
        include: [{ model: UserTest, as: 'user' }]
      });

      expect(postWithUser.user.username).toBe('testuser');
      expect(postWithUser.user.email).toBe('test@example.com');
    });
  });

  describe('Post-Comment Relationships', () => {
    test('should create post with comments', async () => {
      const user = await UserTest.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const post = await PostTest.create({
        userId: user.id,
        content: 'Test post'
      });

      const comment1 = await CommentTest.create({
        postId: post.id,
        userId: user.id,
        content: 'First comment'
      });

      const comment2 = await CommentTest.create({
        postId: post.id,
        userId: user.id,
        content: 'Second comment'
      });

      const postWithComments = await PostTest.findByPk(post.id, {
        include: [{ model: CommentTest, as: 'comments' }]
      });

      expect(postWithComments.comments).toHaveLength(2);
      expect(postWithComments.comments[0].content).toBe('First comment');
      expect(postWithComments.comments[1].content).toBe('Second comment');
    });

    test('should find comment with post and user', async () => {
      const user = await UserTest.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const post = await PostTest.create({
        userId: user.id,
        content: 'Test post'
      });

      const comment = await CommentTest.create({
        postId: post.id,
        userId: user.id,
        content: 'Test comment'
      });

      const commentWithRelations = await CommentTest.findByPk(comment.id, {
        include: [
          { model: PostTest, as: 'post' },
          { model: UserTest, as: 'user' }
        ]
      });

      expect(commentWithRelations.post.content).toBe('Test post');
      expect(commentWithRelations.user.username).toBe('testuser');
    });
  });

  describe('Complex Queries', () => {
    test('should find user with posts and comments', async () => {
      const user = await UserTest.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const post = await PostTest.create({
        userId: user.id,
        content: 'Test post'
      });

      await CommentTest.create({
        postId: post.id,
        userId: user.id,
        content: 'Test comment'
      });

      const userWithAll = await UserTest.findByPk(user.id, {
        include: [
          {
            model: PostTest,
            as: 'posts',
            include: [{ model: CommentTest, as: 'comments' }]
          },
          { model: CommentTest, as: 'comments' }
        ]
      });

      expect(userWithAll.posts).toHaveLength(1);
      expect(userWithAll.posts[0].comments).toHaveLength(1);
      expect(userWithAll.comments).toHaveLength(1);
    });

    test('should handle multiple users and posts', async () => {
      const user1 = await UserTest.create({
        username: 'user1',
        fullName: 'User One',
        email: 'user1@example.com',
        password: 'password123'
      });

      const user2 = await UserTest.create({
        username: 'user2',
        fullName: 'User Two',
        email: 'user2@example.com',
        password: 'password123'
      });

      const post1 = await PostTest.create({
        userId: user1.id,
        content: 'Post by user 1'
      });

      const post2 = await PostTest.create({
        userId: user2.id,
        content: 'Post by user 2'
      });

      await CommentTest.create({
        postId: post1.id,
        userId: user2.id,
        content: 'User 2 commenting on user 1 post'
      });

      await CommentTest.create({
        postId: post2.id,
        userId: user1.id,
        content: 'User 1 commenting on user 2 post'
      });

      const allPosts = await PostTest.findAll({
        include: [
          { model: UserTest, as: 'user' },
          {
            model: CommentTest,
            as: 'comments',
            include: [{ model: UserTest, as: 'user' }]
          }
        ]
      });

      expect(allPosts).toHaveLength(2);
      expect(allPosts[0].comments).toHaveLength(1);
      expect(allPosts[1].comments).toHaveLength(1);
      
      expect(allPosts[0].user.username).toBe('user1');
      expect(allPosts[0].comments[0].user.username).toBe('user2');
      
      expect(allPosts[1].user.username).toBe('user2');
      expect(allPosts[1].comments[0].user.username).toBe('user1');
    });
  });

  describe('Cascade Operations', () => {
    test('should handle foreign key constraints', async () => {
      const user = await UserTest.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const post = await PostTest.create({
        userId: user.id,
        content: 'Test post'
      });

      const comment = await CommentTest.create({
        postId: post.id,
        userId: user.id,
        content: 'Test comment'
      });

      expect(comment.postId).toBe(post.id);
      expect(comment.userId).toBe(user.id);
      expect(post.userId).toBe(user.id);
    });

    test('should count related records', async () => {
      const user = await UserTest.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const post = await PostTest.create({
        userId: user.id,
        content: 'Test post'
      });

      await CommentTest.bulkCreate([
        { postId: post.id, userId: user.id, content: 'Comment 1' },
        { postId: post.id, userId: user.id, content: 'Comment 2' },
        { postId: post.id, userId: user.id, content: 'Comment 3' }
      ]);

      const commentCount = await CommentTest.count({
        where: { postId: post.id }
      });

      const postCount = await PostTest.count({
        where: { userId: user.id }
      });

      expect(commentCount).toBe(3);
      expect(postCount).toBe(1);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain referential integrity', async () => {
      const user = await UserTest.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const post = await PostTest.create({
        userId: user.id,
        content: 'Test post'
      });

      const comment = await CommentTest.create({
        postId: post.id,
        userId: user.id,
        content: 'Test comment'
      });

      const foundComment = await CommentTest.findByPk(comment.id);
      const foundPost = await PostTest.findByPk(post.id);
      const foundUser = await UserTest.findByPk(user.id);

      expect(foundComment.postId).toBe(foundPost.id);
      expect(foundComment.userId).toBe(foundUser.id);
      expect(foundPost.userId).toBe(foundUser.id);
    });

    test('should handle transaction rollback', async () => {
      const transaction = await testDb.transaction();

      try {
        const user = await UserTest.create({
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        }, { transaction });

        const post = await PostTest.create({
          userId: user.id,
          content: 'Test post'
        }, { transaction });

        await CommentTest.create({
          postId: post.id,
          userId: user.id,
          content: ''
        }, { transaction });

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        
        const userCount = await UserTest.count();
        const postCount = await PostTest.count();
        const commentCount = await CommentTest.count();
        
        expect(userCount).toBe(0);
        expect(postCount).toBe(0);
        expect(commentCount).toBe(0);
      }
    });
  });
});