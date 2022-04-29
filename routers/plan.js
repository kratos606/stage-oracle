const router = require('express').Router();
const {verifyToken} = require('../middlewares/verifyToken');
const {getAllPlans,createPlan,updatePlan,deletePlan} = require('../controllers/plan');

router.get('/',verifyToken, getAllPlans);
router.post('/',verifyToken, createPlan);
router.put('/:id',verifyToken, updatePlan);
router.delete('/:id',verifyToken, deletePlan);

module.exports = router;