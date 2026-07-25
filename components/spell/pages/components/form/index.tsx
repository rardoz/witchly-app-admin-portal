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
import createSpellbookPageAction, {
  type CreateSpellbookPageState,
} from "@/actions/spell/page/create";
import updateSpellbookPageAction, {
  type UpdateSpellbookPageState,
} from "@/actions/spell/page/update";
import FormAvatar from "@/components/form/form-avatar";
import FormBackground from "@/components/form/form-background";
import FormButton from "@/components/form/form-button";
import FormColorPicker from "@/components/form/form-color-picker";
import FormFont from "@/components/form/form-font";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormMeta from "@/components/form/form-meta";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import RichTextEditor from "@/components/form/rich-text-editor";
import type { SpellbookPage } from "@/types/spellbook-page";

const mapDataToState = (data?: SpellbookPage) => ({
  title: data?.title || "",
  shortDescription: data?.shortDescription || "",
  richText: data?.richText || "",
  primaryColor: data?.primaryColor || "",
  textColor: data?.textColor || "",
  backgroundColor: data?.backgroundColor || "",
  font: data?.font || "",
  status: data?.status || "",
  visibility: data?.visibility || "",
  primaryAsset: data?.primaryAsset?.id || "",
  primaryAssetPublicUrl: data?.primaryAsset?.publicUrl || "",
  backgroundAsset: data?.backgroundAsset?.id || "",
  backgroundAssetPublicUrl: data?.backgroundAsset?.publicUrl || "",
  meta: data?.meta || [],
});

const SpellPageForm = ({
  spellPageData,
  spellbookId,
}: {
  spellPageData?: SpellbookPage;
  spellbookId?: string;
}) => {
  const [state, formAction] = useActionState<
    UpdateSpellbookPageState | null,
    FormData
  >(updateSpellbookPageAction, null);

  const [createState, createFormAction] = useActionState<
    CreateSpellbookPageState | null,
    FormData
  >(createSpellbookPageAction, null);

  const navigator = useRouter();

  const [formValues, setFormValues] = useState(() =>
    mapDataToState(spellPageData),
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

  useEffect(() => {
    if (state?.message) {
      setFormValues(mapDataToState(spellPageData));
    }
  }, [state, spellPageData]);

  useEffect(() => {
    if (createState?.id) {
      navigator.push(`/spell/pages/edit/${createState.id}`);
    }
  }, [createState, navigator]);

  const formPrimaryAsset = useMemo(() => {
    return (
      <FormAvatar
        noCrop
        asset={{
          publicUrl: formValues.primaryAssetPublicUrl,
          id: formValues.primaryAsset,
        }}
        primaryColor={formValues.primaryColor}
        onUpdateAsset={(assetId, publicUrl) => {
          setFormValues((prev) => ({
            ...prev,
            primaryAsset: assetId,
            primaryAssetPublicUrl: publicUrl,
          }));
        }}
      />
    );
  }, [
    formValues.primaryAsset,
    formValues.primaryAssetPublicUrl,
    formValues.primaryColor,
  ]);

  const formBackgroundAsset = useMemo(() => {
    return (
      <FormBackground
        type="background"
        asset={{
          publicUrl: formValues.backgroundAssetPublicUrl,
          id: formValues.backgroundAsset,
        }}
        primaryColor={formValues.primaryColor}
        onUpdateAsset={(assetId, publicUrl) => {
          setFormValues((prev) => ({
            ...prev,
            backgroundAsset: assetId,
            backgroundAssetPublicUrl: publicUrl,
          }));
        }}
      />
    );
  }, [
    formValues.backgroundAsset,
    formValues.backgroundAssetPublicUrl,
    formValues.primaryColor,
  ]);

  return (
    <form action={spellPageData ? formAction : createFormAction}>
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
      <div className="flex gap-4 mb-4">
        <div>
          <FormLabel htmlFor="primaryAsset">Cover Image</FormLabel>
          {formPrimaryAsset}
        </div>
        <div>{formBackgroundAsset}</div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
        <div>
          <FormLabel htmlFor="title">Title</FormLabel>
          <FormInput
            name="title"
            type="text"
            required
            value={formValues.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormFont
            showNull
            value={formValues.font}
            handleChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="primaryColor">Primary Color</FormLabel>
          <FormColorPicker
            value={formValues.primaryColor || ""}
            onChange={(color) =>
              setFormValues((prev) => ({
                ...prev,
                primaryColor: color.toHexString(),
              }))
            }
          />
          <FormInput
            name="primaryColor"
            type="hidden"
            value={formValues.primaryColor}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="textColor">Text Color</FormLabel>
          <FormColorPicker
            value={formValues.textColor || ""}
            onChange={(color) =>
              setFormValues((prev) => ({
                ...prev,
                textColor: color.toHexString(),
              }))
            }
          />
          <FormInput
            name="textColor"
            type="hidden"
            value={formValues.textColor}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="backgroundColor">Background Color</FormLabel>
          <FormColorPicker
            value={formValues.backgroundColor || ""}
            onChange={(color) =>
              setFormValues((prev) => ({
                ...prev,
                backgroundColor: color.toHexString(),
              }))
            }
          />
          <FormInput
            name="backgroundColor"
            type="hidden"
            value={formValues.backgroundColor}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="status">Status</FormLabel>
          <FormSelect
            id="status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="deleted">Deleted</option>
          </FormSelect>
        </div>
        <div>
          <FormLabel htmlFor="visibility">Visibility</FormLabel>
          <FormSelect
            id="visibility"
            name="visibility"
            value={formValues.visibility}
            onChange={handleChange}
            required
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </FormSelect>
        </div>
        <div>
          <FormMeta
            value={formValues.meta}
            handleChange={(value) =>
              setFormValues((prev) => ({
                ...prev,
                meta: value,
              }))
            }
          />
        </div>
        <div>
          <FormLabel htmlFor="shortDescription">Short Description</FormLabel>
          <FormTextarea
            name="shortDescription"
            value={formValues.shortDescription}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className="md:col-span-2">
          <FormLabel htmlFor="richText">Rich Text</FormLabel>
          <RichTextEditor
            name="richText"
            value={formValues.richText}
            backgroundColor={formValues.backgroundColor}
            font={formValues.font}
            textColor={formValues.textColor}
            primaryColor={formValues.primaryColor}
            onChange={(html) =>
              setFormValues((prev) => ({ ...prev, richText: html }))
            }
          />
        </div>
        <FormInput
          name="primaryAsset"
          type="hidden"
          value={formValues.primaryAsset}
          onChange={handleChange}
        />
        <FormInput
          name="backgroundAsset"
          type="hidden"
          value={formValues.backgroundAsset}
          onChange={handleChange}
        />
        {spellPageData && (
          <FormInput name="id" type="hidden" value={spellPageData.id} />
        )}
        {(spellbookId || spellPageData?.spellbook) && (
          <FormInput
            name="spellbook"
            type="hidden"
            value={spellbookId || spellPageData?.spellbook || ""}
          />
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

export default SpellPageForm;
