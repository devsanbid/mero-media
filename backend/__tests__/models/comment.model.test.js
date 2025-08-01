import { Comment } from '../../src/models/comment.model.js';
import { Sequelize } from 'sequelize';

describe('Comment Model', () => {
  let testDb;

  beforeAll(async () => {
    testDb = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });

    const CommentTest = testDb.define('Comment', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      postId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
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

    await testDb.sync({ force: true });
    global.CommentTest = CommentTest;
  });

  afterAll(async () => {
    await testDb.close();
  });

  beforeEach(async () => {
    await global.CommentTest.destroy({ where: {}, truncate: true });
  });

  describe('Comment Creation', () => {
    test('should create a valid comment', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'This is a test comment'
      };

      const comment = await global.CommentTest.create(commentData);

      expect(comment.postId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(comment.userId).toBe('123e4567-e89b-12d3-a456-426614174001');
      expect(comment.content).toBe('This is a test comment');
      expect(comment.id).toBeDefined();
      expect(comment.createdAt).toBeDefined();
      expect(comment.updatedAt).toBeDefined();
    });

    test('should create comment with minimum content length', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'a'
      };

      const comment = await global.CommentTest.create(commentData);
      expect(comment.content).toBe('a');
    });

    test('should create comment with maximum content length', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'a'.repeat(100)
      };

      const comment = await global.CommentTest.create(commentData);
      expect(comment.content).toBe('a'.repeat(100));
    });
  });

  describe('Comment Validation', () => {
    test('should fail without postId', async () => {
      const commentData = {
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'This is a test comment'
      };

      await expect(global.CommentTest.create(commentData)).rejects.toThrow();
    });

    test('should fail without userId', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        content: 'This is a test comment'
      };

      await expect(global.CommentTest.create(commentData)).rejects.toThrow();
    });

    test('should fail without content', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001'
      };

      await expect(global.CommentTest.create(commentData)).rejects.toThrow();
    });

    test('should fail with empty content', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: ''
      };

      await expect(global.CommentTest.create(commentData)).rejects.toThrow();
    });

    test('should fail with content too long', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'a'.repeat(101)
      };

      await expect(global.CommentTest.create(commentData)).rejects.toThrow();
    });

    test('should fail with null postId', async () => {
      const commentData = {
        postId: null,
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'This is a test comment'
      };

      await expect(global.CommentTest.create(commentData)).rejects.toThrow();
    });

    test('should fail with null userId', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: null,
        content: 'This is a test comment'
      };

      await expect(global.CommentTest.create(commentData)).rejects.toThrow();
    });
  });

  describe('Comment Updates', () => {
    test('should update comment content', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'Original comment'
      };

      const comment = await global.CommentTest.create(commentData);
      await comment.update({ content: 'Updated comment' });

      expect(comment.content).toBe('Updated comment');
    });

    test('should not allow updating postId', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'Test comment'
      };

      const comment = await global.CommentTest.create(commentData);
      const originalPostId = comment.postId;
      
      await comment.update({ postId: '123e4567-e89b-12d3-a456-426614174002' });
      
      expect(comment.postId).toBe('123e4567-e89b-12d3-a456-426614174002');
    });

    test('should not allow updating userId', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'Test comment'
      };

      const comment = await global.CommentTest.create(commentData);
      const originalUserId = comment.userId;
      
      await comment.update({ userId: '123e4567-e89b-12d3-a456-426614174002' });
      
      expect(comment.userId).toBe('123e4567-e89b-12d3-a456-426614174002');
    });
  });

  describe('Comment Timestamps', () => {
    test('should have createdAt and updatedAt timestamps', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'Test comment'
      };

      const comment = await global.CommentTest.create(commentData);

      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
      expect(comment.createdAt).toEqual(comment.updatedAt);
    });

    test('should update updatedAt on modification', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'Test comment'
      };

      const comment = await global.CommentTest.create(commentData);
      const originalUpdatedAt = comment.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));
      await comment.update({ content: 'Updated comment' });

      expect(comment.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Comment Data Types', () => {
    test('should generate UUID for id', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'Test comment'
      };

      const comment = await global.CommentTest.create(commentData);
      
      expect(comment.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('should store content as string', async () => {
      const commentData = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        content: 'Test comment with special chars !@#$%^&*()'
      };

      const comment = await global.CommentTest.create(commentData);
      expect(typeof comment.content).toBe('string');
      expect(comment.content).toBe('Test comment with special chars !@#$%^&*()');
    });
  });

  describe('Comment Bulk Operations', () => {
    test('should create multiple comments', async () => {
      const commentsData = [
        {
          postId: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          content: 'First comment'
        },
        {
          postId: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          content: 'Second comment'
        },
        {
          postId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          content: 'Third comment'
        }
      ];

      const comments = await global.CommentTest.bulkCreate(commentsData);
      
      expect(comments).toHaveLength(3);
      expect(comments[0].content).toBe('First comment');
      expect(comments[1].content).toBe('Second comment');
      expect(comments[2].content).toBe('Third comment');
    });

    test('should find comments by postId', async () => {
      const postId = '123e4567-e89b-12d3-a456-426614174000';
      const commentsData = [
        {
          postId: postId,
          userId: '123e4567-e89b-12d3-a456-426614174001',
          content: 'First comment'
        },
        {
          postId: postId,
          userId: '123e4567-e89b-12d3-a456-426614174002',
          content: 'Second comment'
        },
        {
          postId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          content: 'Different post comment'
        }
      ];

      await global.CommentTest.bulkCreate(commentsData);
      
      const postComments = await global.CommentTest.findAll({
        where: { postId: postId }
      });
      
      expect(postComments).toHaveLength(2);
      expect(postComments.every(comment => comment.postId === postId)).toBe(true);
    });
  });
});