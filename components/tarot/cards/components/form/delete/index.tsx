"use client";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import deleteTarotCardAction, {
  type DeleteTarotCardState,
} from "@/actions/tarot/card/delete";
import FormButton from "@/components/form/form-button";
import Modal from "@/components/modal";

const DeleteTarotCardForm: React.FC<{ id: string; tarotDeckId: string }> = ({
  id,
  tarotDeckId,
}) => {
  const router = useRouter();
  const [deleteState, deleteFormAction] = useActionState<
    DeleteTarotCardState | null,
    FormData
  >(deleteTarotCardAction, null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (deleteState?.message) {
      setIsModalOpen(true);
    }
  }, [deleteState]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      confirm(
        "Are you sure you want to delete this? This action can not be undone.",
      )
    ) {
      const formData = new FormData(e.currentTarget);
      startTransition(() => {
        deleteFormAction(formData);
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-between items-center gap-4"
    >
      <input type="hidden" name="id" value={id || ""} />
      <input type="hidden" name="tarotDeckId" value={tarotDeckId || ""} />
      <FormButton className="bg-red-800 hover:bg-orange-800">
        <FaTrash /> Delete Tarot Card
      </FormButton>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (deleteState?.success) {
            router.replace(`/tarot/cards/${tarotDeckId}`);
          }
        }}
      >
        <div className="w-xl flex items-center gap-4">
          {deleteState?.success ? (
            <>
              <FaCheckCircle className="text-green-600 text-5xl" />
              <div>
                <h2 className="text-lg font-bold text-green-600">Success</h2>
                <p>{deleteState?.message}</p>
              </div>
            </>
          ) : (
            <>
              <FaExclamationTriangle className="text-red-600 text-5xl" />
              <div>
                <h2 className="text-lg font-bold text-red-600">Error</h2>
                <p>{deleteState?.message}</p>
              </div>
            </>
          )}
        </div>
      </Modal>
    </form>
  );
};

export default DeleteTarotCardForm;
