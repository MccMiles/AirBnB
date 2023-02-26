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
        validate: {
          notNull: {
            msg: "First Name is required"
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last Name is required"
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Username is already taken"
        },
        validate: {
          notEmpty: {
            msg: "Username is required"
          },
          len: {
            args: [4, 30],
            msg: "Username must be between 4 and 30 characters long"
          },
          isNotEmail: function (v) {
            if (Validator.isEmail(v)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email address is already registered"
        },
        validate: {
          notEmpty: {
            msg: "Email is required"
          },
          len: {
            args: [3, 256],
            msg: "Email must be between 3 and 256 characters long"
          },
          isEmail: {
            msg: "Invalid email"
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          len: { args: [60, 60] }
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



