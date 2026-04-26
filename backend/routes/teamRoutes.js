const express        = require('express');
const teamController = require('../controllers/teamController');
const authController = require('../controllers/authController');

const router = express.Router();

// All team routes require login
router.use(authController.protect);

router.route('/')
  .get(teamController.getAllTeams)
  .post(teamController.createTeam);

router.route('/:id')
  .get(teamController.getTeam)
  .patch(teamController.updateTeam)
  .delete(teamController.deleteTeam);

router.route('/:id/members')
  .post(teamController.addMember);

router.route('/:id/members/:userId')
  .delete(teamController.removeMember);

router.get('/user/:userId', teamController.getUserTeam);

module.exports = router;
