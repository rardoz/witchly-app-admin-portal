import FormFilters from "@/components/form/form-filters";
import FormLocale from "@/components/form/form-locale";
import FormSign from "@/components/form/form-sign";
import FormStatus from "@/components/form/form-status";

const SignsFilters = () => {
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
    </FormFilters>
  );
};

export default SignsFilters;
