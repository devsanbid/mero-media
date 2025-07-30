import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Home from './pages/user/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import Friends from './pages/user/Friends';
import Bookmarks from './pages/user/Bookmarks';
import Stories from './pages/user/Stories';
import Explore from './pages/user/Explore';
import People from './pages/user/People';
import Posts from './pages/user/Posts';
import PostDetail from './pages/PostDetail';
import PendingRequests from './pages/user/PendingRequests';
import SentRequests from './pages/user/SentRequests';
import Contact from './pages/user/Contact';
import Hashtags from './pages/user/Hashtags';
import Trending from './pages/user/Trending';
import StoryDetail from './pages/user/StoryDetail';
import MyPosts from './pages/user/MyPosts';
import User from './pages/user/User';
import Admin from './pages/admin/Admin';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-[#F5F6FA]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/user" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="profile/:profileId" element={<Profile />} />
              <Route path="me" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="friends" element={<Friends />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="stories" element={<Stories />} />
              <Route path="story/:storyId" element={<StoryDetail />} />
              <Route path="explore" element={<Explore />} />
              <Route path="people" element={<People />} />
              <Route path="posts" element={<Posts />} />
              <Route path="posts/:postId" element={<PostDetail />} />
              <Route path="my-posts" element={<MyPosts />} />
              <Route path="pending-requests" element={<PendingRequests />} />
              <Route path="sent-requests" element={<SentRequests />} />
              <Route path="contact" element={<Contact />} />
              <Route path="hashtags" element={<Hashtags />} />
              <Route path="trending" element={<Trending />} />
              <Route path="user-profile" element={<User />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Layout /></ProtectedRoute>}>
              <Route index element={<Admin />} />
            </Route>
           
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App
