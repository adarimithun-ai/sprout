const router   = require('express').Router();
const supabase = require('../lib/supabase');

// GET all growth records
router.get('/', async (_req, res) => {
    const { data, error } = await supabase
        .from('growth')
        .select('*')
        .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST add growth record
router.post('/', async (req, res) => {
    const { w, h, hc, label, date, notes } = req.body;
    const { data, error } = await supabase
        .from('growth')
        .insert({ w, h, hc: hc ?? null, label, date: date || '', notes: notes || '' })
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE growth record
router.delete('/:id', async (req, res) => {
    const { error } = await supabase
        .from('growth')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

module.exports = router;
