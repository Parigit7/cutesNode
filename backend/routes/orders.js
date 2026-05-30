const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Apply auth to all order routes
router.use(auth);

// Helper function to format order output matching Spring Boot DTOs
function formatOrder(order) {
  return {
    orderId: order.orderId,
    packingType: order.packingType,
    boxPrice: order.boxPrice,
    // Format requiredDate as YYYY-MM-DD to match Java LocalDate
    requiredDate: order.requiredDate ? new Date(order.requiredDate).toISOString().split('T')[0] : null,
    message: order.message,
    status: order.status,
    courierName: order.courierName,
    courierNumber: order.courierNumber,
    createdBy: order.createdBy,
    packedBy: order.packedBy,
    customerName: order.customerName,
    customerAddress: order.customerAddress,
    customerPhone1: order.customerPhone1,
    customerPhone2: order.customerPhone2,
    orderItems: order.orderItems.map(item => {
      const actualItem = item.item || {};
      return {
        id: item._id ? item._id.toString() : null,
        itemId: actualItem._id ? actualItem._id.toString() : (item.item ? item.item.toString() : null),
        itemCode: actualItem.code || '',
        itemTitle: actualItem.title || '',
        itemImage: actualItem.image || '',
        color: item.color,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      };
    })
  };
}

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('orderItems.item');
    res.json(orders.map(formatOrder));
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper: Adjust quantity for a specific item color
async function adjustQuantity(itemId, colorName, quantityChange) {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new Error('Item not found');
  }

  const trimmedColor = colorName ? colorName.trim().toLowerCase() : '';
  const colorMatch = item.colors.find(c => c.name.trim().toLowerCase() === trimmedColor);
  
  if (!colorMatch) {
    throw new Error(`Color '${colorName}' not found for item: ${item.code}`);
  }

  if (colorMatch.qty < quantityChange) {
    throw new Error(`Insufficient quantity for color: ${colorName}. Available: ${colorMatch.qty}`);
  }

  colorMatch.qty -= quantityChange;
  await item.save();
  return item;
}

// Helper: Restore quantity for a specific item color
async function restoreQuantity(itemId, colorName, quantityToRestore) {
  const item = await Item.findById(itemId);
  if (!item) return;

  const trimmedColor = colorName ? colorName.trim().toLowerCase() : '';
  const colorMatch = item.colors.find(c => c.name.trim().toLowerCase() === trimmedColor);

  if (colorMatch) {
    colorMatch.qty += quantityToRestore;
    await item.save();
  }
}

// Create Order (Sales or Admin)
router.post('/', authorize('SALES_MANAGEMENT', 'ADMIN'), async (req, res) => {
  try {
    const dto = req.body;
    
    // Check if orderId already exists
    const existingOrder = await Order.findOne({ orderId: dto.orderId });
    if (existingOrder) {
      return res.status(400).json({ error: 'Order ID already exists' });
    }

    // Adjust quantities
    const orderItems = [];
    try {
      for (const itemDto of dto.orderItems) {
        await adjustQuantity(itemDto.itemId, itemDto.color, itemDto.quantity);
        orderItems.push({
          item: itemDto.itemId,
          color: itemDto.color,
          quantity: itemDto.quantity,
          totalPrice: itemDto.totalPrice
        });
      }
    } catch (qtyErr) {
      // Rollback any adjusted quantities if there's an error mid-way
      for (const rolledBackItem of orderItems) {
        await restoreQuantity(rolledBackItem.item, rolledBackItem.color, rolledBackItem.quantity);
      }
      return res.status(400).json({ error: qtyErr.message });
    }

    const order = new Order({
      orderId: dto.orderId,
      packingType: dto.packingType,
      boxPrice: dto.boxPrice,
      requiredDate: new Date(dto.requiredDate),
      message: dto.message,
      createdBy: req.user.username,
      customerName: dto.customerName,
      customerAddress: dto.customerAddress,
      customerPhone1: dto.customerPhone1,
      customerPhone2: dto.customerPhone2,
      orderItems: orderItems
    });

    await order.save();
    
    // Return populated order
    const populated = await Order.findById(order._id).populate('orderItems.item');
    res.json(formatOrder(populated));
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Order (Sales or Admin)
router.put('/:id', authorize('SALES_MANAGEMENT', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const dto = req.body;

    const existingOrder = await Order.findOne({ orderId: id });
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // 1. Restore old quantities
    for (const oldItem of existingOrder.orderItems) {
      await restoreQuantity(oldItem.item, oldItem.color, oldItem.quantity);
    }

    // 2. Adjust new quantities and prepare new order items list
    const newOrderItems = [];
    try {
      for (const itemDto of dto.orderItems) {
        await adjustQuantity(itemDto.itemId, itemDto.color, itemDto.quantity);
        newOrderItems.push({
          item: itemDto.itemId,
          color: itemDto.color,
          quantity: itemDto.quantity,
          totalPrice: itemDto.totalPrice
        });
      }
    } catch (qtyErr) {
      // Rollback adjustments on error and put back the original quantities!
      for (const rolledBackItem of newOrderItems) {
        await restoreQuantity(rolledBackItem.item, rolledBackItem.color, rolledBackItem.quantity);
      }
      for (const oldItem of existingOrder.orderItems) {
        await adjustQuantity(oldItem.item, oldItem.color, oldItem.quantity);
      }
      return res.status(400).json({ error: qtyErr.message });
    }

    // 3. Update fields
    existingOrder.packingType = dto.packingType;
    existingOrder.boxPrice = dto.boxPrice;
    existingOrder.requiredDate = new Date(dto.requiredDate);
    existingOrder.message = dto.message;
    existingOrder.customerName = dto.customerName;
    existingOrder.customerAddress = dto.customerAddress;
    existingOrder.customerPhone1 = dto.customerPhone1;
    existingOrder.customerPhone2 = dto.customerPhone2;
    if (dto.status) {
      existingOrder.status = dto.status.toUpperCase();
    }
    
    // Clear and set new items
    existingOrder.orderItems = newOrderItems;

    await existingOrder.save();

    const populated = await Order.findById(existingOrder._id).populate('orderItems.item');
    res.json(formatOrder(populated));
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Order Status (Package or Admin)
router.put('/:id/status', authorize('ADMIN', 'PACKAGE'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, courierName, courierNumber } = req.body;

    const existingOrder = await Order.findOne({ orderId: id });
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) {
      existingOrder.status = status.toUpperCase();
      if (status.toUpperCase() === 'PACKED' || status.toUpperCase() === 'SEND') {
        existingOrder.packedBy = req.user.username;
      }
    }

    if (courierName !== undefined) {
      existingOrder.courierName = courierName;
    }

    if (courierNumber !== undefined) {
      existingOrder.courierNumber = courierNumber;
    }

    await existingOrder.save();

    const populated = await Order.findById(existingOrder._id).populate('orderItems.item');
    res.json(formatOrder(populated));
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Order (Sales or Admin)
router.delete('/:id', authorize('SALES_MANAGEMENT', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const existingOrder = await Order.findOne({ orderId: id });
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Restore quantities
    for (const item of existingOrder.orderItems) {
      await restoreQuantity(item.item, item.color, item.quantity);
    }

    await Order.findByIdAndDelete(existingOrder._id);
    res.status(204).end();
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
