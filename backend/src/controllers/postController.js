import {
  getAllPosts,
  getPostBySlug,
  getPostById,
  createPost as createPostService,
  updatePost as updatePostService,
  deletePost as deletePostService
} from '../services/postService.js'
import { sendSuccess, sendCreated } from '../utils/response.js'

// Public list. Like /services and /doctors, this returns everything and
// leaves is_published/is_active filtering to the caller — the admin table
// needs to see drafts, the public Blog page filters to published only.
export const getPosts = async (req, res, next) => {
  try {
    const posts = await getAllPosts(req.query)
    sendSuccess(res, 'Posts retrieved successfully', posts)
  } catch (error) {
    next(error)
  }
}

export const getPostBySlugHandler = async (req, res, next) => {
  try {
    const { slug } = req.params
    const post = await getPostBySlug(slug)
    sendSuccess(res, 'Post retrieved successfully', post)
  } catch (error) {
    next(error)
  }
}

export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await getPostById(id)
    sendSuccess(res, 'Post retrieved successfully', post)
  } catch (error) {
    next(error)
  }
}

export const createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.body)
    sendCreated(res, 'Post created successfully', post)
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await updatePostService(id, req.body)
    sendSuccess(res, 'Post updated successfully', post)
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params
    await deletePostService(id)
    sendSuccess(res, 'Post deleted successfully')
  } catch (error) {
    next(error)
  }
}
