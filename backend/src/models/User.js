import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(
        'super_admin',
        'hospital_admin',
        'branch_manager',
        'content_editor',
        'reception_officer',
        'marketing_officer'
      ),
      defaultValue: 'reception_officer'
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'branches',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  // Role permissions
  User.getRolePermissions = (role) => {
    const permissions = {
      super_admin: ['manage_users', 'manage_all_branches', 'manage_doctors', 'manage_services', 'manage_appointments', 'manage_content', 'manage_marketing', 'view_dashboard'],
      hospital_admin: ['manage_doctors', 'manage_services', 'manage_appointments', 'manage_content', 'view_dashboard'],
      branch_manager: ['manage_branch', 'manage_appointments', 'view_dashboard'],
      content_editor: ['manage_content', 'view_dashboard'],
      reception_officer: ['manage_appointments', 'view_dashboard'],
      marketing_officer: ['manage_marketing', 'view_dashboard']
    }
    return permissions[role] || []
  }

  User.associate = (models) => {
    User.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' })
    User.hasMany(models.Appointment, { foreignKey: 'created_by' })
    User.hasMany(models.Content, { foreignKey: 'created_by' })
  }

  return User
}
