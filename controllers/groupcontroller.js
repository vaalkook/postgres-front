const db = require('../models');
const Group = db.Group;
const Idol = db.Idol;


exports.findAll = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error al recuperar los grupos' });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const group = await Group.findByPk(id, {
            include: [{ model: Idol, as: 'members' }]
        });

        if (!group) {
            return res.status(404).json({ message: `Grupo con id ${id} no encontrado` });
        }

        res.status(200).json(group);
    } catch (err) {
        res.status(500).json({ message: err.message || `Error al recuperar el grupo con id ${id}` });
    }
};

exports.create = async (req, res) => {
    // Validar request
    if (!req.body.name) {
        return res.status(400).json({ message: 'El nombre del grupo es obligatorio' });
    }

    try {
        const group = await Group.create(req.body);
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error al crear el grupo' });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Group.update(req.body, {
            where: { id: id }
        });

        if (result[0] === 0) {
            return res.status(404).json({ message: `Grupo con id ${id} no encontrado` });
        }

        res.status(200).json({ message: 'Grupo actualizado con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message || `Error al actualizar el grupo con id ${id}` });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Group.destroy({
            where: { id: id }
        });

        if (result === 0) {
            return res.status(404).json({ message: `Grupo con id ${id} no encontrado` });
        }

        res.status(200).json({ message: 'Grupo eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message || `Error al eliminar el grupo con id ${id}` });
    }
};
