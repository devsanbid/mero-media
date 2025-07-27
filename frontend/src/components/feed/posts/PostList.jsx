import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts }) => {
  return (
    <>
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </>
  );
};

export default PostList;