const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Auto-generates UUIDs
    primaryKey: true,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  encrypted_password: {
    type: DataTypes.TEXT,
    allowNull: true, // Null for Google OAuth users
  },
  provider: {
    type: DataTypes.ENUM('local', 'google'),
    allowNull: false,
    defaultValue: 'local',
  },
  google_id: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: true, // Null for local users
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true, // Only populated for active sessions
  },
  profile_picture: {
    type: DataTypes.TEXT,
    allowNull: true, // Can be null initially
  },
}, {
  timestamps: true, // Auto-adds createdAt and updatedAt
  underscored: true, // Optional: uses snake_case for auto-added fields
});

module.exports = User;