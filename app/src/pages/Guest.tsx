import { Box, Button, CardMedia, TextField, Typography } from '@mui/material';
import { useContext, useMemo, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { UserContext } from '../contexts/UserContext';
import { MerkleTree } from '../utils/MerkleTree';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Stack } from '@mui/system';

import { keccak256 } from 'ethereum-cryptography/keccak';
import { bytesToHex } from 'ethereum-cryptography/utils';

export default function Guest() {
  const { isWalletConnected, contract, userAddress } = useContext(UserContext);

  const [isVerified, setVerified] = useState(false);

  async function verify() {
    if (isWalletConnected && contract && userAddress) {
      const code = (window.document.getElementById('code') as HTMLInputElement)
        .value;

      console.log('address + code', userAddress, code);

      const invitation = bytesToHex(
        keccak256(Buffer.concat([Buffer.from(userAddress), Buffer.from(code)]))
      );

      console.log('invitation', invitation);

      const invitations = await contract.getInvitationList();
      const merkleTree = new MerkleTree(invitations);
      const index = invitations.findIndex((n: string) => n === invitation);
      const proof = merkleTree.getProof(index);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_VERIFIER_SERVICE_URL}/verify`,
          {
            name: invitation,
            proof: proof,
          }
        );
        setVerified(true);
        toast.success(response.data);
      } catch (err: any) {
        toast.error(err.response.data);
      }
      (window.document.getElementById('code') as HTMLInputElement).value = '';
    }
  }

  return (
    <>
      <Helmet>
        <title> Secret Party | Guest </title>
      </Helmet>
      <Box mt={3} display="flex" flexDirection="column" alignItems="center">
        {!isVerified ? (
          <>
            <Typography color="primary" align="center" variant="h6" m={1}>
              Please, prove you're invited!
            </Typography>
            {isWalletConnected && contract && (
              <Stack m={1} spacing={1} direction="row">
                <TextField variant="outlined" label="Secret Code" id="code" />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    verify();
                  }}>
                  Submit
                </Button>
              </Stack>
            )}
          </>
        ) : (
          <img src="group_of_people.jpg" width={400} />
        )}
      </Box>
    </>
  );
}
