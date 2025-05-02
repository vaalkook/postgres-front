const express = require('express');
const router = express.Router();
const idolController = require('../controllers/idolcontroller');

router.get('/', idolController.findAll);

router.get('/group/:groupId', idolController.findByGroup);

router.get('/:id', idolController.findOne);

router.post('/', idolController.create);

router.put('/:id', idolController.update);

router.delete('/:id', idolController.delete);

module.exports = router;