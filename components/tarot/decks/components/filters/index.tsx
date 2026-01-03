import FormFilters from "@/components/form/form-filters";
import FormLocale from "@/components/form/form-locale";
import FormStatus from "@/components/form/form-status";

const TarotDecksFilters = () => {
  return (
    <FormFilters>
      <div>
        <FormLocale showNull />
      </div>
      <div>
        <FormStatus showNull />
      </div>
    </FormFilters>
  );
};

export default TarotDecksFilters;
