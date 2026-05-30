const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  color: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  packingType: {
    type: String,
    required: true
  },
  boxPrice: {
    type: Number
  },
  requiredDate: {
    type: Date,
    required: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    default: 'PENDING',
    uppercase: true
  },
  courierName: {
    type: String
  },
  courierNumber: {
    type: String
  },
  createdBy: {
    type: String
  },
  packedBy: {
    type: String
  },
  customerName: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  customerPhone1: {
    type: String,
    required: true
  },
  customerPhone2: {
    type: String
  },
  orderItems: [orderItemSchema]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
