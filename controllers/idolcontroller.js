const db = require('../models');
const Idol = db.Idol;
const Group = db.Group;


exports.findAll = async (req, res) => {
    try {
        const idols = await Idol.findAll({
            include: [{ model: Group, as: 'group', attributes: ['id', 'name'] }]
        });
        res.status(200).json(idols);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error al recuperar los idols' });
    }
};

exports.findByGroup = async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const idols = await Idol.findAll({
            where: { groupId: groupId },
            include: [{ model: Group, as: 'group', attributes: ['id', 'name'] }]
        });
        res.status(200).json(idols);
    } catch (err) {
        res.status(500).json({ message: err.message || `Error al recuperar los idols del grupo ${groupId}` });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const idol = await Idol.findByPk(id, {
            include: [{ model: Group, as: 'group', attributes: ['id', 'name'] }]
        });

        if (!idol) {
            return res.status(404).json({ message: `Idol con id ${id} no encontrado` });
        }

        res.status(200).json(idol);
    } catch (err) {
        res.status(500).json({ message: err.message || `Error al recuperar el idol con id ${id}` });
    }
};

exports.create = async (req, res) => {
    if (!req.body.stageName || !req.body.groupId) {
        return res.status(400).json({ message: 'El nombre artístico y el ID del grupo son obligatorios' });
    }

    try {
        // Verificar si el grupo existe
        const group = await Group.findByPk(req.body.groupId);
        if (!group) {
            return res.status(404).json({ message: `Grupo con id ${req.body.groupId} no encontrado` });
        }

        const idol = await Idol.create(req.body);
        res.status(201).json(idol);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error al crear el idol' });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Idol.update(req.body, {
            where: { id: id }
        });

        if (result[0] === 0) {
            return res.status(404).json({ message: `Idol con id ${id} no encontrado` });
        }

        res.status(200).json({ message: 'Idol actualizado con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message || `Error al actualizar el idol con id ${id}` });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Idol.destroy({
            where: { id: id }
        });

        if (result === 0) {
            return res.status(404).json({ message: `Idol con id ${id} no encontrado` });
        }

        res.status(200).json({ message: 'Idol eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message || `Error al eliminar el idol con id ${id}` });
    }
};

