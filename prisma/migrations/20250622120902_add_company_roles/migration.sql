/*
  Warnings:

  - You are about to drop the column `companyRoleId` on the `CompanyUsers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyUsers" DROP CONSTRAINT "CompanyUsers_companyRoleId_fkey";

-- AlterTable
ALTER TABLE "CompanyUsers" DROP COLUMN "companyRoleId";

-- CreateTable
CREATE TABLE "UserCompanyRoles" (
    "id" SERIAL NOT NULL,
    "userCompanyId" INTEGER NOT NULL,
    "companyRoleId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCompanyRoles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCompanyRoles_userCompanyId_companyRoleId_key" ON "UserCompanyRoles"("userCompanyId", "companyRoleId");

-- AddForeignKey
ALTER TABLE "UserCompanyRoles" ADD CONSTRAINT "UserCompanyRoles_userCompanyId_fkey" FOREIGN KEY ("userCompanyId") REFERENCES "CompanyUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompanyRoles" ADD CONSTRAINT "UserCompanyRoles_companyRoleId_fkey" FOREIGN KEY ("companyRoleId") REFERENCES "CompanyRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
