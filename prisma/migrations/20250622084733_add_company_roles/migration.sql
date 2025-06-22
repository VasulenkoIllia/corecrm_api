-- AlterTable
ALTER TABLE "CompanyUsers" ADD COLUMN     "companyRoleId" INTEGER;

-- CreateTable
CREATE TABLE "CompanyRole" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyRolePermissions" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "module" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyRolePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRole_companyId_name_key" ON "CompanyRole"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRolePermissions_roleId_module_key" ON "CompanyRolePermissions"("roleId", "module");

-- AddForeignKey
ALTER TABLE "CompanyUsers" ADD CONSTRAINT "CompanyUsers_companyRoleId_fkey" FOREIGN KEY ("companyRoleId") REFERENCES "CompanyRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyRole" ADD CONSTRAINT "CompanyRole_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyRolePermissions" ADD CONSTRAINT "CompanyRolePermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "CompanyRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
