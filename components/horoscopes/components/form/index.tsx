"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import createHoroscopeAction, {
  type CreateHoroscopeState,
} from "@/actions/horoscope/create";
import updateHoroscopeAction, {
  type UpdateHoroscopeState,
} from "@/actions/horoscope/update";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormLocale from "@/components/form/form-locale";
import FormSign from "@/components/form/form-sign";
import FormTextarea from "@/components/form/form-textarea";
import FormStatus from "@/components/horoscopes/components/form/form-status";
import type { Horoscope } from "@/types/horoscope";

const mapDataToState = (data?: Horoscope) => ({
  sign: data?.sign || "",
  horoscopeText: data?.horoscopeText || "",
  locale: data?.locale || "",
  status: data?.status || "pending",
  horoscopeDate: data?.horoscopeDate
    ? dayjs(data?.horoscopeDate?.split("T")[0]).format("YYYY-MM-DD")
    : "",
});

const HoroscopeForm = ({ horoscopeData }: { horoscopeData?: Horoscope }) => {
  const [state, formAction] = useActionState<
    UpdateHoroscopeState | null,
    FormData
  >(updateHoroscopeAction, null);

  const [createState, createFormAction] = useActionState<
    CreateHoroscopeState | null,
    FormData
  >(createHoroscopeAction, null);

  const navigator = useRouter();

  const [formValues, setFormValues] = useState(() =>
    mapDataToState(horoscopeData),
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
      setFormValues(mapDataToState(horoscopeData));
    }
  }, [state, horoscopeData]);
  useEffect(() => {
    if (createState?.id) {
      navigator.push(`/horoscopes/${createState.id}`);
    }
  }, [createState, navigator]);

  return (
    <form action={horoscopeData ? formAction : createFormAction}>
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
          <FormLabel htmlFor="horoscopeDate">Horoscope Date</FormLabel>
          <FormInput
            name="horoscopeDate"
            type="date"
            required
            value={formValues.horoscopeDate || ""}
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
          <FormStatus
            value={formValues.status}
            handleChange={handleChange}
            required
          />
        </div>
        <div>
          <FormLabel htmlFor="horoscopeText">Horoscope</FormLabel>
          <FormTextarea
            name="horoscopeText"
            required
            value={formValues.horoscopeText || ""}
            onChange={handleChange}
          />
        </div>
        {horoscopeData && (
          <FormInput name="id" type="hidden" value={horoscopeData?._id || ""} />
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

export default HoroscopeForm;
