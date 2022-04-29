const Joi = require('@hapi/joi');
const oracledb = require('oracledb');
const dbConfig = require('../config/database.config.js');

const planValidation = Joi.object({
    code_rlp: Joi.string().required().min(4).max(4).pattern(new RegExp('^R[0-9]{3}$')),
    ordre_jour: Joi.number().required().min(0).max(12),
    ordre_lecture_paquet: Joi.number().required(), 
    tournée_debut: Joi.string().required().min(9).max(9).pattern(new RegExp('^[0-9]{9}$')), 
    tournée_fin: Joi.string().required().min(9).max(9).pattern(new RegExp('^[0-9]{9}$')),
});

const interlacedIntervals = async(tournée_debut,tournée_fin) => {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT count(*) FROM plans WHERE (tournée_debut <= :tournée_debut AND tournée_fin >= :tournée_debut) OR (tournée_debut <= :tournée_fin AND tournée_fin >= :tournée_fin) OR (tournée_debut >= :tournée_debut AND tournée_fin <= :tournée_fin)",{ tournée_debut: tournée_debut, tournée_fin: tournée_fin });
    if(result.rows[0][0]>0) return true
    return false;
}

const interlacedIntervalsForUpdate = async(tournée_debut,tournée_fin,id) => {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT count(*) FROM plans WHERE ((tournée_debut <= :tournée_debut AND tournée_fin >= :tournée_debut) OR (tournée_debut <= :tournée_fin AND tournée_fin >= :tournée_fin) OR (tournée_debut >= :tournée_debut AND tournée_fin <= :tournée_fin)) AND id != :id",{ tournée_debut: tournée_debut, tournée_fin: tournée_fin, id: id });
    if(result.rows[0][0]>0) return true
    return false;
}

module.exports = {planValidation,interlacedIntervals,interlacedIntervalsForUpdate};