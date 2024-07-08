const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { resGenerator } = require("../../helper/helper");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is not valid");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    address: [
      {
        street: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        country: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
      },
    ],

    phone: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "any")) {
          throw new Error("Phone number is not valid");
        }
      },
    },

    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin"],
    },

    image: {
      type: String,
      default: "assets/default-User-Img.png",
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["male", "female"],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);
userSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.password;
  delete data.__v;
  return data;
};
userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.statics.logMe = async (email, password) => {
  const userData = await userModel.findOne({ email });
  if (!userData) throw new Error("User not found");
  const userPassword = userData.password;
  const isPasswordMatch = await bcrypt.compare(password, userPassword);
  if (!isPasswordMatch) throw new Error("User not found");

  return userData;
};
userSchema.statics.adminLogin = async (email, password) => {
  const userData = await userModel.findOne({ email });
  if (!userData) throw new Error("User not found");
  const userPassword = userData.password;
  const isPasswordMatch = await bcrypt.compare(password, userPassword);
  if (!isPasswordMatch) throw new Error("User not found");
  const isAdmin = userData.role === "admin";
  if (!isAdmin) throw new Error("User not found");

  return userData;
};

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id }, config.get("tokenKey"), {
    expiresIn: "15d",
  });
  this.tokens.push({ token: token });
  await this.save();

  return token;
};
const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;
