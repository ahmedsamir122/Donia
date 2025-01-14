const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please write your username"],
      unique: [true, "this username already exists"],
    },
    email: {
      type: String,
      // required: [true, "Please write your email"],
      unique: [true, "this email already exists"],
      sparse: true, // This allows MongoDB to ignore null values when enforcing uniqueness
      lowercase: true,
      validate: [validator.isEmail, "Please write avalid email"],
    },
    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/dxgixa7am/image/upload/v1682952134/Donia/avatar_hhygwq.jpg",
    },
    city: {
      type: String,
      required: [true, "Please write your city name"],
    },
    country: {
      type: String,
      required: [true, "Please write your country name"],
    },
    filterValues: {
      type: Array,
    },
    password: {
      type: String,
      required: [true, "Please write your password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please write your password"],
      validate: {
        validator: function (el) {
          return this.password === el;
        },
        message: "Password isn't the same!",
      },
    },
    perform: {
      type: String,
      enum: ["talent", "client", "manager"],
      default: "talent",
    },
    category: {
      type: [String],
      enum: {
        values: [
          "Actor",
          "Singer",
          "Comedian",
          "Model",
          "Mc/Host",
          "Influencer",
          "Expertise",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    bio: {
      type: String,
      maxLength: [1000, "the bio must have less or eqaul than 1000 characters"],
    },
    ratingsAverageF: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsAverageC: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantityF: {
      type: Number,
      default: 0,
    },
    ratingsQuantityC: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["admin", "user", "supervisor"],
      default: "user",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "3d",
        "1w",
        "2w",
        "1m",
        "diactive",
        "blocked",
      ],
      default: "pending",
    },
    links: [String],
    phone: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    alreadyWithdraw: {
      type: Number,
      default: 0,
    },
    talents: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    blockUntill: Date,
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  passwordCandidate,
  userPassword
) {
  passwordCandidate = passwordCandidate.toString();
  return await bcrypt.compare(passwordCandidate, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimesstamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimesstamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
