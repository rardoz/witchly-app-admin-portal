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
import { FaRegSave } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import createMoonPhaseAction, {
  type CreateMoonPhaseState,
} from "@/actions/moon-phase/create";
import updateMoonPhaseAction, {
  type UpdateMoonPhaseState,
} from "@/actions/moon-phase/update";
import FormAvatar from "@/components/form/form-avatar";
import FormAsset from "@/components/form/form-background";
import FormButton from "@/components/form/form-button";
import FormColorPicker from "@/components/form/form-color-picker";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormLocale from "@/components/form/form-locale";
import FormStatus from "@/components/form/form-status";
import FormTextarea from "@/components/form/form-textarea";
import type { MoonPhase } from "@/types/moon-phase";
import FormPhases from "../form-phases";

const mapDataToState = (data?: MoonPhase) => ({
  phase: data?.phase || "",
  description: data?.description || "",
  locale: data?.locale || "",
  phaseLocal: data?.phaseLocal || "",
  primaryAsset: data?.primaryAsset?.id || "",
  primaryAssetPublicUrl: data?.primaryAsset?.publicUrl || "",
  backgroundAsset: data?.backgroundAsset?.id || "",
  backgroundAssetPublicUrl: data?.backgroundAsset?.publicUrl || "",
  primaryColor: data?.primaryColor || "",
  status: data?.status || "",
});

const MoonPhaseForm = ({ moonPhaseData }: { moonPhaseData?: MoonPhase }) => {
  const [state, formAction] = useActionState<
    UpdateMoonPhaseState | null,
    FormData
  >(updateMoonPhaseAction, null);

  const [createState, createFormAction] = useActionState<
    CreateMoonPhaseState | null,
    FormData
  >(createMoonPhaseAction, null);

  const navigator = useRouter();

  const [formValues, setFormValues] = useState(() =>
    mapDataToState(moonPhaseData),
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

  // Add this new useEffect to sync formValues when data changes
  useEffect(() => {
    if (state?.message) {
      setFormValues(mapDataToState(moonPhaseData));
    }
  }, [state, moonPhaseData]);
  useEffect(() => {
    if (createState?.id) {
      navigator.push(`/moon-phases/${createState.id}`);
    }
  }, [createState, navigator]);

  const formCardAsset = useMemo(() => {
    return (
      <FormAvatar
        noCrop
        asset={{
          publicUrl: formValues.primaryAssetPublicUrl,
          id: formValues.primaryAsset,
        }}
        primaryColor={formValues.primaryColor || ""}
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
      <FormAsset
        type="background"
        asset={{
          publicUrl: formValues.backgroundAssetPublicUrl,
          id: formValues.backgroundAsset,
        }}
        primaryColor={formValues.primaryColor || ""}
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
            primaryColor: color.toString(),
          }))
        }
      />
    );
  }, [formValues.primaryColor]);

  return (
    <form action={moonPhaseData ? formAction : createFormAction}>
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
      <div className="flex gap-2">
        <div>
          <FormLabel htmlFor="asset">
            <span className="flex gap-2 items-center justify-start mb-2">
              Moon image{" "}
              {formValues.primaryAssetPublicUrl && (
                <Link
                  target="_blank"
                  className="cursor-pointer"
                  href={formValues.primaryAssetPublicUrl || ""}
                >
                  <FaEye />
                </Link>
              )}
            </span>
          </FormLabel>
          {formCardAsset}
        </div>
        <div>{formBackgroundAsset}</div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
        <div>
          <FormPhases
            value={formValues.phase}
            handleChange={handleChange}
            required
          />
        </div>
        <div>
          <FormLabel htmlFor="phaseLocal">Phase Translation</FormLabel>
          <FormInput
            name="phaseLocal"
            type="text"
            required
            value={formValues.phaseLocal || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="primaryColor">Primary Color</FormLabel>
          {formColorPicker}
        </div>

        <div>
          <FormStatus value={formValues.status} handleChange={handleChange} />
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
        <div>
          <FormLocale
            required
            value={formValues.locale}
            handleChange={handleChange}
          />
        </div>
        <FormInput
          name="primaryAsset"
          type="hidden"
          value={formValues.primaryAsset || ""}
          onChange={handleChange}
        />
        <FormInput
          name="backgroundAsset"
          type="hidden"
          value={formValues.backgroundAsset || ""}
          onChange={handleChange}
        />
        {moonPhaseData && (
          <FormInput name="id" type="hidden" value={moonPhaseData?._id || ""} />
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

export default MoonPhaseForm;
