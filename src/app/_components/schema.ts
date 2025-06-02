import { z } from "zod";
import {
  genderOptions,
  type GenderValue,
  relationshipOptions,
  type RelationshipValue,
  raceOptions,
  type RaceValue,
  countryOptions,
  type CountryValue,
  languageOptions,
  type LanguageValue,
} from "~/app/_components/constants/enums";

const GenderEnumSchema = z.enum(
  genderOptions.map((o) => o.value) as [GenderValue, ...GenderValue[]],
);

const RelationshipEnumSchema = z.enum(
  relationshipOptions.map((o) => o.value) as [
    RelationshipValue,
    ...RelationshipValue[],
  ],
);

const RaceEnumSchema = z.enum(
  raceOptions.map((o) => o.value) as [RaceValue, ...RaceValue[]],
);

const CountryEnumSchema = z.enum(
  countryOptions.map((o) => o.value) as [CountryValue, ...CountryValue[]],
);

const LanguageEnumSchema = z.enum(
  languageOptions.map((o) => o.value) as [LanguageValue, ...LanguageValue[]],
);

export const formSchema = z.object({
  name: z.string().min(1),
  gender: GenderEnumSchema,
  // convert to date object(?)
  birthDate: z.string().date().optional(),
  // this should be a list of a few choices (enum)?
  relationship: RelationshipEnumSchema,
  heartLevel: z
    .number()
    .int()
    .refine((value) => value >= 1 && value <= 5, {
      message: "Level must be between 1 and 5",
    }),
  race: RaceEnumSchema.optional(),
  country: CountryEnumSchema.optional(),
  language: LanguageEnumSchema,
});
