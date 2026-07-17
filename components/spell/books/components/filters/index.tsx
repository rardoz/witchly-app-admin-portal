import FormFilters from "@/components/form/form-filters";
import FormLabel from "@/components/form/form-label";
import FormSelect from "@/components/form/form-select";
import FormStatus from "@/components/form/form-status";

const SpellBooksFilters = () => {
  return (
    <FormFilters>
      <div>
        <FormStatus showNull />
      </div>
      <div>
        <FormLabel htmlFor="visibility">Visibility</FormLabel>
        <FormSelect id="visibility" name="visibility">
          <option value="">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </FormSelect>
      </div>
    </FormFilters>
  );
};

export default SpellBooksFilters;
