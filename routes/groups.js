const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupcontroller');

router.get('/', groupController.findAll);

router.get('/:id', groupController.findOne);

router.post('/', groupController.create);

router.put('/:id', groupController.update);

router.delete('/:id', groupController.delete);

module.exports = router;