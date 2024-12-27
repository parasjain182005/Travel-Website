import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    photo: {
      type: String,
      default: "https://example.com/default-profile.png", // Replace with your default URL
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Instance method to verify password
userSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Static method to find active users
userSchema.statics.findActiveUsers = function () {
  return this.find({ status: "active" });
};

// Soft delete method
userSchema.methods.deactivate = async function () {
  this.status = "inactive";
  await this.save();
};

// Ensure unique constraints are indexed
userSchema.index({ username: 1, email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
