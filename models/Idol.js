module.exports = (sequelize, DataTypes) => {
    const Idol = sequelize.define('Idol', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        stageName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        realName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: true
        },
        position: {
            type: DataTypes.STRING, // Por ejemplo: "Main Vocalist", "Leader", "Visual", etc.
            allowNull: true
        },
        image: {
            type: DataTypes.STRING, // URL de la imagen
            allowNull: true
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'groups',
                key: 'id'
            }
        }
    }, {
        tableName: 'idols',
        timestamps: true
    });

    return Idol;
};
