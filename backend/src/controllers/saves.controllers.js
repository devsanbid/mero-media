import { SavedItem } from '../models/saves.model.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Controller to toggle an item in saves (add or remove)
export const toggleItemInSaves = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { post } = req.body;

    const existingSave = await SavedItem.findOne({ 
        where: { userId: userId, postId: post }
    });

    if (existingSave) {
        await existingSave.destroy();
        return res.status(200).json(new ApiResponse(200, 'Item removed from saves successfully'));
    }

    const savedItem = await SavedItem.create({ userId: userId, postId: post });
    res.status(201).json(new ApiResponse(201, 'Item saved successfully', savedItem));
});

// Controller to get all saved items of the logged-in user
export const getAllSaves = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const savedItems = await SavedItem.findAll({ 
        where: { userId: userId },
        include: [{
            model: Post,
            as: 'post',
            include: [{
                model: User,
                as: 'user',
                attributes: ['fullName', 'profilePicture', 'username']
            }]
        }]
    });

    res.status(200).json(new ApiResponse(200, 'Saved items fetched successfully', savedItems));
});
