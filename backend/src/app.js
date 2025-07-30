import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'auth-token']
}))

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({limit: "50mb", extended: true}))
app.use(express.static("public"))
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())

// Default route to test if the server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// importing routes
import commentRoute from "./routes/comment.routes.js"
import friendRoute from "./routes/friendRequests.routes.js"
import postRoute from "./routes/post.routes.js"
import saves from "./routes/saves.routes.js"
import userRoute from "./routes/user.routes.js"
import storyRoute from "./routes/story.routes.js"
import notificationRoute from "./routes/notification.routes.js"
import followRoute from "./routes/follow.routes.js"
import adminRoute from "./routes/admin.routes.js"

app.use("/api/comments", commentRoute);
app.use("/api/friendRequests", friendRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/posts", postRoute);
app.use("/api/saves", saves);
app.use("/api/user", userRoute);
app.use("/api/story", storyRoute);
app.use("/api/follow", followRoute);
app.use("/api/admin", adminRoute);

export {app}
