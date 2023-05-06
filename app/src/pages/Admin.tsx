import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { Helmet } from 'react-helmet-async';
import { UserContext } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';

import { keccak256 } from 'ethereum-cryptography/keccak';
import { bytesToHex } from 'ethereum-cryptography/utils';
import { MerkleTree } from '../utils/MerkleTree';

export default function Admin() {
  const { isWalletConnected, contract, userAddress } = useContext(UserContext);

  async function invite() {
    if (isWalletConnected && contract) {
      if ((await contract.owner()) !== userAddress) {
        toast.error("You're not the admin!");
        return;
      }

      const address = (
        window.document.getElementById('address') as HTMLInputElement
      ).value;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_VERIFIER_SERVICE_URL}/code`,
          address
        );

        const code = response.data.toString();

        console.log('address + code', address, code);
        const invitation = bytesToHex(
          keccak256(Buffer.concat([Buffer.from(address), Buffer.from(code)]))
        );

        console.log('invitation', invitation);

        (await contract.invite([invitation])).wait();

        toast.success(`Address ${address} is invited!`);
      } catch (error) {
        toast.error('Failed to invite!');
        console.log(error);
      } finally {
        contract.once(contract.filters.Invited(), async () => {
          const invitations = await contract.getInvitationList();
          const merkleTree = new MerkleTree(invitations);

          await axios.post(
            `${import.meta.env.VITE_VERIFIER_SERVICE_URL}/update`,
            {
              root: merkleTree.getRoot(),
            }
          );
        });
      }

      (window.document.getElementById('address') as HTMLInputElement).value =
        '';
    }
  }

  return (
    <>
      <Helmet>
        <title> Secret Party | Admin </title>
      </Helmet>
      <Box mt={3} display="flex" flexDirection="column" alignItems="center">
        <Typography color="primary" align="center" variant="h6" m={1}>
          Invite to Secret Party!
        </Typography>
        {isWalletConnected && contract && (
          <Stack m={1} spacing={1} direction="row">
            <TextField variant="outlined" label="Address" id="address" />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                invite();
              }}>
              Submit
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
}
