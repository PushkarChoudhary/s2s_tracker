require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_, res) => res.json({ ok: true }));

// CLICK Tracking
// GET /click?affiliate_id=1&campaign_id=10&click_id=abc123
app.get('/click', async (req, res) => {
    try {
        const { affiliate_id, campaign_id, click_id } = req.query;
        if (!affiliate_id || !campaign_id || !click_id)
            return res.status(400).json({ status: 'error', message: 'Missing params' });

        const aff = await prisma.affiliate.findUnique({ where: { id: Number(affiliate_id) } });
        const camp = await prisma.campaign.findUnique({ where: { id: Number(campaign_id) } });
        if (!aff || !camp) return res.status(404).json({ status: 'error', message: 'Affiliate or Campaign not found' });

        let click = await prisma.click.findFirst({
            where: { affiliateId: +affiliate_id, campaignId: +campaign_id, clickId: String(click_id) }
        });
        if (!click) {
            click = await prisma.click.create({
                data: { affiliateId: +affiliate_id, campaignId: +campaign_id, clickId: String(click_id) }
            });
        }
        return res.json({ status: 'success', message: 'Click tracked', click });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// POSTBACK
// GET /postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD
app.get('/postback', async (req, res) => {
    try {
        const { affiliate_id, click_id, amount, currency = 'USD' } = req.query;
        if (!affiliate_id || !click_id || !amount)
            return res.status(400).json({ status: 'error', message: 'Missing params' });

        const click = await prisma.click.findFirst({
            where: { clickId: String(click_id), affiliateId: +affiliate_id }
        });
        if (!click) return res.status(404).json({ status: 'error', message: 'Invalid click_id or affiliate_id' });

        const existing = await prisma.conversion.findUnique({ where: { clickRefId: click.id } });
        if (existing) return res.json({ status: 'success', message: 'Conversion already tracked' });

        const conv = await prisma.conversion.create({
            data: {
                clickRefId: click.id,
                amount: Number(amount),
                currency: String(currency)
            }
        });
        return res.json({ status: 'success', message: 'Conversion tracked', conversion: conv });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Dashboard helpers
app.get('/affiliates', async (_, res) => {
    const list = await prisma.affiliate.findMany({ orderBy: { id: 'asc' } });
    res.json(list);
});

app.get('/affiliates/:id/clicks', async (req, res) => {
    const id = Number(req.params.id);
    const rows = await prisma.click.findMany({ where: { affiliateId: id }, orderBy: { timestamp: 'desc' } });
    res.json(rows);
});

app.get('/affiliates/:id/conversions', async (req, res) => {
    const id = Number(req.params.id);
    const rows = await prisma.conversion.findMany({
        where: { click: { affiliateId: id } },   // ✅ fixed
        orderBy: { timestamp: 'desc' },
        include: { click: true }
    });
    res.json(rows);
});

app.get('/affiliates/:id/postback-template', (req, res) => {
    const id = Number(req.params.id);
    const base = `http://localhost:${process.env.PORT || 4000}`;
    const url = `${base}/postback?affiliate_id=${id}&click_id={click_id}&amount={amount}&currency={currency}`;
    res.json({ template: url });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend running on', PORT));
