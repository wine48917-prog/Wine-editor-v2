const MODEL = 'fal-ai/glm-image/image-to-image';
const MAX_DATA_URL_LENGTH = 3_600_000;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.fal_key || process.env.FAL_KEY;
  if (!key) return res.status(500).json({ error: 'مفتاح fal.ai مش متضاف في Vercel. راجع Environment Variables.' });

  try {
    const { prompt, imageData } = req.body || {};
    if (typeof prompt !== 'string' || prompt.trim().length < 3 || prompt.length > 1000) {
      return res.status(400).json({ error: 'اكتب وصف للتعديل من 3 إلى 1000 حرف.' });
    }
    if (typeof imageData !== 'string' || imageData.length > MAX_DATA_URL_LENGTH) {
      return res.status(413).json({ error: 'حجم الصورة كبير. جرّب صورة أصغر من 2.5 ميجابايت.' });
    }
    const validImage = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(imageData);
    if (!validImage) return res.status(400).json({ error: 'صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WEBP.' });

    const response = await fetch(`https://queue.fal.run/${MODEL}`, {
      method: 'POST',
      headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt.trim(),
        image_urls: [imageData],
        num_images: 1,
        output_format: 'jpeg',
        enable_safety_checker: true
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('fal submit error:', response.status, data);
      return res.status(response.status === 401 ? 502 : 502).json({ error: 'خدمة الذكاء الاصطناعي رفضت الطلب. راجع صلاحية المفتاح ورصيد fal.ai.' });
    }
    if (!data.request_id) return res.status(502).json({ error: 'ملقيناش رقم طلب من خدمة الذكاء الاصطناعي.' });
    return res.status(200).json({ requestId: data.request_id });
  } catch (error) {
    console.error('AI edit error:', error);
    return res.status(500).json({ error: 'حصل خطأ أثناء إرسال الصورة. حاول مرة تانية.' });
  }
};

module.exports.config = { api: { bodyParser: { sizeLimit: '4mb' } } };
