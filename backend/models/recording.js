const Sequelize = require('sequelize');

module.exports = class Recording extends Sequelize.Model{
    static init(sequelize){
        return super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                recording_title: {
                    type: Sequelize.STRING(50)
                },
                recording_url: {
                    type: Sequelize.STRING(100)
                },
                recording_check: {
                    type: Sequelize.ENUM('0', '1'),
                    defaultValue: '0'
                },
                registered: {
                    type: Sequelize.ENUM('0', '1'),
                    defaultValue: '0'
                }
            }, {
                sequelize,
                underscored: false,
                charset: "utf8", 
                collate: "utf8_bin", 
                tableName: "recording", 
                timestamps: true, 
                paranoid: false, 
            },
        );
    }

    static associate(db) {
        db.Recording.belongsTo(db.Member, { onDelete: "CASCADE" });
        db.Recording.hasOne(db.Feedback, { onDelete: "CASCADE" });
    }
};