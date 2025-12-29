import FormFilters from "@/components/form/form-filters";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";

const UsersFilters = () => {
  return (
    <FormFilters>
      <div>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormInput type="text" id="name" name="name" />
      </div>
      <div>
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormInput type="email" id="email" name="email" />
      </div>
      <div>
        <FormLabel htmlFor="handle">Handle</FormLabel>
        <FormInput type="text" id="handle" name="handle" />
      </div>
    </FormFilters>
  );
};

export default UsersFilters;
