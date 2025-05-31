import {
  Gender,
  Relationship,
  Race,
  Country,
  Language,
} from "~/server/prisma-enums";

export function enumToLabel(str: string) {
  return str
    .split("_")
    .map((chunk) => chunk[0] + chunk.slice(1).toLowerCase())
    .join(" ");
}

export const genderOptions: Array<{ value: Gender; label: string }> =
  Object.values(Gender).map((gender) => ({
    value: gender as Gender,
    label: enumToLabel(gender),
  }));

export type GenderValue = (typeof genderOptions)[number]["value"];

export const relationshipOptions: Array<{
  value: Relationship;
  label: string;
}> = Object.values(Relationship).map((rs) => ({
  value: rs as Relationship,
  label: enumToLabel(rs),
}));

export type RelationshipValue = (typeof relationshipOptions)[number]["value"];

/**
 * 3) raceOptions: Array of { value: Race; label: string }
 */
export const raceOptions: Array<{ value: Race; label: string }> = Object.values(
  Race,
).map((race) => ({
  value: race as Race,
  label: enumToLabel(race),
}));

export type RaceValue = (typeof raceOptions)[number]["value"];

export const countryOptions: Array<{ value: Country; label: string }> =
  Object.values(Country).map((cty) => ({
    value: cty as Country,
    label: enumToLabel(cty),
  }));

export type CountryValue = (typeof countryOptions)[number]["value"];

export const languageOptions: Array<{ value: Language; label: string }> =
  Object.values(Language).map((lang) => ({
    value: lang as Language,
    label: enumToLabel(lang),
  }));

export type LanguageValue = (typeof languageOptions)[number]["value"];
