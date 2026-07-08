import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Branch = sequelize.define('Branch', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    working_hours: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'branches',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  Branch.associate = (models) => {
    Branch.hasMany(models.Doctor, { foreignKey: 'branch_id' })
    Branch.hasMany(models.User, { foreignKey: 'branch_id', as: 'users' })
  }

  return Branch
}