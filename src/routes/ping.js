const express = require('express');
const router = express.Router();
const { writeInfo } = require('../modules/logs');

/**
 * @swagger
 * tags:
 *   name: Default
 *   description: Default API endpoints
 */

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Check if ARGOS client is active on the system
 *     tags: [Default]
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Pong!
 *       404:
 *         description: error 
*/
router.get('/ping', (req, res) => {
  writeInfo('executedPing', {host: req.headers.host});
  res.status(200).json({ status: 'pong!' });
});

module.exports = router;
