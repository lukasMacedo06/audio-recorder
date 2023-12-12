import { useState, useEffect, ChangeEvent } from 'react';
import { Button, FormControl, TextField } from '@mui/material';
import { Zendesk } from 'src/services/Zendesk';

type ModalValues = {
  values: unknown; // <- adicionar a tipagem dos dados esperados
  // eslint-disable-next-line camelcase
  parent_id: string;
};

const zend = new Zendesk();

function Modal() {
  const [values, setValues] = useState<ModalValues>({} as ModalValues); // informações recebidas pelo socket

  useEffect(() => {
    zend.getInstances('ticket_sidebar', 'fetchData');
    zend.getInstances('new_ticket_sidebar', 'fetchData');

    zend.client.on('modalFetchData', async (data: any) => {
      setValues(data);
    });
  }, []);

  useEffect(() => {
    console.log('values', values); // <- valores recebidos do openModal
  }, [values]);

  /* ------------------- Exemplo ------------------- */
  const [formData, setFormData] = useState({ name: '', email: '', age: 26 });

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFormData(oldData => ({
      ...oldData,
      [target.name]: target.value,
    }));
  };

  const handleClick = () => {
    console.log({ formData });
  };

  return (
    <FormControl fullWidth>
      <TextField
        id="name"
        name="name"
        label="name"
        variant="standard"
        value={formData.name}
        onChange={handleChange}
        error={formData.name.length < 3}
        helperText={formData.name.length < 3 ? 'Mínimo de 3 caracteres' : ''}
      />
      <TextField
        id="email"
        name="email"
        label="email"
        variant="standard"
        value={formData.email}
        onChange={handleChange}
        error={
          !/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i.test(formData.email)
        }
        helperText={
          /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i.test(formData.email)
            ? ''
            : 'Email inválido'
        }
      />
      <TextField
        id="age"
        name="age"
        label="age"
        variant="standard"
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        value={formData.age}
        onChange={handleChange}
        error={formData.age < 18}
        helperText={formData.age < 18 ? 'Maior de 18 anos' : ''}
      />

      <Button variant="contained" onClick={handleClick}>
        Finish
      </Button>
    </FormControl>
  );
  /* ------------------- Exemplo ------------------- */
}

export default Modal;
