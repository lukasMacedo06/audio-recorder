import { styled } from '@mui/material';

export const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 300px;
  /* Adjust as needed */
  background-color: #f5f5f5;
  /* Example background color */
  padding: 20px;
  border-radius: 10px;
  /* Rounded corners */
`;

export const Title = styled('h4')`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;
