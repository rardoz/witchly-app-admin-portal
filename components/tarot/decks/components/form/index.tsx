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
import createTarotDeckAction, {
  type CreateTarotDeckState,
} from "@/actions/tarot/deck/create";
import updateTarotDeckAction, {
  type UpdateTarotDeckState,
} from "@/actions/tarot/deck/update";
import FormButton from "@/components/form/form-button";
import FormColorPicker from "@/components/form/form-color-picker";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormLocale from "@/components/form/form-locale";
import FormSelect from "@/components/form/form-select";
import FormStatus from "@/components/form/form-status";
import FormTextarea from "@/components/form/form-textarea";
import FormCardAsset from "@/components/tarot/components/form-card-asset";
import type { TarotDeck } from "@/types/tarot-deck";

const mapTarotDeckDataToState = (tarotDeckData?: TarotDeck) => ({
  name: tarotDeckData?.name || "",
  description: tarotDeckData?.description || "",
  locale: tarotDeckData?.locale || "",
  primaryColor: tarotDeckData?.primaryColor || "",
  author: tarotDeckData?.author || "",
  meta: tarotDeckData?.meta?.join(", ") || "",
  layoutType: tarotDeckData?.layoutType || "single",
  layoutCount: tarotDeckData?.layoutCount || "",
  status: tarotDeckData?.status || "",
  primaryAsset: tarotDeckData?.primaryAsset?.id || "",
  cardBackgroundAsset: tarotDeckData?.cardBackgroundAsset?.id || "",
  cardBackgroundAssetPublicUrl:
    tarotDeckData?.cardBackgroundAsset?.publicUrl || "",
  primaryAssetPublicUrl: tarotDeckData?.primaryAsset?.publicUrl || "",
});

const TarotDeckForm = ({ tarotDeckData }: { tarotDeckData?: TarotDeck }) => {
  const [state, formAction] = useActionState<
    UpdateTarotDeckState | null,
    FormData
  >(updateTarotDeckAction, null);

  const [createState, createFormAction] = useActionState<
    CreateTarotDeckState | null,
    FormData
  >(createTarotDeckAction, null);

  const navigator = useRouter();

  const [formValues, setFormValues] = useState(() =>
    mapTarotDeckDataToState(tarotDeckData),
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

  // Add this new useEffect to sync formValues when tarotDeckData changes
  useEffect(() => {
    if (state?.message) {
      setFormValues(mapTarotDeckDataToState(tarotDeckData));
    }
  }, [state, tarotDeckData]);
  useEffect(() => {
    if (createState?.id) {
      navigator.push(`/tarot/decks/${createState.id}`);
    }
  }, [createState, navigator]);

  const formCardBg = useMemo(() => {
    return (
      <FormCardAsset
        type="card-back"
        primaryColor={tarotDeckData?.primaryColor}
        asset={{
          ...tarotDeckData?.cardBackgroundAsset,
          id: tarotDeckData?.cardBackgroundAsset?.id || "",
          publicUrl: formValues.cardBackgroundAssetPublicUrl,
        }}
        onUpdateAsset={(assetId, cardBackgroundAssetPublicUrl) => {
          setFormValues((prev) => ({
            ...prev,
            cardBackgroundAsset: assetId,
            cardBackgroundAssetPublicUrl,
          }));
        }}
      />
    );
  }, [
    tarotDeckData?.cardBackgroundAsset,
    formValues.cardBackgroundAssetPublicUrl,
    tarotDeckData?.primaryColor,
  ]);

  const formCardAsset = useMemo(() => {
    return (
      <FormCardAsset
        type="primary"
        primaryColor={tarotDeckData?.primaryColor}
        asset={{
          ...tarotDeckData?.primaryAsset,
          publicUrl: formValues.primaryAssetPublicUrl,
          id: formValues.primaryAsset || "",
        }}
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
    tarotDeckData?.primaryAsset,
    formValues.primaryAsset,
    formValues.primaryAssetPublicUrl,
    tarotDeckData?.primaryColor,
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
    <form action={tarotDeckData ? formAction : createFormAction}>
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
      <div className="overflow-auto flex gap-8">
        {formCardAsset}
        {formCardBg}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
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
          <FormLocale
            required
            value={formValues.locale}
            handleChange={handleChange}
          />
        </div>

        <div>
          <FormLabel htmlFor="author">Author (override)</FormLabel>
          <FormInput
            placeholder={
              tarotDeckData?.user?.name || tarotDeckData?.user?.handle
            }
            name="author"
            type="text"
            value={formValues.author || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="primaryColor">Primary Color</FormLabel>
          {formColorPicker}
        </div>
        <div>
          <FormLabel htmlFor="meta">Metadata (comma separated)</FormLabel>
          <FormInput
            name="meta"
            type="text"
            value={formValues.meta || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="layoutType">Layout Type</FormLabel>
          <FormSelect
            name="layoutType"
            value={formValues.layoutType || ""}
            onChange={handleChange}
          >
            <option value="single">Single Card</option>
            <option value="classic">Classic Side by Side</option>
          </FormSelect>
        </div>
        <div>
          <FormLabel htmlFor="layoutCount">Layout Count</FormLabel>
          <FormInput
            name="layoutCount"
            type="number"
            min={1}
            value={
              formValues.layoutType === "single"
                ? 1
                : formValues.layoutCount || "3"
            }
            onChange={handleChange}
          />
        </div>

        <div>
          <FormStatus
            required
            value={formValues.status}
            handleChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormTextarea
            name="description"
            value={formValues.description || ""}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <FormInput
          name="primaryAsset"
          type="hidden"
          value={formValues.primaryAsset || ""}
          onChange={handleChange}
        />
        <FormInput
          name="cardBackgroundAsset"
          type="hidden"
          value={formValues.cardBackgroundAsset || ""}
          onChange={handleChange}
        />
        {tarotDeckData && (
          <FormInput name="id" type="hidden" value={tarotDeckData?._id || ""} />
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

export default TarotDeckForm;
