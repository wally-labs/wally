import { type z } from "zod";
import { cn } from "~/lib/utils";
import { type useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";

import { type formSchema } from "../schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  countryOptions,
  genderOptions,
  languageOptions,
  raceOptions,
  relationshipOptions,
} from "../constants/enums";

export const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
  { label: "Malay", value: "ms" },
] as const;

export type ProfileFormProps = {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  handleSubmit: (values: z.infer<typeof formSchema>) => void;
  submitLabel: string;
  isPending?: boolean; // for testing pending state
};

export function ProfileForm({
  form,
  handleSubmit,
  submitLabel,
  isPending,
}: ProfileFormProps) {
  return (
    <Card data-cy="profile-form-card">
      <CardHeader>
        <CardTitle
          className="text-xl text-amberTheme-darker"
          data-cy="profile-form-title"
        >
          Tell Me About Them
        </CardTitle>
        <CardDescription>
          Share a few details about who you’re chatting with: like their name,
          role, and more. The more I know, the more personalized my replies will
          be!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            data-cy="profile-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input data-cy="name-input" placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>Your partner&apos;s name</FormDescription>
                  <FormMessage data-cy="name-form-message" />
                </FormItem>
              )}
            />

            {/* Gender field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-cy="gender-select-trigger">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent data-cy="gender-select-content">
                      {genderOptions.map((opt) => (
                        <SelectItem
                          data-cy={`gender-select-item-${opt.value}`}
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Your partner&apos;s gender</FormDescription>
                  <FormMessage data-cy="gender-form-message" />
                </FormItem>
              )}
            />

            {/* Birth Date field */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input
                      data-cy="birthdate-input"
                      type="date"
                      placeholder="your partner's birth date"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your partner&apos;s birth date
                  </FormDescription>
                  <FormMessage data-cy="birthdate-form-message" />
                </FormItem>
              )}
            />

            {/* Relationship Field */}
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-cy="relationship-select-trigger">
                        <SelectValue placeholder="Select a relationship type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent data-cy="relationship-select-content">
                      {relationshipOptions.map((opt) => (
                        <SelectItem
                          data-cy={`relationship-select-item-${opt.value}`}
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your partner&apos;s relationship with you
                  </FormDescription>
                  <FormMessage data-cy="relationship-form-message" />
                </FormItem>
              )}
            />

            {/* Heart Level Field  */}
            <FormField
              control={form.control}
              name="heartLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heart Level</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    // defaultValue={field.value?.toString()} // Ensure defaultValue is string for Select
                  >
                    <FormControl>
                      <SelectTrigger data-cy="heartlevel-select-trigger">
                        <SelectValue placeholder="Select a heart level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent data-cy="heartlevel-select-content">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <SelectItem
                          data-cy={`heartlevel-select-item-${i}`}
                          key={i}
                          value={i.toString()}
                        >
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your partner&apos;s heart level
                  </FormDescription>
                  <FormMessage data-cy="heartlevel-form-message" />
                </FormItem>
              )}
            />

            {/* Race Field */}
            <FormField
              control={form.control}
              name="race"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-cy="race-select-trigger">
                        <SelectValue placeholder="Select a race" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent data-cy="race-select-content">
                      {raceOptions.map((opt) => (
                        <SelectItem
                          data-cy={`race-select-item-${opt.value}`}
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Your partner&apos;s race</FormDescription>
                  <FormMessage data-cy="race-form-message" />
                </FormItem>
              )}
            />

            {/* Country Field */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-cy="country-select-trigger">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent data-cy="country-select-content">
                      {countryOptions.map((opt) => (
                        <SelectItem
                          data-cy={`country-select-item-${opt.value}`}
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Your partner&apos;s country</FormDescription>
                  <FormMessage data-cy="country-form-message" />
                </FormItem>
              )}
            />

            {/* Language Field */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                  <FormLabel>Language</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          data-cy="language-combobox-trigger"
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between rounded-md border px-3 py-2 text-left font-normal"
                        >
                          {field.value
                            ? languageOptions.find(
                                (language) => language.value === field.value,
                              )?.label
                            : "Select language"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      data-cy="language-popover-content"
                      className="w-[200px] p-0"
                    >
                      <Command>
                        <CommandInput
                          data-cy="language-search-input"
                          placeholder="Search language..."
                          className="h-9"
                        />
                        <CommandList data-cy="language-command-list">
                          <CommandEmpty>Language not available.</CommandEmpty>
                          <CommandGroup>
                            {languageOptions.map((opt) => (
                              <CommandItem
                                data-cy={`language-command-item-${opt.value}`}
                                value={opt.value}
                                key={opt.value}
                                onSelect={() => {
                                  form.setValue("language", opt.value);
                                }}
                              >
                                {opt.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    opt.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your partner&apos;s native language
                  </FormDescription>
                  <FormMessage data-cy="language-form-message" />
                </FormItem>
              )}
            />
            <div className="flex justify-end sm:col-start-2">
              <Button
                data-cy="profile-form-submit-button"
                type="submit"
                variant="main"
                className="w-1/2"
                disabled={isPending ?? form.formState.isSubmitting}
              >
                {isPending ? "Saving..." : submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
