import { Button } from '@mui/material';
import openModal from 'src/utils/openModal';

interface IModalButtonProps<T> {
  modalData: T;
}

export function ModalButton<T>({ modalData }: IModalButtonProps<T>) {
  return (
    <Button variant="contained" onClick={() => openModal(modalData)}>
      Abrir modal
    </Button>
  );
}
