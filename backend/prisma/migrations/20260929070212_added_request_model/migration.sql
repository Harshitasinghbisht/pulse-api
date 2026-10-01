-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('NONE', 'BEARER', 'BASIC', 'API_KEY');

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "method" "HttpMethod" NOT NULL,
    "url" TEXT NOT NULL,
    "body" JSONB,
    "collectionId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestHeader" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestQueryParam" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestQueryParam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestAuth" (
    "id" TEXT NOT NULL,
    "type" "AuthType" NOT NULL,
    "token" TEXT,
    "username" TEXT,
    "password" TEXT,
    "key" TEXT,
    "value" TEXT,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Request_collectionId_idx" ON "Request"("collectionId");

-- CreateIndex
CREATE INDEX "Request_createdById_idx" ON "Request"("createdById");

-- CreateIndex
CREATE INDEX "RequestHeader_requestId_idx" ON "RequestHeader"("requestId");

-- CreateIndex
CREATE INDEX "RequestQueryParam_requestId_idx" ON "RequestQueryParam"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "RequestAuth_requestId_key" ON "RequestAuth"("requestId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestHeader" ADD CONSTRAINT "RequestHeader_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestQueryParam" ADD CONSTRAINT "RequestQueryParam_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAuth" ADD CONSTRAINT "RequestAuth_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
