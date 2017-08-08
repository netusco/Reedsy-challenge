import path from 'path';
import express from 'express';
import { convert, getAll } from '../controllers/conversion.controller.js'

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.resolve('client/index.html'));
});

router.get('/api/conversions', getAll);
router.post('/api/conversion', convert);

export default router;
