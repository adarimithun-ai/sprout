const router   = require('express').Router();
const supabase = require('../lib/supabase');

// POST /api/import – bulk replace all data
router.post('/', async (req, res) => {
    const { growth = [], timeline = [], memories = [], state = [] } = req.body;

    try {
        // Clear existing data
        await supabase.from('growth').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('timeline').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('memories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('state').delete().neq('key', '__never__');

        // Re-insert (strip id so Supabase assigns new UUIDs)
        if (growth.length)   await supabase.from('growth').insert(growth.map(r => ({ w: r.w, h: r.h, hc: r.hc ?? null, label: r.label, date: r.date || '', notes: r.notes || '' })));
        if (timeline.length) await supabase.from('timeline').insert(timeline.map(r => ({ icon: r.icon, title: r.title, description: r.desc || r.description || '', date: r.date || '', img_url: r.img_url || null })));
        if (memories.length) await supabase.from('memories').insert(memories.map(r => ({ caption: r.caption || '', date: r.date || '', file_url: r.file_url || null })));
        if (state.length)    await supabase.from('state').insert(state.map(r => ({ key: r.key, val: String(r.val) })));

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
