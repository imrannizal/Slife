const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Matches gen_random_uuid()
    allowNull: false
  },
  owner: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // References your users table
      key: 'id'
    },
    onDelete: 'CASCADE' // Matches ON DELETE CASCADE
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  content: {
    type: DataTypes.TEXT
    // No defaultValue as per your schema (defaults to NULL)
  },
  color: {
    type: DataTypes.TEXT,
    defaultValue: 'white' // Matches your DEFAULT
  },
  starred: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Matches your DEFAULT FALSE
  }
}, {
  tableName: 'notes', // Explicit table name mapping
  timestamps: true, // Enables createdAt and updatedAt
  createdAt: 'created_at', // Maps to your created_at column
  updatedAt: 'updated_at', // Maps to your updated_at column
  underscored: true, // Uses snake_case for automatic field naming
  hooks: {
    beforeUpdate: (note) => {
      note.updated_at = new Date(); // Ensure updated_at is always current
    }
  }
});

module.exports = Note;