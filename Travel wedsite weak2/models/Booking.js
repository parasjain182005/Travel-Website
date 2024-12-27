import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming it references the User schema
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    tourName: {
      type: String,
      required: [true, "Tour name is required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    guestSize: {
      type: Number,
      required: [true, "Guest size is required"],
      min: [1, "Guest size must be at least 1"],
      max: [100, "Guest size cannot exceed 100"], // Arbitrary maximum limit
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^\d{10,15}$/.test(v); // Validates phone numbers between 10 and 15 digits
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    bookAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Static method to find bookings by user ID
bookingSchema.statics.findByUserId = function (userId) {
  return this.find({ userId });
};

// Static method to find bookings by email
bookingSchema.statics.findByUserEmail = function (email) {
  return this.find({ userEmail: email });
};

// Index for optimizing queries
bookingSchema.index({ userId: 1 });
bookingSchema.index({ tourName: 1 });

export default mongoose.model("Booking", bookingSchema);
