import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
      required: true, // Ensures the review is tied to a product
      index: true,    // Optimizes queries based on productId
    },
    username: {
      type: String,
      required: true,
      trim: true, // Removes leading and trailing spaces
    },
    reviewText: {
      type: String,
      required: true,
      trim: true, // Removes leading and trailing spaces
      minlength: [10, "Review text must be at least 10 characters"], // Enforces minimum length
    },
    rating: {
      type: Number,
      required: true,
      min: [0, "Rating must be at least 0"], // Enforces minimum value
      max: [5, "Rating cannot exceed 5"],   // Enforces maximum value
    },
  },
  { timestamps: true }
);

// Add an index for frequently queried fields
reviewSchema.index({ productId: 1, createdAt: -1 });

// Virtual field to calculate the average rating for a product
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId: mongoose.Types.ObjectId(productId) } },
    { $group: { _id: "$productId", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
  ]);

  return result.length > 0
    ? { averageRating: result[0].averageRating, reviewCount: result[0].reviewCount }
    : { averageRating: 0, reviewCount: 0 };
};

// Pre-save middleware to log a review creation
reviewSchema.pre("save", function (next) {
  console.log(`Review by ${this.username} is being saved for product ${this.productId}`);
  next();
});

// Post-save middleware to trigger recalculation of product rating
reviewSchema.post("save", async function (doc) {
  const { averageRating, reviewCount } = await this.constructor.calculateAverageRating(doc.productId);
  console.log(`New average rating for product ${doc.productId}: ${averageRating} (${reviewCount} reviews)`);
  // You can also update the product's average rating in the Tour model here if needed.
});

// Post-remove middleware to trigger recalculation of product rating
reviewSchema.post("remove", async function (doc) {
  const { averageRating, reviewCount } = await this.constructor.calculateAverageRating(doc.productId);
  console.log(`Updated average rating for product ${doc.productId}: ${averageRating} (${reviewCount} reviews)`);
});

export default mongoose.model("Review", reviewSchema);
