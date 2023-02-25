const { Model, Validator} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, username, email } = this; 
      return { id, username, email };
    }
    
    static associate(models) {
      User.hasMany(models.Spot, { foreignKey: 'ownerId' });
      User.hasMany(models.Booking, { foreignKey: 'userId' });
      User.hasMany(models.Review, { foreignKey: 'userId' });
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (user && user.validatePassword(password)) {
        return await User.findByPk(user.id);
        }
      }

       static async signup({ firstName, lastName, username, email, password }) {
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
          firstName,
          lastName,
          username,
          email,
          hashedPassword
        });
        return await User.scope('currentUser').findByPk(user.id);
      }

  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [4, 30],
          isNotEmail(v) {
            if (Validator.isEmail(v)) {
              throw new Error("Cannot be an email.")
            }
          }
        }
      },
      email: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 256],
        isEmail: true
      },
      allowNull: false
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      } 
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      },
    
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] }
        },
        loginUser: {
          attributes: { }
        }
      }
    }
  );
  return User;
};