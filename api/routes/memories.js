const router   = require('express').Router();
const multer   = require('multer');
const supabase = require('../lib/supabase');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// GET all memories
router.get('/', async (_req, res) => {
    const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST add memory (with optional image)
router.post('/', upload.single('file'), async (req, res) => {
    const { caption, date_str } = req.body;
    let file_url = null;

    if (req.file) {
        const ext      = req.file.originalname.split('.').pop();
        const fileName = `memories/${require('crypto').randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
            .from('sprout-media')
            .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
        if (uploadErr) return res.status(500).json({ error: uploadErr.message });

        const { data: urlData } = supabase.storage
            .from('sprout-media')
            .getPublicUrl(fileName);
        file_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
        .from('memories')
        .insert({ caption: caption || '', date: date_str || '', file_url })
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE memory
router.delete('/:id', async (req, res) => {
    const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

module.exports = router;
