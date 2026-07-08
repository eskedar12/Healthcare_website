import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Content = sequelize.define('Content', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    page: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    section: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'content',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['page', 'section']
      }
    ]
  })

  Content.associate = (models) => {
    Content.belongsTo(models.User, { foreignKey: 'created_by' })
  }

  return Content
}