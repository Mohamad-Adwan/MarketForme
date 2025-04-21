const Global = require('../models/globalModel');
const PDFDocument = require('pdfkit');
const Order = require('../models/orderModel');
const fs = require('fs');
const path = require('path');
const globalController = {
  getstatus: async (req, res) => {
    try {
      const statuses = await Global.findOne(); // Only one expected
      res.status(200).json({showPrice:statuses.showPrice});
    } catch (err) {
      console.error("Get Status Error:", err);
      res.status(500).json({ error: "Failed to fetch global status" });
    }
  },

  setstatus: async (req, res) => {
    try {
      const { status } = req.body;

      let globalDoc = await Global.findOne();

      if (!globalDoc) {
        globalDoc = new Global({ showPrice: status });
      } else {
        globalDoc.showPrice = status;
      }

      await globalDoc.save();

      res.status(200).json(globalDoc);
    } catch (err) {
      console.error("Set Status Error:", err);
      res.status(500).json({ error: "Failed to update global status" });
    }
  },
  // In the backend controller
  printPDF : async (req, res) => {
    const { orderId } = req.query;

  
    const order = await Order.findOne({ id2: orderId }); // Replace with your actual DB call
    if (!order) return res.status(404).send('Order not found');
  
    const doc = new PDFDocument({ margin: 50 });
  
    // Pipe to HTTP response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
    doc.pipe(res);
  
    // Company Info
    doc.fontSize(18).font('Helvetica-Bold').text('Tech-Shop', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Tulkarm, West Bank', { align: 'left' });
    doc.text('Phone: (970) 595-642-327', { align: 'left' });
    doc.text('Email: support@Tech-Shop.com', { align: 'left' });
  
    doc.moveDown(2);
  
    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('Invoice', { align: 'center' });
    doc.moveDown(1);
  
    // Invoice Details
    const dueDate = new Date(order.date).toLocaleDateString('en-GB');
    const today = new Date().toLocaleDateString('en-GB');
  
    doc.fontSize(12).font('Helvetica')
      .text(`Invoice #${orderId}`, 405, doc.y, { align: 'left' })
      .text(`Date: ${today}`, 405, doc.y + 10, { align: 'left' })
      .text(`Due Date: ${dueDate}`, 405, doc.y + 15, { align: 'left' })
      .text(`Customer: ${order.userName}`, 405, doc.y + 20, { align: 'left' })
      .text(`Customer Number: ${order.phone}`, 405, doc.y + 25, { align: 'left' });
  
    doc.moveDown(4);
  
    // Table Header
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Item Name', 50, doc.y);
    doc.text('Qty', 320, doc.y-20, { align: 'center' });
    doc.text('Price', 400, doc.y-15, { align: 'right' });
  
    // Header line
    doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).strokeColor('#000').stroke();
  
    // Items
    doc.font('Helvetica').fontSize(12);
    let yPos = doc.y + 25;
  
    order.items.forEach((item) => {
      doc.text(item.itemname, 50, yPos);
      doc.text(item.quantity.toString(), 320, yPos, { align: 'center' });
      doc.text(`$${item.price.toFixed(2)}`, 400, yPos, { align: 'right' });
      yPos += 20;
    });
  
    // Divider
    doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
  
    // Totals
    const tax = 0; // Example: 0% tax
    const delivery = 20;
    const subtotal = order.total;
    const total = subtotal + tax + delivery;
  
    yPos += 20;
    doc.font('Helvetica-Bold');
    doc.text('Subtotal', 350, yPos, { align: 'left' });
    doc.text(`$${subtotal.toFixed(2)}`, 470, yPos, { align: 'right' });
  
    yPos += 20;
    doc.text('Tax (0%)', 350, yPos, { align: 'left' });
    doc.text(`$${tax.toFixed(2)}`, 470, yPos, { align: 'right' });
  
    yPos += 20;
    doc.text('Delivery', 350, yPos, { align: 'left' });
    doc.text(`$${delivery.toFixed(2)}`, 470, yPos, { align: 'right' });
  
    yPos += 25;
    doc.fontSize(14).text('Total Amount Due', 350, yPos, { align: 'left' });
    doc.text(`$${total.toFixed(2)}`, 470, yPos, { align: 'right' });
  
    // Footer
    doc.moveDown(3);
    doc.fontSize(10).font('Helvetica-Oblique').text(
      'Thank you for your business! Payment is due within 30 days.\nIf you have any questions, contact us at support@Tech-Shop.com.',
      50, // x-coordinate
      yPos + 40, // optional: move it lower after totals
      {
        align: 'center',
        width: 500
      }
    );
    
  
    doc.end(); // Finalize the document
  },

  
};

module.exports = globalController;
