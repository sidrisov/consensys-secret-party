import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

export default function HomeLogo(props: any) {
  return (
    <Box
      {...props}
      component={Link}
      to="/"
      sx={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Typography ml={0.5} color="primary" variant="h6">
        🎉 Secret Party
      </Typography>
    </Box>
  );
}
