const Global = require('../models/globalModel');

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
};

module.exports = globalController;
