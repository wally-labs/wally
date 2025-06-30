"use client";

import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { ProfileForm } from "./profile-form";
import { formSchema, formSchemaResponse } from "../schema";

export default function CreateProfile() {
  const router = useRouter();
  const apiUtils = api.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      birthDate: undefined,
      relationship: undefined,
      heartLevel: 1,
      race: undefined,
      country: undefined,
      language: undefined,
    },
  });

  const createChatMutation = api.chat.createChat.useMutation({
    onSuccess: (data) => {
      toast.success(`Profile for ${data.name} created successfully!`);
      void apiUtils.chat.getAllChatHeaders.invalidate();
      router.push(`/chats/${data.id}`);

      const cleanedValues = Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          switch (key) {
            case "id":
              return ["chatId", value];
            case "birthDate":
              return [key, value?.toLocaleString()];
            default:
              return value !== "" ? [key, value] : [key, undefined];
          }
        }),
      ) as z.infer<typeof formSchemaResponse>;

      void upsertVectorMutation.mutate(cleanedValues);
    },
    onError: () => {
      toast.error(`Failed to create profile!`);
    },
  });

  const upsertVectorMutation = api.embeddings.embedProfileVector.useMutation({
    onSuccess: (data) => console.log("Pinecone upsert succeeded: ", data),
    onError: (err) => console.error("Pinecone upsert failed: ", err),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Removes empty values and replaces them with undefined
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) =>
        value !== "" ? [key, value] : [key, undefined],
      ),
    ) as z.infer<typeof formSchema>;

    createChatMutation.mutate({
      ...cleanedValues,
      chatHeader: values.name,
    });
  }

  return (
    <div className="mx-auto mt-16 max-w-3xl p-4">
      <ProfileForm
        form={form}
        handleSubmit={onSubmit}
        submitLabel="Create Profile"
      />
    </div>
  );
}
