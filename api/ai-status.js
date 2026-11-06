const MODEL = 'fal-ai/glm-image/image-to-image';
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.fal_key || process.env.FAL_KEY;
  if (!key) return res.status(500).json({ error: 'مفتاح fal.ai مش متضاف في Vercel.' });
  const requestId = String(req.query.requestId || '');
  if (!/^[a-f0-9-]{20,50}$/i.test(requestId)) return res.status(400).json({ error: 'رقم الطلب غير صالح.' });
  const headers = { Authorization: `Key ${key}` };
  try {
    const statusResponse = await fetch(`https://queue.fal.run/${MODEL}/requests/${requestId}/status`, { headers });
    const statusData = await statusResponse.json().catch(() => ({}));
    if (!statusResponse.ok) return res.status(502).json({ error: 'مش قادرين نجيب حالة التعديل دلوقتي.' });
    if (statusData.status !== 'COMPLETED') {
      if (statusData.status === 'FAILED') return res.status(502).json({ error: 'التعديل فشل عند خدمة الذكاء الاصطناعي. جرّب وصف أو صورة تانية.' });
      return res.status(200).json({ status: statusData.status || 'IN_QUEUE' });
    }
    const resultResponse = await fetch(`https://queue.fal.run/${MODEL}/requests/${requestId}`, { headers });
    const result = await resultResponse.json().catch(() => ({}));
    if (!resultResponse.ok || !result.images || !result.images[0] || !result.images[0].url) {
      return res.status(502).json({ error: 'التعديل خلص لكن تعذر استلام الصورة الناتجة.' });
    }
    return res.status(200).json({ status: 'COMPLETED', imageUrl: result.images[0].url });
  } catch (error) {
    console.error('AI status error:', error);
    return res.status(500).json({ error: 'حصل خطأ أثناء متابعة التعديل.' });
  }
};
