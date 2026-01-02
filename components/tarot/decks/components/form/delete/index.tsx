"use client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import deleteTarotDeckAction, {
  type DeleteTarotDeckState,
} from "@/actions/tarot/deck/delete";
import FormButton from "@/components/form/form-button";
import Modal from "@/components/modal";

const DeleteTarotDeckForm: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const [deleteState, deleteFormAction] = useActionState<
    DeleteTarotDeckState | null,
    FormData
  >(deleteTarotDeckAction, null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (deleteState?.message) {
      setIsModalOpen(true);
    }
  }, [deleteState]);

  return (
    <form
      action={deleteFormAction}
      className="flex justify-between items-center gap-4"
    >
      <input type="hidden" name="id" value={id || ""} />
      <FormButton className="bg-red-800 hover:bg-orange-800">
        <FaTrash /> Delete Tarot Deck
      </FormButton>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (deleteState?.success) {
            router.replace("/tarot/decks");
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

export default DeleteTarotDeckForm;
