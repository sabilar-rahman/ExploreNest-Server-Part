import { Router } from 'express'
import { PostController } from './post.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.utils'


const router = Router()

router.post('/create', PostController.createPost)

router.post(
  '/upvote/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostController.upVotes,
)

router.post(
  '/downvote/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostController.downVotes,
)

router.get('/:id', PostController.getUserPost)

router.get('/get-all-posts/tableData', PostController.getAllPostsForTable)

// get all post
router.get(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostController.getAllPost,
)
// get post by id
router.get('/getPost/:postId', PostController.getPostById)

router.put('/update/:id', PostController.updatePost)

router.delete('/:id', PostController.deletePost)

export const PostRoute = router