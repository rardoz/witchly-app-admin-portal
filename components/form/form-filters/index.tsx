"use client";
import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa6";
import FormButton from "../form-button";

const FormFilters: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const search = useSearchParams();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchParams = new URLSearchParams(search.toString());
    for (const [key, value] of formData.entries()) {
      if (value) searchParams.set(key, value.toString());
      else searchParams.delete(key);
      searchParams.set("offset", "0");
    }
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const searchParams = new URLSearchParams(search.toString());
    for (const key of formData.keys()) {
      searchParams.delete(key);
    }
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(search.toString());
    for (const [key, value] of searchParams.entries()) {
      const input = formRef.current?.querySelector<HTMLInputElement>(
        `[name="${key}"]`,
      );
      if (input) {
        input.value = value;
      }
    }
  }, [search]);

  return (
    <div>
      <div
        className={`border-b border-foreground/10 grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <form
            className="p-4"
            onSubmit={onSubmit}
            onReset={onReset}
            ref={formRef}
          >
            <div className=" grid grid-cols-2 gap-4">{children}</div>
            <div className="flex items-center gap-4 mt-6">
              <FormButton type="submit">Apply Filters</FormButton>
              <FormButton
                type="reset"
                className="bg-red-800 hover:bg-orange-800"
              >
                Clear Filters
              </FormButton>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className={classNames(
            "btn px-7 rounded text-background flex justify-center items-center bg-gray-300 hover:bg-purple-500 cursor-pointer",
            { "pb-2": !isOpen, "pt-2": isOpen },
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>
    </div>
  );
};

export default FormFilters;
