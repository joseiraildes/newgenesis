const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize/config.js");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  post_like: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Post;