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
import createTarotCardAction, {
  type CreateTarotCardState,
} from "@/actions/tarot/card/create";
import updateTarotCardAction, {
  type UpdateTarotCardState,
} from "@/actions/tarot/card/update";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormStatus from "@/components/form/form-status";
import FormTextarea from "@/components/form/form-textarea";
import FormCardAsset from "@/components/tarot/components/form-card-asset";
import type { TarotCard } from "@/types/tarot-card";

const mapTarotCardDataToState = (tarotCardData?: TarotCard) => ({
  name: tarotCardData?.name || "",
  tarotCardNumber: tarotCardData?.tarotCardNumber || "",
  description: tarotCardData?.description || "",
  meta: tarotCardData?.meta?.join(", ") || "",
  status: tarotCardData?.status || "active",
  primaryAsset: tarotCardData?.primaryAsset?.id || "",
  primaryAssetPublicUrl: tarotCardData?.primaryAsset?.publicUrl || "",
});

const TarotCardForm = ({
  tarotCardData,
  tarotDeckId,
}: {
  tarotCardData?: TarotCard;
  tarotDeckId?: string;
}) => {
  const [state, formAction] = useActionState<
    UpdateTarotCardState | null,
    FormData
  >(updateTarotCardAction, null);

  const [createState, createFormAction] = useActionState<
    CreateTarotCardState | null,
    FormData
  >(createTarotCardAction, null);

  const navigator = useRouter();

  const [formValues, setFormValues] = useState(() =>
    mapTarotCardDataToState(tarotCardData),
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

  // Add this new useEffect to sync formValues when tarotCardData changes
  useEffect(() => {
    if (state?.message) {
      setFormValues(mapTarotCardDataToState(tarotCardData));
    }
  }, [state, tarotCardData]);
  useEffect(() => {
    if (createState?.id) {
      navigator.push(`/tarot/cards/edit/${createState.id}`);
    }
  }, [createState, navigator]);

  const formCardAsset = useMemo(() => {
    return (
      <FormCardAsset
        type="primary"
        primaryColor={tarotCardData?.tarotDeck.primaryColor}
        asset={{
          ...tarotCardData?.primaryAsset,
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
    tarotCardData?.primaryAsset,
    formValues.primaryAsset,
    formValues.primaryAssetPublicUrl,
    tarotCardData?.tarotDeck.primaryColor,
  ]);

  return (
    <form action={tarotCardData ? formAction : createFormAction}>
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
      <div className="overflow-auto flex gap-8">{formCardAsset}</div>
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
          <FormLabel htmlFor="tarotCardNumber">Tarot Card Number</FormLabel>
          <FormInput
            name="tarotCardNumber"
            type="text"
            value={formValues.tarotCardNumber || ""}
            onChange={handleChange}
          />
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
        {tarotCardData && (
          <FormInput name="id" type="hidden" value={tarotCardData?._id || ""} />
        )}
        {tarotDeckId && (
          <FormInput name="tarotDeck" type="hidden" value={tarotDeckId} />
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

export default TarotCardForm;
