import FormFilters from "@/components/form/form-filters";
import FormLocale from "@/components/form/form-locale";
import FormStatus from "@/components/form/form-status";
import FormPhases from "../form-phases";

const MoonPhasesFilters = () => {
  return (
    <FormFilters>
      <div>
        <FormPhases showNull />
      </div>
      <div>
        <FormLocale showNull />
      </div>
      <div>
        <FormStatus showNull />
      </div>
    </FormFilters>
  );
};

export default MoonPhasesFilters;
