import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    reviewText: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
    },
  },
  { timestamps: true }
);

// Static method to calculate the average rating for a product
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  return result.length > 0 ? result[0].averageRating : 0;
};

// Static method to fetch reviews for a specific product
reviewSchema.statics.findByProductId = function (productId) {
  return this.find({ productId }).sort({ createdAt: -1 }); // Sorted by most recent first
};

// Index for faster querying by productId
reviewSchema.index({ productId: 1 });

export default mongoose.model("Review", reviewSchema);
