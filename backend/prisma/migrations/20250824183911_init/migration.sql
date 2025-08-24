-- CreateTable
CREATE TABLE "public"."Affiliate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Click" (
    "id" SERIAL NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "clickId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conversion" (
    "id" SERIAL NOT NULL,
    "clickRefId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Click_affiliateId_idx" ON "public"."Click"("affiliateId");

-- CreateIndex
CREATE INDEX "Click_campaignId_idx" ON "public"."Click"("campaignId");

-- CreateIndex
CREATE INDEX "Click_clickId_idx" ON "public"."Click"("clickId");

-- CreateIndex
CREATE UNIQUE INDEX "Click_affiliateId_campaignId_clickId_key" ON "public"."Click"("affiliateId", "campaignId", "clickId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversion_clickRefId_key" ON "public"."Conversion"("clickRefId");

-- CreateIndex
CREATE INDEX "Conversion_timestamp_idx" ON "public"."Conversion"("timestamp");

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "public"."Affiliate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversion" ADD CONSTRAINT "Conversion_clickRefId_fkey" FOREIGN KEY ("clickRefId") REFERENCES "public"."Click"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
