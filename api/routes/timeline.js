const router   = require('express').Router();
const multer   = require('multer');
const supabase = require('../lib/supabase');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// GET all timeline entries
router.get('/', async (_req, res) => {
    const { data, error } = await supabase
        .from('timeline')
        .select('*')
        .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST add timeline entry (with optional image)
router.post('/', upload.single('file'), async (req, res) => {
    const { icon, title, desc, date_str } = req.body;
    let img_url = null;

    if (req.file) {
        const ext      = req.file.originalname.split('.').pop();
        const fileName = `timeline/${require('crypto').randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
            .from('sprout-media')
            .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
        if (uploadErr) return res.status(500).json({ error: uploadErr.message });

        const { data: urlData } = supabase.storage
            .from('sprout-media')
            .getPublicUrl(fileName);
        img_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
        .from('timeline')
        .insert({ icon, title, description: desc || '', date: date_str || '', img_url })
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// PUT update timeline entry (title, desc, date — no image change)
router.put('/:id', async (req, res) => {
    const { title, desc, date_str } = req.body;
    const { data, error } = await supabase
        .from('timeline')
        .update({ title, description: desc || '', date: date_str || '' })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE timeline entry
router.delete('/:id', async (req, res) => {
    const { error } = await supabase
        .from('timeline')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

module.exports = router;
