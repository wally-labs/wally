/*
  Warnings:

  - The `country` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `race` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `language` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `relationship` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gender` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'OTHERS', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('FAMILY', 'FRIENDSHIP', 'ROMANTIC_PARTNER', 'MARRIED', 'COLLEAGUE', 'MANAGER');

-- CreateEnum
CREATE TYPE "Race" AS ENUM ('CHINESE', 'MALAY', 'INDIAN', 'EURASIAN', 'OTHERS');

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('SINGAPORE', 'MALAYSIA', 'CHINA', 'OTHERS');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'CHINESE', 'MALAY', 'TAMIL', 'JAPANESE', 'KOREAN', 'FRENCH', 'GERMAN', 'SPANISH', 'PORTUGUESE', 'RUSSIAN');

-- Gender normalization
UPDATE "Chat"
SET "gender" = CASE
  WHEN lower("gender") = 'male'             THEN 'MALE'
  WHEN lower("gender") = 'female'           THEN 'FEMALE'
  WHEN lower("gender") = 'non-binary'       THEN 'NON_BINARY'
  WHEN lower("gender") = 'others'           THEN 'OTHERS'
  WHEN lower("gender") = 'prefer-not-to-say' THEN 'PREFER_NOT_TO_SAY'
  ELSE UPPER(REGEXP_REPLACE("gender", '[^A-Z_0-9]', '_', 'gi'))
END
WHERE "gender" IS NOT NULL;

-- Relationship normalization
UPDATE "Chat"
SET "relationship" = CASE
  WHEN lower("relationship") = 'family'             THEN 'FAMILY'
  WHEN lower("relationship") = 'friendship'         THEN 'FRIENDSHIP'
  WHEN lower("relationship") = 'partner'            THEN 'ROMANTIC_PARTNER'
  WHEN lower("relationship") = 'married'            THEN 'MARRIED'
  WHEN lower("relationship") = 'colleague'          THEN 'COLLEAGUE'
  WHEN lower("relationship") = 'manager'            THEN 'MANAGER'
  ELSE UPPER(REGEXP_REPLACE("relationship", '[^A-Z_0-9]', '_', 'gi'))
END
WHERE "relationship" IS NOT NULL;

-- Race normalization
UPDATE "Chat"
SET "race" = CASE
  WHEN lower("race") = 'chinese'   THEN 'CHINESE'
  WHEN lower("race") = 'malay'     THEN 'MALAY'
  WHEN lower("race") = 'indian'    THEN 'INDIAN'
  WHEN lower("race") = 'eurasian'  THEN 'EURASIAN'
  WHEN lower("race") = 'other'     THEN 'OTHERS'
  ELSE UPPER(REGEXP_REPLACE("race", '[^A-Z_0-9]', '_', 'gi'))
END
WHERE "race" IS NOT NULL;

-- Country normalization
UPDATE "Chat"
SET "country" = CASE
  WHEN lower("country") = 'singapore' THEN 'SINGAPORE'
  WHEN lower("country") = 'malaysia'  THEN 'MALAYSIA'
  WHEN lower("country") = 'china'     THEN 'CHINA'
  WHEN lower("country") = 'other'     THEN 'OTHERS'
  ELSE UPPER(REGEXP_REPLACE("country", '[^A-Z_0-9]', '_', 'gi'))
END
WHERE "country" IS NOT NULL;

-- Language normalization (update this!!!)
UPDATE "Chat"
SET "language" = CASE
  WHEN lower("language") = 'en' THEN 'ENGLISH'
  WHEN lower("language") = 'fr' THEN 'FRENCH'
  WHEN lower("language") = 'de' THEN 'GERMAN'
  WHEN lower("language") = 'es' THEN 'SPANISH'
  WHEN lower("language") = 'pt' THEN 'PORTUGUESE'
  WHEN lower("language") = 'ru' THEN 'RUSSIAN'
  WHEN lower("language") = 'ja' THEN 'JAPANESE'
  WHEN lower("language") = 'ko' THEN 'KOREAN'
  WHEN lower("language") = 'zh' THEN 'CHINESE'
  WHEN lower("language") = 'ms' THEN 'MALAY'
  ELSE UPPER(REGEXP_REPLACE("language", '[^A-Z_0-9]', '_', 'gi'))
END
WHERE "language" IS NOT NULL;

-- AlterTable
-- Country -> Country ENUM
ALTER TABLE "Chat"
  ALTER COLUMN "country"
    TYPE "Country"
    USING ("country"::"Country");

-- Language -> Language ENUM
ALTER TABLE "Chat"
  ALTER COLUMN "language"
    TYPE "Language"
    USING ("language"::"Language");

-- Race -> Race ENUM
ALTER TABLE "Chat"
  ALTER COLUMN "race"
    TYPE "Race"
    USING ("race"::"Race");

-- Relationship -> Relationship ENUM
ALTER TABLE "Chat"
  ALTER COLUMN "relationship"
    TYPE "Relationship"
    USING ("relationship"::"Relationship");

-- Gender -> Gender ENUM
ALTER TABLE "Chat"
  ALTER COLUMN "gender"
    TYPE "Gender"
    USING ("gender"::"Gender");
