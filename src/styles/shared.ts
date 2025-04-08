// src/styles/shared.ts
export const searchFieldStyle = {
  backgroundColor: 'rgba(30, 30, 30, 0.7)',
  backdropFilter: 'blur(8px)',
  borderRadius: 2,
  '& .MuiOutlinedInput-root': {
    color: 'white',
    borderRadius: 2,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
};