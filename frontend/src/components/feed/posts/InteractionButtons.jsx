import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getCommentsByPost } from "../../../redux/comments/commentsSlice";
import { getPostLikers, toggleLikePost } from "../../../redux/posts/postsSlice";
import LikersModal from "./LikersModal";

const InteractionButtons = ({
  post,
  userDetails,
  showComments,
  onToggleComments,
}) => {
  const dispatch = useDispatch();

  const [likers, setLikers] = useState([]);
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(false);
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(false);

  const { commentsByPostId } = useSelector((state) => state.comments);
  const comments = commentsByPostId[post.id] || [];

  const handleToggleBookmark = () => {
    setOptimisticBookmarked(!optimisticBookmarked);
  };

  const handleToggleLike = () => {
    const wasLiked = likers.some((liker) => liker.id === userDetails?.id);

    setOptimisticLiked(!wasLiked);

    let updatedLikers = [...likers];
    if (wasLiked) {
      updatedLikers = updatedLikers.filter(liker => liker.id !== userDetails?.id);
    } else if (userDetails) {
      updatedLikers.push(userDetails);
    }
    setLikers(updatedLikers);

    dispatch(toggleLikePost(post.id)).then(() => {
      dispatch(getPostLikers(post.id)).then((action) => {
        if (action.payload?.data) {
          setLikers(action.payload.data);
        }
      });
    });
  };

  const handleShowLikers = () => {
    setShowLikersModal(true);
  };

  const closeModal = () => {
    setShowLikersModal(false);
  };

  const handleSharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.user?.fullName}`,
        text: post.content?.substring(0, 100) + '...',
        url: window.location.origin + '/posts/' + post.id,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + '/posts/' + post.id);
    }
  };

  useEffect(() => {
    dispatch(getPostLikers(post.id)).then((action) => {
      if (action.payload?.data) {
        setLikers(action.payload.data);
      }
    });
  }, [dispatch, post]);

  useEffect(() => {
    setOptimisticLiked(likers.some((liker) => liker.id === userDetails?.id));
  }, [likers, userDetails]);

  useEffect(() => {
    dispatch(getCommentsByPost(post.id));
  }, [dispatch, post]);

  return (
    <>
      {likers.length > 0 && (
        <div
          className="flex items-center space-x-1.5 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all"
          onClick={handleShowLikers}
        >
          <div className="flex -space-x-3">
            {likers.slice(0, 3).map((liker) => (
              <img
                key={liker.id}
                src={liker.profilePicture}
                alt={liker.fullName}
                className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-md"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 hover:text-gray-800 transition">
            Liked by <strong>{likers.length}</strong> people
          </span>
        </div>
      )}

      {showLikersModal && <LikersModal likers={likers} closeModal={closeModal} />}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center pt-2 pb-1 border-t border-gray-100 mt-2"
      >
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              optimisticLiked
                ? "text-rose-600 bg-rose-50"
                : "text-gray-600 hover:bg-gray-100"
            } transition-all`}
          >
            <FiHeart className={`w-4 h-4 ${optimisticLiked ? "fill-rose-600" : ""}`} />
            <span className="text-sm font-medium">{likers.length}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleComments}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              showComments
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-600 hover:bg-gray-100"
            } transition-all`}
          >
            <FiMessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{comments.length} Comments</span>
          </motion.button>
        </div>

        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSharePost}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiShare2 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              optimisticBookmarked
                ? "text-fuchsia-600 bg-fuchsia-50"
                : "text-gray-600 hover:bg-gray-100"
            } transition-all`}
          >
            <FiBookmark className={`w-4 h-4 ${optimisticBookmarked ? "fill-fuchsia-600" : ""}`} />
            <span className="text-sm font-medium">{optimisticBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShowLikers}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiMoreHorizontal className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default InteractionButtons;