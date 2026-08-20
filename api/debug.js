export default function handler(req, res) {
  try {
    const { app } = require('../server.js');
    res.status(200).json({ status: "Success importing server.js!" });
  } catch(e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
}
