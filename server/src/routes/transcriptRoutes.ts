import { Router } from 'express';
import { extractTranscript } from '@controllers/transcriptController';

const router = Router();

// Route to extract YouTube video transcript
router.post('/:videoId', extractTranscript as any);

export default router;