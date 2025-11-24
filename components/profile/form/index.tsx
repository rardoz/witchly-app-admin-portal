"use client";

import { useActionState, useEffect, useState } from "react";
import updateUserAction, { type UpdateUserState } from "@/actions/user/update";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import type { User } from "@/types/user";

const ProfileForm = ({ userData }: { userData: User }) => {
  const [state, formAction] = useActionState<UpdateUserState | null, FormData>(
    updateUserAction,
    null,
  );

  const [formValues, setFormValues] = useState(() => ({
    name: userData.name || "",
    handle: userData.handle || "",
    email: userData.email || "",
    location: userData.location || "",
    birthDate: userData.birthDate || "",
    sign: userData.sign || "",
    sex: userData.sex || "",
    pronouns: userData.pronouns || "",
    bio: userData.bio || "",
    shortBio: userData.shortBio || "",
    primaryColor: userData.primaryColor || "",
    instagramHandle: userData.instagramHandle || "",
    tikTokHandle: userData.tikTokHandle || "",
    twitterHandle: userData.twitterHandle || "",
    websiteUrl: userData.websiteUrl || "",
    facebookUrl: userData.facebookUrl || "",
    snapchatHandle: userData.snapchatHandle || "",
    profileAsset: userData.profileAsset?.id || "",
    backdropAsset: userData.backdropAsset?.id || "",
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (state?.message) {
      console.log(state.success ? "✅" : "❌", state.message);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [state]);

  return (
    <form action={formAction}>
      {state?.message && (
        <div
          className={`mb-6 rounded-lg border p-4 ${
            state.success
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          <p className="text-sm font-medium">{state.message}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="name">Name</FormLabel>
          <FormInput
            name="name"
            type="text"
            defaultValue={formValues.name || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="handle">Handle</FormLabel>
          <FormInput
            name="handle"
            type="text"
            required
            defaultValue={formValues.handle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput
            name="email"
            type="email"
            required
            defaultValue={formValues.email || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="location">Location</FormLabel>
          <FormInput
            name="location"
            type="text"
            defaultValue={formValues.location || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="birthDate">Birth Day</FormLabel>
          <FormInput
            name="birthDate"
            type="text"
            defaultValue={formValues.birthDate || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="sign">Sign</FormLabel>
          <FormInput
            name="sign"
            type="text"
            defaultValue={formValues.sign || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="sex">Sex</FormLabel>
          <FormInput
            name="sex"
            type="text"
            defaultValue={formValues.sex || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
          <FormInput
            name="pronouns"
            type="text"
            defaultValue={formValues.pronouns || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="bio">Long Bio</FormLabel>
          <FormInput
            name="bio"
            type="text"
            defaultValue={formValues.bio || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="shortBio">Short Bio</FormLabel>
          <FormInput
            name="shortBio"
            type="text"
            defaultValue={formValues.shortBio || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="primaryColor">Primary Color</FormLabel>
          <FormInput
            name="primaryColor"
            type="text"
            defaultValue={formValues.primaryColor || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="instagramHandle">Instagram Handle</FormLabel>
          <FormInput
            name="instagramHandle"
            type="text"
            defaultValue={formValues.instagramHandle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="tikTokHandle">TikTok Handle</FormLabel>
          <FormInput
            name="tikTokHandle"
            type="text"
            defaultValue={formValues.tikTokHandle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="twitterHandle">Twitter Handle</FormLabel>
          <FormInput
            name="twitterHandle"
            type="text"
            defaultValue={formValues.twitterHandle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="websiteUrl">Website URL</FormLabel>
          <FormInput
            name="websiteUrl"
            type="url"
            defaultValue={formValues.websiteUrl || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="facebookUrl">Facebook URL</FormLabel>
          <FormInput
            name="facebookUrl"
            type="url"
            defaultValue={formValues.facebookUrl || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="snapchatHandle">Snapchat Handle</FormLabel>
          <FormInput
            name="snapchatHandle"
            type="text"
            defaultValue={formValues.snapchatHandle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="profileAsset">Profile Asset</FormLabel>
          <FormInput
            name="profileAsset"
            type="text"
            defaultValue={formValues.profileAsset || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="backdropAsset">Backdrop Asset</FormLabel>
          <FormInput
            name="backdropAsset"
            type="text"
            defaultValue={formValues.backdropAsset || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="id">ID</FormLabel>
          <FormInput name="id" type="text" defaultValue={userData.id || ""} />
        </div>
      </div>
      <div>
        <FormButton className="mt-6">Save Changes</FormButton>
      </div>
    </form>
  );
};

export default ProfileForm;
