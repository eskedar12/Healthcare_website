import { Post } from '../models/index.js'
import { Op } from 'sequelize'

// Turn a title into a URL-friendly slug, e.g. "Understanding Anxiety!" -> "understanding-anxiety"
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug
  let counter = 2
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const where = { slug }
    if (excludeId) where.id = { [Op.ne]: excludeId }
    const existing = await Post.findOne({ where })
    if (!existing) return slug
    slug = `${baseSlug}-${counter}`
    counter += 1
  }
}

// Blog posts are written/edited as one block of text in the admin form
// (one paragraph per line), but rendered as an array of paragraphs on the
// public site. Accept either shape coming in from the API.
const normalizeContent = (content) => {
  if (Array.isArray(content)) return content.map((p) => String(p).trim()).filter(Boolean)
  if (typeof content === 'string') {
    return content
      .split(/\r?\n\s*\r?\n|\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean)
  }
  return []
}

export const getAllPosts = async (filters = {}) => {
  const { search, category, publishedOnly } = filters
  const where = {}

  if (publishedOnly) where.is_published = true
  if (category) where.category = category

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { excerpt: { [Op.like]: `%${search}%` } }
    ]
  }

  return await Post.findAll({ where, order: [['published_at', 'DESC'], ['created_at', 'DESC']] })
}

export const getPostBySlug = async (slug) => {
  const post = await Post.findOne({ where: { slug } })
  if (!post) {
    throw new Error('Post not found')
  }
  return post
}

export const getPostById = async (id) => {
  const post = await Post.findByPk(id)
  if (!post) {
    throw new Error('Post not found')
  }
  return post
}

export const createPost = async (postData) => {
  const baseSlug = postData.slug ? slugify(postData.slug) : slugify(postData.title)
  const slug = await ensureUniqueSlug(baseSlug || 'post')

  return await Post.create({
    ...postData,
    slug,
    content: normalizeContent(postData.content),
    published_at: postData.published_at || new Date()
  })
}

export const updatePost = async (id, updateData) => {
  const post = await Post.findByPk(id)
  if (!post) {
    throw new Error('Post not found')
  }

  const nextData = { ...updateData }
  if (updateData.content !== undefined) {
    nextData.content = normalizeContent(updateData.content)
  }
  if (updateData.slug) {
    const baseSlug = slugify(updateData.slug)
    nextData.slug = await ensureUniqueSlug(baseSlug || 'post', id)
  }

  await post.update(nextData)
  return post
}

export const deletePost = async (id) => {
  const post = await Post.findByPk(id)
  if (!post) {
    throw new Error('Post not found')
  }
  await post.destroy()
  return true
}
