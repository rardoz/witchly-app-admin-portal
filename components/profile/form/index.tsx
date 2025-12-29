"use client";

import { useRouter } from "next/navigation";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FaRegSave } from "react-icons/fa";
import createUserAction, { type CreateUserState } from "@/actions/user/create";
import updateUserAction, { type UpdateUserState } from "@/actions/user/update";
import FormAvatar from "@/components/form/form-avatar";
import FormBackdrop from "@/components/form/form-backdrop";
import FormButton from "@/components/form/form-button";
import FormColorPicker from "@/components/form/form-color-picker";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import type { User } from "@/types/user";

const mapUserDataToState = (userData?: User) => ({
  name: userData?.name || "",
  handle: userData?.handle || "",
  email: userData?.email || "",
  location: userData?.location || "",
  birthDate: userData?.birthDate || "",
  sign: userData?.sign || "",
  sex: userData?.sex || "",
  pronouns: userData?.pronouns || "",
  bio: userData?.bio || "",
  shortBio: userData?.shortBio || "",
  primaryColor: userData?.primaryColor || "",
  instagramHandle: userData?.instagramHandle || "",
  tikTokHandle: userData?.tikTokHandle || "",
  twitterHandle: userData?.twitterHandle || "",
  websiteUrl: userData?.websiteUrl || "",
  facebookUrl: userData?.facebookUrl || "",
  snapchatHandle: userData?.snapchatHandle || "",
  profileAsset: userData?.profileAsset?.id || "",
  backdropAsset: userData?.backdropAsset?.id || "",
  backdropAssetPublicUrl: userData?.backdropAsset?.publicUrl || "",
  profileAssetPublicUrl: userData?.profileAsset?.publicUrl || "",
  access: userData?.allowedScopes?.includes("admin")
    ? "admin"
    : userData?.allowedScopes?.includes("basic")
      ? "basic"
      : userData?.allowedScopes
        ? "denied"
        : "",
});

