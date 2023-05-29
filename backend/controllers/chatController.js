const Message = require('../models/message');
const Sphere = require('../models/sphere');
const validationMiddleware = require('../middleware/validation');
const { v4: uuidv4 } = require('uuid');

exports.handleNewMessage = [
  validationMiddleware.validateNewMessage,
  async (req, res, next) => {
    const { content, username, sphereId } = req.body;

    try {
      // Create a new message entry in the database
      const newMessage = new Message({
        uniqueID: uuidv4(),
        username: username,
        content: content,
        sphereId: sphereId,
      });
      await newMessage.save();

      // Find the sphere for the user and update it with the new message
      const sphere = await Sphere.findOne({ uniqueID: sphereId });
      sphere.newMessages.push(newMessage);
      await sphere.save();

      res.status(200).send('Message processed');
    } catch (error) {
      next(error);
    }
  },
];
