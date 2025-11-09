/*
  Migration: Convert manager from comma-separated String to String[] array
  
  Steps:
  1. Add a temporary column for the array
  2. Migrate data by parsing comma-separated strings into arrays
  3. Drop the old column
  4. Rename the temporary column to manager
*/

-- Step 1: Add temporary column for array type
ALTER TABLE "User" ADD COLUMN "manager_temp" TEXT[];

-- Step 2: Migrate data from comma-separated string to array
UPDATE "User" 
SET "manager_temp" = string_to_array("manager", ',')
WHERE "manager" IS NOT NULL AND "manager" != '';

-- Step 3: Trim whitespace from array elements
UPDATE "User"
SET "manager_temp" = array(
  SELECT trim(unnest("manager_temp"))
)
WHERE "manager_temp" IS NOT NULL;

-- Step 4: Drop old column
ALTER TABLE "User" DROP COLUMN "manager";

-- Step 5: Rename temp column to manager
ALTER TABLE "User" RENAME COLUMN "manager_temp" TO "manager";
