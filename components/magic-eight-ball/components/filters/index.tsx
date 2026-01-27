import FormFilters from "@/components/form/form-filters";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormLocale from "@/components/form/form-locale";
import FormStatus from "@/components/form/form-status";

const MagicEightBallFilters = () => {
  return (
    <FormFilters>
      <div>
        <FormLocale showNull />
      </div>
      <div>
        <FormStatus showNull />
      </div>
      <div>
        <FormLabel htmlFor="diceNumber">Dice Number</FormLabel>
        <FormInput name="diceNumber" type="number" />
      </div>
    </FormFilters>
  );
};

export default MagicEightBallFilters;
