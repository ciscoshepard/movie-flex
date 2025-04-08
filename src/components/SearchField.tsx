import React from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFieldProps extends Omit<TextFieldProps, 'InputProps'> {
  startIcon?: React.ReactNode;
}

const SearchField: React.FC<SearchFieldProps> = ({ 
  startIcon = <SearchIcon />, 
  ...props 
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      {...props}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ),
      }}
      sx={{
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
        ...props.sx
      }}
    />
  );
};

export default SearchField;