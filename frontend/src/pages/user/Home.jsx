import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../redux/posts/postsSlice";
import PostForm from "../../components/feed/posts/PostForm";
import PostList from "../../components/feed/posts/PostList";
import { BsFillPostcardFill } from "react-icons/bs";
import StorySection from "../../components/feed/stories/StorySection";
import RunningServer from "../../components/RunningServer";
import axios from "axios";
import { ProfilePicVerify } from "../../components";

export default function Home() {
  const dispatch = useDispatch();
  const { posts: allPosts, loading: postsLoading } = useSelector((state) => state.posts);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [postsInitialized, setPostsInitialized] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API.replace('/api', '')}/`);
        if (response.data === "Server is running!") {
          setIsServerRunning(true);
        }
      } catch (error) {
        setIsServerRunning(false);
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    if(isServerRunning && !postsInitialized){
      dispatch(getAllPosts());
      setPostsInitialized(true);
    }
  }, [dispatch, isServerRunning, postsInitialized]);

  if (!isServerRunning) {
    return <RunningServer />;
  }

  return (
    <main className="bg-[#F5F6FA] mx-auto space-y-3 w-full min-h-screen">
      <ProfilePicVerify />
      <StorySection />
      <PostForm />
      {postsLoading ? (
        <div className="flex flex-col items-center justify-center text-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-500">Loading posts...</p>
        </div>
      ) : allPosts.length > 0 ? (
        <PostList posts={allPosts} />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-10">
          <BsFillPostcardFill className="text-gray-300 text-6xl mb-4" />
          <p className="text-xl text-gray-500">List of Posts.</p>
          <p className="text-sm text-gray-400 mt-2">
            No posts to show
          </p>
        </div>
      )}
    </main>
  );
}