import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    distance: {
      type: Number,
      required: [true, "Distance is required"],
      min: [1, "Distance must be greater than 0"],
    },
    photo: {
      type: String,
      required: [true, "Photo is required"],
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive value"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Maximum group size is required"],
      min: [1, "Group size must be at least 1"],
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware to generate slug from title
tourSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Static method to fetch featured tours
tourSchema.statics.findFeatured = function () {
  return this.find({ featured: true });
};

// Static method to calculate average rating
tourSchema.statics.calculateAverageRating = async function (tourId) {
  const result = await this.aggregate([
    { $match: { _id: tourId } },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviewDetails",
      },
    },
    {
      $unwind: "$reviewDetails",
    },
    {
      $group: {
        _id: "$_id",
        averageRating: { $avg: "$reviewDetails.rating" },
      },
    },
  ]);

  if (result.length > 0) {
    await this.findByIdAndUpdate(tourId, { averageRating: result[0].averageRating });
  }
};

// Text index for search functionality
tourSchema.index({ title: "text", city: "text", desc: "text" });

export default mongoose.model("Tour", tourSchema);
