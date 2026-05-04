import express from 'express'
import { protect } from '../middleware/whoisthis.js'
import {
  createProblemSession,
  endProblemSession,
  getUserProblemSessions,
  getProblemSessionById
} from '../Controllers/problemController.js'

const router = express.Router();

router.post('/', protect, createProblemSession);
router.get('/', protect, getUserProblemSessions);
router.get('/:session_id', protect, getProblemSessionById);
router.put('/:session_id/end', protect, endProblemSession);

export default router;
