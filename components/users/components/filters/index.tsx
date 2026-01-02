import FormFilters from "@/components/form/form-filters";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import FormSelect from "@/components/form/form-select";

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
      <div>
        <FormLabel htmlFor="access">Access</FormLabel>
        <FormSelect id="access" name="access">
          <option value="">Select Access</option>
          <option value="admin">Admin</option>
          <option value="basic">Basic</option>
          <option value="denied">Denied</option>
        </FormSelect>
      </div>
    </FormFilters>
  );
};

export default UsersFilters;
