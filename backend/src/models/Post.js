import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Array of paragraph strings, rendered one <p> per entry on the detail page.
    content: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return Post
}
