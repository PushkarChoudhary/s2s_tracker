const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    // 1. Affiliates
    const affiliate1 = await prisma.affiliate.create({
        data: { name: "Affiliate One" },
    });
    const affiliate2 = await prisma.affiliate.create({
        data: { name: "Affiliate Two" },
    });

    // 2. Campaigns
    const campaign1 = await prisma.campaign.create({
        data: { name: "Campaign Alpha" },
    });
    const campaign2 = await prisma.campaign.create({
        data: { name: "Campaign Beta" },
    });

    // 3. Clicks
    const click1 = await prisma.click.create({
        data: {
            affiliateId: affiliate1.id,
            campaignId: campaign1.id,
            clickId: "CLICK-123-A",
        },
    });

    const click2 = await prisma.click.create({
        data: {
            affiliateId: affiliate2.id,
            campaignId: campaign2.id,
            clickId: "CLICK-456-B",
        },
    });

    // 4. Conversions
    await prisma.conversion.create({
        data: {
            clickRefId: click1.id,
            amount: 99.5,
            currency: "USD",
        },
    });

    await prisma.conversion.create({
        data: {
            clickRefId: click2.id,
            amount: 150,
            currency: "EUR",
        },
    });

    console.log("Seed data inserted successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
