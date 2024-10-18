import { Router } from 'express'
import { PostController } from './post.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.utils'


const router = Router()






// router.post(
//   '/upvote/:id',
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   PostController.upVotes,
// )

// router.post(
//   '/downvote/:id',
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   PostController.downVotes,
// )

// router.get('/:id', PostController.getUserPost)

// router.get('/get-all-posts/tableData', PostController.getAllPostsForTable)

// // get all post
// router.get(
//   '/',
//   auth(USER_ROLE.user, USER_ROLE.admin),
//   PostController.getAllPost,
// )


router.post('/create', PostController.createPost)

router.get("/get-all", PostController.getAllPosts);

// get post by id
router.get("/get-single/:id", PostController.getPostById);

// update post 
router.put('/update/:id', PostController.updatePost)

router.delete('/:id', PostController.deletePost)


router.put(
  "/voting/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostController.votePost,
);



router.get(
  "/get-current-user-post",
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostController.getCurrentUserPost,
);

export const PostRoute = router