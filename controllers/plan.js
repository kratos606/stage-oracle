const oracledb = require('oracledb');
const dbConfig = require('../config/database.config.js');
const { createHistory } = require('./history')
const {planValidation,interlacedIntervals,interlacedIntervalsForUpdate} = require('../middlewares/plan');

// Get plan by ID

const getPlanById = async (plan_id) => {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT * FROM plans WHERE id = :plan_id", { plan_id: plan_id });
    const res = result.rows[0]
    if (connection) {
        connection.close();
        return res
    }
}

// Get all plans controller

const getAllPlans = async (req, res) => {
    try{
        let plans = new Array();
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("SELECT * FROM plans");
        result.rows.forEach((item) => {
            let plan = new Object();
            plan.id = item[0];
            plan.plan_version = item[1];
            plan.code_rlp= item[2];
            plan.ordre_jour = item[3];
            plan.ordre_lecture_paquet = item[4];
            plan.tournée_debut= item[5];
            plan.tournée_fin= item[6];
            plans.push(plan);
        });
        res.json(plans);
        if(connection){
            connection.close();
        }
    }catch(error) {
        res.json({ error: error.message });
    }
}

// create a new plan

const createPlan = async (req, res) => {
    try{
        const { code_rlp, ordre_jour, ordre_lecture_paquet, tournée_debut, tournée_fin } = req.body;
        const { error } = planValidation.validate(req.body);
        if(error) return res.json({error : error.details[0].message});
        if(await interlacedIntervals(tournée_debut,tournée_fin)) return res.json({error : "Interlaced intervals"});
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("INSERT INTO plans (code_rlp, ordre_jour, ordre_lecture_paquet, tournée_debut, tournée_fin) VALUES (:code_rlp, :ordre_jour, :ordre_lecture_paquet, :tournée_debut, :tournée_fin) RETURN id INTO :id",
        {
            code_rlp: code_rlp,
            ordre_jour: ordre_jour,
            ordre_lecture_paquet: ordre_lecture_paquet, 
            tournée_debut: tournée_debut, 
            tournée_fin: tournée_fin,
            id : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        });
        connection.commit();
        let data = JSON.stringify({
            code_rlp: code_rlp,
            ordre_jour: ordre_jour,
            ordre_lecture_paquet: ordre_lecture_paquet,
            tournée_debut: tournée_debut,
            tournée_fin: tournée_fin
        });
        createHistory("create", data,req.user.id);
        res.json({success:"Plan successfully created!"});
        if(connection){
            connection.close();
        }
    }catch(error) {
        res.json({ error: error.message });
    }
}

// update a plan

const updatePlan = async (req, res) => {
    try{
        const { code_rlp, ordre_jour, ordre_lecture_paquet, tournée_debut, tournée_fin } = req.body;
        const { error } = planValidation.validate(req.body);
        if(error) return res.json({error : error.details[0].message});
        if(await interlacedIntervalsForUpdate(tournée_debut,tournée_fin,req.params.id)) return res.json({error : "Interlaced intervals"});
        let previous = await getPlanById(req.params.id);
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("UPDATE plans SET code_rlp = :code_rlp, ordre_jour = :ordre_jour, ordre_lecture_paquet = :ordre_lecture_paquet, tournée_debut = :tournée_debut, tournée_fin = :tournée_fin WHERE id = :id",
        {
            code_rlp: code_rlp,
            ordre_jour: ordre_jour,
            ordre_lecture_paquet: ordre_lecture_paquet, 
            tournée_debut: tournée_debut, 
            tournée_fin: tournée_fin,
            id : req.params.id
        });
        connection.commit();
        let prevPlan = {
            code_rlp: previous[2],
            ordre_jour: previous[3],
            ordre_lecture_paquet: previous[4],
            tournée_debut: previous[5],
            tournée_fin: previous[6]
            }
        let currentPlan = {
            code_rlp: code_rlp,
            ordre_jour: ordre_jour,
            ordre_lecture_paquet: ordre_lecture_paquet,
            tournée_debut: tournée_debut,
            tournée_fin: tournée_fin
        }
        if(JSON.stringify(prevPlan) != JSON.stringify(currentPlan)){
            createHistory("update", JSON.stringify({
                prev:{...prevPlan},
                new:{...currentPlan}
            }),req.user.id);
        }
        res.json({success:"Plan successfully updated!"});
        if(connection){
            connection.close();
        }
    }catch(error) {
        res.json({ error: error.message });
    }
}

// delete a plan

const deletePlan = async(req, res) => {
    try{
        let plan = await getPlanById(req.params.id);
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute("DELETE FROM plans WHERE id = :id",
        {
            id : req.params.id
        });
        connection.commit();
        createHistory("delete", JSON.stringify({
            code_rlp: plan[2],
            ordre_jour: plan[3],
            ordre_lecture_paquet: plan[4],
            tournée_debut: plan[5],
            tournée_fin: plan[6]
        }),req.user.id);
        res.json({success:"Plan successfully deleted!"});
        if(connection){
            connection.close();
        }
    }catch(error) {
        res.json({ error: error.message });
    }
}

module.exports = {getAllPlans, createPlan, updatePlan, deletePlan};