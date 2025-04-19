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
printPDF: async (req, res) => {
  const { orderId } = req.query;
  const order = await Order.findOne({ id1: orderId });

  // Create the PDF document
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'portrait',
  });

  // Pipe the PDF document directly to the response as a PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="order-${order.id}.pdf"`);

  doc.pipe(res); // Send PDF directly to the client as the response

  // Title section (modern styling)
  doc.fontSize(24).font('Helvetica-Bold').text('Tech-Shop', { align: 'center', underline: true });

  doc.fontSize(20).font('Helvetica-Bold').text('Order Summary', { align: 'center', underline: true });
  doc.moveDown(1); // Add space after the title

  // Order information section with modern styling
  doc.fontSize(14).font('Helvetica').text(`Order ID: ${order.id1}`, { align: 'left' });
  doc.text(`Customer: ${order.username}`, { align: 'left' });
  doc.text(`phone: ${order.phone}`, { align: 'left' });
  doc.text(`Order Date: ${new Date(order.date).toLocaleDateString()}`, { align: 'left' });
  doc.text(`Printed: ${new Date().toLocaleString()}`, { align: 'left' });
  doc.moveDown(2); // Add space after order info

  // Items list section with better layout
  doc.fontSize(16).font('Helvetica-Bold').text('Items:', { underline: true });
  doc.moveDown(0.5); // Add space after title

  // Table-like layout for the items
  order.items.forEach((item, index) => {
    doc.fontSize(12).font('Helvetica').text(
      `${index + 1}. ${item.itemname}`,
      { continued: true }
    );
    doc.text(` - Qty: ${item.quantity} - $${item.price.toFixed(2)}`, { align: 'right' });
  });
  doc.text(` - Total: ${order.total} `, { align: 'right' });

  // Footer section for notes or contact information (optional)
  doc.moveDown(2); // Add space before footer
  doc.fontSize(10).font('Helvetica-Oblique').text(
    'Thank you for your order! For inquiries, contact support@Tech-Shop.com',
    { align: 'center' }
  );

  // End the document and pipe it
  doc.end();
},


  
};

module.exports = globalController;
