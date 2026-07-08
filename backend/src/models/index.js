import sequelize from '../config/database.js'

// Import all models
import UserModel from './User.js'
import AppointmentModel from './Appointment.js'
import BranchModel from './Branch.js'
import DoctorModel from './Doctor.js'
import ServiceModel from './Service.js'
import ContentModel from './Content.js'
import PatientModel from './Patient.js'
import ProjectModel from './Project.js'
import PartnerModel from './Partner.js'
import ContactMessageModel from './ContactMessage.js'

// Initialize models with sequelize
const User = UserModel(sequelize)
const Appointment = AppointmentModel(sequelize)
const Branch = BranchModel(sequelize)
const Doctor = DoctorModel(sequelize)
const Service = ServiceModel(sequelize)
const Content = ContentModel(sequelize)
const Patient = PatientModel(sequelize)
const Project = ProjectModel(sequelize)
const Partner = PartnerModel(sequelize)
const ContactMessage = ContactMessageModel(sequelize)

// Set up associations
User.associate?.({ Appointment, Content, Branch })
Appointment.associate?.({ Doctor, User, Patient })
Branch.associate?.({ Doctor, User })
Doctor.associate?.({ Appointment })
Patient.associate?.({ Appointment })

// Export all models
export {
  sequelize,
  User,
  Appointment,
  Branch,
  Doctor,
  Service,
  Content,
  Patient,
  Project,
  Partner,
  ContactMessage
}

export default {
  sequelize,
  User,
  Appointment,
  Branch,
  Doctor,
  Service,
  Content,
  Patient,
  Project,
  Partner,
  ContactMessage
}