import FormFilters from "@/components/form/form-filters";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormLocale from "@/components/form/form-locale";

const SignsFilters = () => {
  return (
    <FormFilters>
      <div>
        <FormLocale showNull />
      </div>
      <div>
        <FormLabel htmlFor="sign">Sign</FormLabel>
        <FormInput type="text" id="sign" name="sign" />
      </div>
    </FormFilters>
  );
};

export default SignsFilters;
