const router   = require('express').Router();
const supabase = require('../lib/supabase');

// GET all state key-value pairs
router.get('/', async (_req, res) => {
    const { data, error } = await supabase
        .from('state')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// PUT upsert a state key
router.put('/:key', async (req, res) => {
    const { val } = req.body;
    const { error } = await supabase
        .from('state')
        .upsert({ key: req.params.key, val: String(val) });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// DELETE a state key
router.delete('/:key', async (req, res) => {
    const { error } = await supabase
        .from('state')
        .delete()
        .eq('key', req.params.key);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

module.exports = router;
