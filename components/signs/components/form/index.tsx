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
import createSignAction, { type CreateSignState } from "@/actions/sign/create";
import updateSignAction, { type UpdateSignState } from "@/actions/sign/update";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormLocale from "@/components/form/form-locale";
import FormSign from "@/components/form/form-sign";
import FormStatus from "@/components/form/form-status";
import FormTextarea from "@/components/form/form-textarea";
import FormAsset from "@/components/signs/components/form-asset";
import type { Sign } from "@/types/sign";

const mapDataToState = (data?: Sign) => ({
  title: data?.title || "",
  description: data?.description || "",
  locale: data?.locale || "",
  sign: data?.sign || "",
  asset: data?.asset?.id || "",
  assetPublicUrl: data?.asset?.publicUrl || "",
  signLocal: data?.signLocal || "",
  status: data?.status || "",
});

const SignForm = ({ signData }: { signData?: Sign }) => {
  const [state, formAction] = useActionState<UpdateSignState | null, FormData>(
    updateSignAction,
    null,
  );

  const [createState, createFormAction] = useActionState<
    CreateSignState | null,
    FormData
  >(createSignAction, null);

  const navigator = useRouter();

  const [formValues, setFormValues] = useState(() => mapDataToState(signData));

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
      setFormValues(mapDataToState(signData));
    }
  }, [state, signData]);
  useEffect(() => {
    if (createState?.id) {
      navigator.push(`/signs/${createState.id}`);
    }
  }, [createState, navigator]);

  const formCardAsset = useMemo(() => {
    return (
      <FormAsset
        type="primary"
        asset={{
          publicUrl: formValues.assetPublicUrl,
          id: formValues.asset,
        }}
        onUpdateAsset={(assetId, publicUrl) => {
          setFormValues((prev) => ({
            ...prev,
            asset: assetId,
            assetPublicUrl: publicUrl,
          }));
        }}
      />
    );
  }, [formValues.asset, formValues.assetPublicUrl]);
  return (
    <form action={signData ? formAction : createFormAction}>
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
      <div>{formCardAsset}</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
        <div>
          <FormSign
            value={formValues.sign}
            required
            handleChange={handleChange}
            showNull
          />
        </div>

        <div>
          <FormLabel htmlFor="signLocal">Sign Translation</FormLabel>
          <FormInput
            name="signLocal"
            type="text"
            required
            value={formValues.signLocal || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormLabel htmlFor="title">Title</FormLabel>
          <FormInput
            name="title"
            type="text"
            value={formValues.title || ""}
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
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormTextarea
            name="description"
            value={formValues.description || ""}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div>
          <FormStatus value={formValues.status} handleChange={handleChange} />
        </div>
        <FormInput
          name="asset"
          type="hidden"
          value={formValues.asset || ""}
          onChange={handleChange}
        />
        {signData && (
          <FormInput name="id" type="hidden" value={signData?._id || ""} />
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

export default SignForm;
