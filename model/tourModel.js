const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// Modle is like a blue print to create documents
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a price'],
      unique: [true, 'Duplicate tour name'],
      trim: true,
      maxlength: [40, 'A tour name must have less or equal 40 characters'],
      minlength: [10, 'A tour name must have atleast 10 characters'],
      // validate: [
      //   validator.isAlpha,
      //   'Tour name ({VALUE}) should not contain anything other than alphabetic characters',
      // ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      trim: true,
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'Difficultly is either easy, difficult, or medium',
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less than or equal to 5.0'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'The discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tourm must have a summary'],
      trim: true,
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover photo'],
      trim: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //longtude first then latitude second
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ ratingsAverage: 1, price: -1 });
tourSchema.index({ slug: -1 });

tourSchema.virtual('durationWeeks').get(function () {
  return +(this.duration / 7).toFixed(2);
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE runs before the save and create command
// it doesnt run at insertmany command
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// tourSchema.pre('save', async function (next) {
//   const guides = await Promise.all(this.guides.map((id) => User.findById(id)));

//   this.guides = guides.filter(
//     (guide) => guide.role === 'guide' || guide.role === 'lead-guide'
//   );

//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // ^ in regular expression means starts with
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();

  next();
});

// POPULATE THE GUIDES
tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v -passwordChangedAts -email' });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  //gets access to the documents get returns
  console.log(`Query took ${(Date.now() - this.start) / 1000} seconds`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

module.exports = mongoose.model('Tour', tourSchema);