const ProfileForm = ({ userData }: { userData?: User }) => {
  const [state, formAction] = useActionState<UpdateUserState | null, FormData>(
    updateUserAction,
    null,
  );

  const [createState, createFormAction] = useActionState<
    CreateUserState | null,
    FormData
  >(createUserAction, null);

  const navigator = useRouter();

  const [formValues, setFormValues] = useState(() =>
    mapUserDataToState(userData),
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormValues((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  useEffect(() => {
    if (state?.message || createState?.message) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [state, createState]);

  // Add this new useEffect to sync formValues when userData changes
  useEffect(() => {
    if (state?.message) {
      setFormValues(mapUserDataToState(userData));
    }
  }, [state, userData]);

  useEffect(() => {
    if (createState?.id) {
      navigator.push(`/users/${createState.id}`);
    }
  }, [createState, navigator]);

  const formBackdrop = useMemo(() => {
    return (
      <FormBackdrop
        asset={{
          ...userData?.backdropAsset,
          id: userData?.backdropAsset?.id || "",
          publicUrl: formValues.backdropAssetPublicUrl,
        }}
        onUpdateAsset={(assetId, backdropAssetPublicUrl) => {
          setFormValues((prev) => ({
            ...prev,
            backdropAsset: assetId,
            backdropAssetPublicUrl,
          }));
        }}
      />
    );
  }, [userData?.backdropAsset, formValues.backdropAssetPublicUrl]);

  const formAvatar = useMemo(() => {
    return (
      <FormAvatar
        className="my-4 -mt-32 ml-4"
        primaryColor={userData?.primaryColor}
        asset={{
          ...userData?.profileAsset,
          publicUrl: formValues.profileAssetPublicUrl,
          id: formValues.profileAsset || "",
        }}
        onUpdateAsset={(assetId, publicUrl) => {
          setFormValues((prev) => ({
            ...prev,
            profileAsset: assetId,
            profileAssetPublicUrl: publicUrl,
          }));
        }}
      />
    );
  }, [
    userData?.profileAsset,
    formValues.profileAsset,
    formValues.profileAssetPublicUrl,
    userData?.primaryColor,
  ]);

  const formColorPicker = useMemo(() => {
    return (
      <FormColorPicker
        value={formValues.primaryColor || ""}
        onChange={(color) =>
          setFormValues((prev) => ({
            ...prev,
            primaryColor: color.toString(),
          }))
        }
      />
    );
  }, [formValues.primaryColor]);
  return (
    <form action={userData ? formAction : createFormAction}>
      {(state?.message || createState?.message) && (
        <div
          className={`mb-6 rounded-lg border p-4 ${
            state?.success || createState?.success
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          <p className="text-sm font-medium">
            {state?.message || createState?.message}
          </p>
        </div>
      )}
      {formBackdrop}
      {formAvatar}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="name">Name</FormLabel>
          <FormInput
            name="name"
            type="text"
            value={formValues.name || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="handle">Handle</FormLabel>
          <FormInput
            name="handle"
            type="text"
            required
            value={formValues.handle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput
            name="email"
            type="email"
            required
            value={formValues.email || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="location">Location</FormLabel>
          <FormInput
            name="location"
            type="text"
            value={formValues.location || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="birthDate">Birth Day</FormLabel>
          <FormInput
            name="birthDate"
            type="date"
            value={formValues.birthDate || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="sign">Sign</FormLabel>
          <FormSelect
            name="sign"
            value={formValues.sign || ""}
            onChange={handleChange}
          >
            <option value="">Select your sign</option>
            <option value="capricorn">
              Capricorn (December 22 - January 19)
            </option>
            <option value="aquarius">
              Aquarius (January 20 - February 18)
            </option>
            <option value="pisces">Pisces (February 19 - March 20)</option>
            <option value="aries">Aries (March 21 - April 19)</option>
            <option value="taurus">Taurus (April 20 - May 20)</option>
            <option value="gemini">Gemini (May 21 - June 20)</option>
            <option value="cancer">Cancer (June 21 - July 22)</option>
            <option value="leo">Leo (July 23 - August 22)</option>
            <option value="virgo">Virgo (August 23 - September 22)</option>
            <option value="libra">Libra (September 23 - October 22)</option>
            <option value="scorpio">Scorpio (October 23 - November 21)</option>
            <option value="sagittarius">
              Sagittarius (November 22 - December 21)
            </option>
          </FormSelect>
        </div>
        <div>
          <FormLabel htmlFor="sex">Sex</FormLabel>
          <FormSelect
            name="sex"
            value={formValues.sex || ""}
            onChange={handleChange}
          >
            <option value="">Select your sex</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </FormSelect>
        </div>
        <div>
          <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
          <FormSelect
            name="pronouns"
            value={formValues.pronouns || ""}
            onChange={handleChange}
          >
            <option value="">Choose your pronouns</option>
            <option value="she/her">She / Her</option>
            <option value="he/him">He / Him</option>
            <option value="they/them">They / Them</option>
            <option value="she/they">She / They</option>
            <option value="he/they">He / They</option>
            <option value="he/she">He / She</option>
            <option value="any">Any pronouns</option>
            <option value="none">No pronouns (use my name)</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </FormSelect>
        </div>
        <div>
          <FormLabel htmlFor="bio">Long Bio</FormLabel>
          <FormTextarea
            name="bio"
            value={formValues.bio || ""}
            onChange={handleChange}
            rows={1}
          />
        </div>
        <div>
          <FormLabel htmlFor="shortBio">Short Bio</FormLabel>
          <FormInput
            name="shortBio"
            type="text"
            value={formValues.shortBio || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="primaryColor">Primary Color</FormLabel>
          {formColorPicker}
        </div>
        <div>
          <FormLabel htmlFor="instagramHandle">Instagram Handle</FormLabel>
          <FormInput
            name="instagramHandle"
            type="text"
            value={formValues.instagramHandle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="tikTokHandle">TikTok Handle</FormLabel>
          <FormInput
            name="tikTokHandle"
            type="text"
            value={formValues.tikTokHandle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="twitterHandle">Twitter Handle</FormLabel>
          <FormInput
            name="twitterHandle"
            type="text"
            value={formValues.twitterHandle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="websiteUrl">Website URL</FormLabel>
          <FormInput
            name="websiteUrl"
            type="url"
            value={formValues.websiteUrl || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="facebookUrl">Facebook URL</FormLabel>
          <FormInput
            name="facebookUrl"
            type="url"
            value={formValues.facebookUrl || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="snapchatHandle">Snapchat Handle</FormLabel>
          <FormInput
            name="snapchatHandle"
            type="text"
            value={formValues.snapchatHandle || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="access">Access</FormLabel>
          <FormSelect
            name="access"
            onChange={handleChange}
            value={formValues.access || ""}
          >
            <option value="">Select Access</option>
            <option value="admin">Admin</option>
            <option value="basic">Basic</option>
            <option value="denied">Denied</option>
          </FormSelect>
        </div>
        <FormInput
          name="profileAsset"
          type="hidden"
          value={formValues.profileAsset || ""}
          onChange={handleChange}
        />
        <FormInput
          name="backdropAsset"
          type="hidden"
          value={formValues.backdropAsset || ""}
          onChange={handleChange}
        />
        {userData && (
          <FormInput name="id" type="hidden" value={userData?.id || ""} />
        )}
      </div>
      <div className="flex items-center gap-4 mt-6">
        <FormButton>
          <FaRegSave />
          Save Changes
        </FormButton>
      </div>
    </form>
  );
};

export default ProfileForm;
