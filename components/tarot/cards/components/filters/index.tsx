import FormFilters from "@/components/form/form-filters";
import FormStatus from "@/components/form/form-status";

const TarotCardsFilters = () => {
  return (
    <FormFilters>
      <div>
        <FormStatus showNull />
      </div>
    </FormFilters>
  );
};

export default TarotCardsFilters;
