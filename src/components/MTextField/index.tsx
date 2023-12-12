import { TextField, TextFieldProps } from '@mui/material';
import InputMask from 'react-input-mask';

type MTextFieldProps = TextFieldProps & {
  mask?: string;
};

export function MTextField({ mask, ...other }: MTextFieldProps) {
  return mask ? (
    <InputMask mask={mask}>
      {() => <TextField InputProps={{ disableUnderline: true }} {...other} />}
    </InputMask>
  ) : (
    <TextField {...other} />
  );
}
