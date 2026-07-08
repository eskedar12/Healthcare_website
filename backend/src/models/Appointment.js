import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    appointment_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    patient_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'doctors',
        key: 'id'
      }
    },
    doctor_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    branch: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Confirmed', 'Checked In', 'Cancelled'),
      defaultValue: 'Pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'appointments',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Doctor, { foreignKey: 'doctor_id' })
    Appointment.belongsTo(models.User, { foreignKey: 'created_by' })
    Appointment.belongsTo(models.Patient, { foreignKey: 'patient_id' })
  }

  return Appointment
}