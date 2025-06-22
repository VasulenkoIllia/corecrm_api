-- Створюємо таблицю Module
CREATE TABLE "Module" (
                          "id" SERIAL NOT NULL,
                          "name" TEXT NOT NULL,
                          "description" TEXT,
                          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          "updatedAt" TIMESTAMP(3) NOT NULL,
                          CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- Додаємо унікальний індекс для name
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- Створюємо таблицю CompanyModules
CREATE TABLE "CompanyModules" (
                                  "id" SERIAL NOT NULL,
                                  "companyId" INTEGER NOT NULL,
                                  "moduleId" INTEGER NOT NULL,
                                  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  "updatedAt" TIMESTAMP(3) NOT NULL,
                                  CONSTRAINT "CompanyModules_pkey" PRIMARY KEY ("id")
);

-- Додаємо унікальний індекс для companyId, moduleId
CREATE UNIQUE INDEX "CompanyModules_companyId_moduleId_key" ON "CompanyModules"("companyId", "moduleId");

-- Додаємо зовнішні ключі для CompanyModules
ALTER TABLE "CompanyModules" ADD CONSTRAINT "CompanyModules_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CompanyModules" ADD CONSTRAINT "CompanyModules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Крок 1: Заповнюємо таблицю Module з унікальних значень module із CompanyRolePermissions
INSERT INTO "Module" ("name", "createdAt", "updatedAt")
SELECT DISTINCT "module", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "CompanyRolePermissions"
    ON CONFLICT ("name") DO NOTHING;

-- Крок 2: Додаємо тимчасовий стовпець moduleId до CompanyRolePermissions
ALTER TABLE "CompanyRolePermissions" ADD COLUMN "moduleId" INTEGER;

-- Крок 3: Заповнюємо moduleId у CompanyRolePermissions, зіставляючи module із Module
UPDATE "CompanyRolePermissions" crp
SET "moduleId" = m.id
    FROM "Module" m
WHERE m.name = crp.module;

-- Крок 4: Робимо moduleId обов’язковим
ALTER TABLE "CompanyRolePermissions" ALTER COLUMN "moduleId" SET NOT NULL;

-- Крок 5: Додаємо зовнішній ключ для moduleId
ALTER TABLE "CompanyRolePermissions" ADD CONSTRAINT "CompanyRolePermissions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Крок 6: Видаляємо старе поле module
ALTER TABLE "CompanyRolePermissions" DROP COLUMN "module";

-- Оновлюємо унікальний індекс для CompanyRolePermissions
-- Видаляємо лише якщо індекс існує
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'CompanyRolePermissions'
        AND indexname = 'CompanyRolePermissions_roleId_module_key'
    ) THEN
DROP INDEX "CompanyRolePermissions_roleId_module_key";
END IF;
END $$;

CREATE UNIQUE INDEX "CompanyRolePermissions_roleId_moduleId_key" ON "CompanyRolePermissions"("roleId", "moduleId");

-- Переносимо дані з Company.modules у CompanyModules
INSERT INTO "CompanyModules" ("companyId", "moduleId", "createdAt", "updatedAt")
SELECT
    c.id AS companyId,
    m.id AS moduleId,
    CURRENT_TIMESTAMP AS createdAt,
    CURRENT_TIMESTAMP AS updatedAt
FROM "Company" c
         CROSS JOIN "Module" m
WHERE (c.modules -> m.name)::boolean = true
ON CONFLICT ("companyId", "moduleId") DO NOTHING;

-- Видаляємо поле modules із Company
ALTER TABLE "Company" DROP COLUMN "modules";
