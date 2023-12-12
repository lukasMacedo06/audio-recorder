import { keyframes } from '@mui/material';

export const appearFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  50% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const jump = keyframes`
  0% {
    transform: translate3d(0,0,0) scale3d(1,1,1);
  }
  50% {
    transform: translate3d(0,10%,0) scale3d(1,1,1);
  }
  100% {
    transform: translate3d(0,40%,0) scale3d(1,1,1);
  }
`;

export const flip = keyframes`
  0% {
    transform: translate3d(0,0,0) scale3d(1,1,1);
  }
  50% {
    transform: translate3d(0,0,0) scale3d(0,1,1);
  }
  100% {
    transform: translate3d(0,0,0) scale3d(1,1,1);
  }
`;
