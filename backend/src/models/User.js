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
    // Free-text role, typed in by whoever creates the account (e.g. "Nurse
    // Coordinator"). No longer restricted to a fixed enum list — the admin
    // decides the role name, and the permissions checkboxes decide what
    // that account can actually do.
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'staff'
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
    },
    // Custom, per-user permission overrides (e.g. an HR account that should
    // only be able to book/manage appointments). When null/empty, the
    // role's default permission set (below) is used instead.
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  // Default permission set per role — kept in sync with PERMISSIONS in the
  // admin frontend's src/utils/permissions.js. Used as a fallback whenever
  // a user doesn't have custom `permissions` set on their account.
  User.ALL_PERMISSIONS = [
    'manage_doctors',
    'view_doctors',
    'manage_services',
    'view_services',
    'manage_branches',
    'view_branches',
    'manage_appointments',
    'view_appointments',
    'manage_content',
    'view_content',
    'manage_staff',
    'view_contact_messages',
    'view_dashboard',
    'view_notifications'
  ]

  User.getRolePermissions = (role) => {
    if (role === 'super_admin') return User.ALL_PERMISSIONS

    const permissions = {
      hospital_admin: ['manage_doctors', 'manage_services', 'manage_appointments', 'manage_content', 'view_contact_messages', 'view_dashboard', 'view_notifications'],
      branch_manager: ['manage_appointments', 'view_dashboard', 'view_notifications'],
      content_editor: ['manage_content', 'view_dashboard'],
      reception_officer: ['manage_appointments', 'view_contact_messages', 'view_dashboard', 'view_notifications'],
      marketing_officer: ['view_dashboard', 'view_notifications']
    }
    return permissions[role] || []
  }

  // The permission set that actually applies to this user: their own
  // custom overrides if any are set, otherwise their role's defaults.
  // Super admin always has everything, regardless of what's stored.
  User.getEffectivePermissions = (user) => {
    if (user.role === 'super_admin') return User.ALL_PERMISSIONS
    if (Array.isArray(user.permissions) && user.permissions.length > 0) {
      return user.permissions
    }
    return User.getRolePermissions(user.role)
  }

  User.associate = (models) => {
    User.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' })
    User.hasMany(models.Appointment, { foreignKey: 'created_by' })
    User.hasMany(models.Content, { foreignKey: 'created_by' })
  }

  return User
}
