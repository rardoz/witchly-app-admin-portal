"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FaEye, FaRegSave } from "react-icons/fa";
import createSpellbookAction, {
  type CreateSpellbookState,
} from "@/actions/spell/book/create";
import updateSpellbookAction, {
  type UpdateSpellbookState,
} from "@/actions/spell/book/update";
import FormAvatar from "@/components/form/form-avatar";
import FormBackground from "@/components/form/form-background";
import FormButton from "@/components/form/form-button";
import FormColorPicker from "@/components/form/form-color-picker";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import type { Spellbook } from "@/types/spellbook";
import type { SpellbookPage } from "@/types/spellbook-page";
import type { SpellbookPagesData } from "@/types/spellbook-pages";

const mapDataToState = (data?: Spellbook) => ({
  title: data?.title || "",
  description: data?.description || "",
  primaryColor: data?.primaryColor || "",
  textColor: data?.textColor || "",
  font: data?.font || "",
  status: data?.status || "",
  visibility: data?.visibility || "",
  primaryAsset: data?.primaryAsset?.id || "",
  primaryAssetPublicUrl: data?.primaryAsset?.publicUrl || "",
  backgroundAsset: data?.backgroundAsset?.id || "",
  backgroundAssetPublicUrl: data?.backgroundAsset?.publicUrl || "",
  meta: data?.meta?.join(", ") || "",
});

const SpellBookForm = ({
  spellBookData,
  spellPagesData,
}: {
  spellBookData?: Spellbook;
  spellPagesData?: SpellbookPagesData;
}) => {
  const [state, formAction] = useActionState<
    UpdateSpellbookState | null,
    FormData
  >(updateSpellbookAction, null);

  const [createState, createFormAction] = useActionState<
    CreateSpellbookState | null,
    FormData
  >(createSpellbookAction, null);

  const navigator = useRouter();

  const [formValues, setFormValues] = useState(() =>
    mapDataToState(spellBookData),
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
      setFormValues(mapDataToState(spellBookData));
    }
  }, [state, spellBookData]);

  useEffect(() => {
    if (createState?.id) {
      navigator.push(`/spell/books/${createState.id}`);
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

  const formColorPicker = useMemo(() => {
    return (
      <FormColorPicker
        value={formValues.primaryColor || ""}
        onChange={(color) =>
          setFormValues((prev) => ({
            ...prev,
            primaryColor: color.toHexString(),
          }))
        }
      />
    );
  }, [formValues.primaryColor]);

  return (
    <form action={spellBookData ? formAction : createFormAction}>
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
          <FormLabel htmlFor="primaryAsset">
            <span className="flex gap-2 items-center justify-start mb-2">
              Cover Image{" "}
              {formValues.primaryAssetPublicUrl && (
                <Link
                  target="_blank"
                  className="cursor-pointer"
                  href={formValues.primaryAssetPublicUrl}
                >
                  <FaEye />
                </Link>
              )}
            </span>
          </FormLabel>
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
          <FormLabel htmlFor="font">Font</FormLabel>
          <FormInput
            name="font"
            type="text"
            value={formValues.font}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="primaryColor">Primary Color</FormLabel>
          {formColorPicker}
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
          <FormLabel htmlFor="meta">Metadata (comma separated)</FormLabel>
          <FormInput
            name="meta"
            type="text"
            value={formValues.meta}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormTextarea
            name="description"
            value={formValues.description}
            onChange={handleChange}
            rows={4}
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
        {spellBookData && (
          <FormInput name="id" type="hidden" value={spellBookData.id} />
        )}
      </div>
      {spellPagesData && spellPagesData.records.length > 0 && (
        <div className="mt-6">
          <FormLabel>Pages ({spellPagesData.totalCount})</FormLabel>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {spellPagesData.records.map((page: SpellbookPage) => (
              <Link
                key={page.id}
                href={`/spell/pages/edit/${page.id}`}
                className="bg-zinc-800 p-2 rounded text-sm text-gray-300 hover:bg-zinc-700"
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 mt-6">
        <FormButton>
          <FaRegSave />
          Save Changes
        </FormButton>
      </div>
    </form>
  );
};

export default SpellBookForm;
