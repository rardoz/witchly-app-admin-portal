import FormFilters from "@/components/form/form-filters";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormLocale from "@/components/form/form-locale";
import FormSign from "@/components/form/form-sign";
import FormStatus from "../form/form-status";

const HoroscopesFilters = () => {
  return (
    <FormFilters>
      <div>
        <FormLocale showNull />
      </div>
      <div>
        <FormSign showNull />
      </div>
      <div>
        <FormStatus showNull />
      </div>
      <div>
        <FormLabel htmlFor="horoscopeDate">Horoscope Date</FormLabel>
        <FormInput id="horoscopeDate" name="horoscopeDate" type="date" />
      </div>
    </FormFilters>
  );
};

export default HoroscopesFilters;
