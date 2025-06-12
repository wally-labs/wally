import { type z } from "zod";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";

import { Button } from "@components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEffect, type ComponentType } from "react"; // Added ComponentType
import { toast } from "sonner";
import { ProfileForm, type ProfileFormProps } from "./profile-form"; // Import real ProfileForm and its props type
import { formSchema } from "../schema";
import { useMemoChatData } from "../atoms";
import { useAtomValue } from "jotai";

interface UpdateProfileProps {
  // Allow injecting a ProfileForm component for testing
  ProfileFormComponent?: ComponentType<ProfileFormProps>;
}

export default function UpdateProfile({ ProfileFormComponent = ProfileForm }: UpdateProfileProps) {
  const apiUtils = api.useUtils();

  const { chats } = useParams();
  const chatId = Array.isArray(chats) ? chats[0] : chats;

  // get profile data from focusedChatAtom to populate form
  const focusedChatAtom = useMemoChatData(chatId!);
  const focusedChatData = useAtomValue(focusedChatAtom);

  // get profile data from server
  const { data, isLoading: isQueryLoading, isError: isQueryError } = api.chat.getChat.useQuery(
    chatId ? { chatId: chatId } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!chatId,
    },
  );

  const updateChatMutation = api.chat.updateChat.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      void apiUtils.chat.getAllChatHeaders.invalidate();
      // Potentially close dialog here if Dialog state was managed locally
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Default values will be set by useEffect once data loads
  });

  useEffect(() => {
    let initialDataToSet;
    if (focusedChatData?.chatData) {
      initialDataToSet = focusedChatData.chatData;
    } else if (data) {
      initialDataToSet = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : "", // Format for input type="date"
        // Ensure all fields from formSchema are present, defaulting if necessary
        gender: data.gender ?? undefined,
        relationship: data.relationship ?? undefined,
        heartLevel: data.heartLevel ?? 1,
        race: data.race ?? undefined,
        country: data.country ?? undefined,
        language: data.language ?? undefined,
      };
    }

    if (initialDataToSet) {
      form.reset({
        name: initialDataToSet.name,
        gender: initialDataToSet.gender,
        birthDate: initialDataToSet.birthDate,
        relationship: initialDataToSet.relationship,
        heartLevel: initialDataToSet.heartLevel,
        race: initialDataToSet.race,
        country: initialDataToSet.country,
        language: initialDataToSet.language,
      });
    }
  }, [focusedChatData, data, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Removes empty values and replaces them with undefined
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) =>
        value !== "" ? [key, value] : [key, undefined],
      ),
    ) as z.infer<typeof formSchema>;

    // Update global state (focusedChatData) with edited profile
    // setFocusedChatData(cleanedValues);

    // Update database with edited profile
    updateChatMutation.mutate({
      chatId: chatId!,
      birthDate: values.birthDate
        ? new Date(values.birthDate).toISOString()
        : "",
      ...cleanedValues,
    });
  };

  // TODO: Handle query loading and error states more explicitly in the UI if needed
  // For example, show a spinner while isQueryLoading, or an error message if isQueryError

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button data-cy="update-profile-dialog-trigger" variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent data-cy="update-profile-dialog-content" className="h-[70vh] w-[70vw]">
        <ScrollArea>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below!
            </DialogDescription>
          </DialogHeader>
          {isQueryLoading && <div data-cy="update-profile-loading-query">Loading profile...</div>}
          {isQueryError && <div data-cy="update-profile-error-query">Error loading profile.</div>}
          {(!isQueryLoading && !isQueryError && (data || focusedChatData)) && ( // Only render form if not loading/error and data is available
            <div data-cy="profile-form-wrapper">
              <ProfileFormComponent
                form={form}
                handleSubmit={onSubmit}
                submitLabel="Update Profile"
                isPending={updateChatMutation.isPending}
              />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
