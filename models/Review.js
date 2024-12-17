const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
   movie: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Movie', 
      required: true 
   },
   user: { 
      type: String, 
      required: true 
   },
   comment: { 
      type: String, 
      required: true 
   }
}, { versionKey: false });

module.exports = mongoose.model('Review', ReviewSchema);
