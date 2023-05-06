import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Container,
  Drawer,
  Stack,
} from '@mui/material';

import SecretPartyListArtifact from '../../../smart-contracts/artifacts/contracts/SecretPartyList.sol/SecretPartyList.json';
import { SecretPartyList } from '../../../smart-contracts/typechain-types';

import CustomThemeProvider from '../theme/CustomThemeProvider';
import { LightModeOutlined, DarkModeOutlined, Menu } from '@mui/icons-material';

import Nav from '../components/Navigation';

import { UserContext } from '../contexts/UserContext';
import HideOnScroll from '../components/HideOnScroll';

import { useAccount, useContract, useProvider, useSigner } from 'wagmi';

const drawerWidth = 220;

export default function AppLayout({ appSettings, setAppSettings }: any) {
  const defaultProvider = useProvider();
  const signer = useSigner();
  const { isConnected: isWalletConnected, address: userAddress } = useAccount();

  const secretPartyContract = useContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: SecretPartyListArtifact.abi,
    signerOrProvider: signer.data || defaultProvider,
  }) as SecretPartyList;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = <Nav />;
  return (
    <CustomThemeProvider darkMode={appSettings.darkMode}>
      <UserContext.Provider
        value={{
          isWalletConnected,
          userAddress: userAddress,
          contract: secretPartyContract,
          appSettings,
          setAppSettings,
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}>
              {drawer}
            </Drawer>
            {
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                  },
                }}
                open>
                {drawer}
              </Drawer>
            }
          </Box>
          <Box flexGrow={1}>
            <HideOnScroll>
              <AppBar
                position="sticky"
                color="transparent"
                elevation={0}
                sx={{ backdropFilter: 'blur(5px)' }}>
                <Toolbar
                  sx={{
                    justifyContent: 'space-between',
                  }}>
                  <Box>
                    <IconButton
                      color="inherit"
                      onClick={handleDrawerToggle}
                      sx={{ display: { sm: 'none' } }}>
                      <Menu />
                    </IconButton>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() =>
                        setAppSettings({
                          ...appSettings,
                          darkMode: !appSettings.darkMode,
                        })
                      }>
                      {appSettings.darkMode ? (
                        <DarkModeOutlined />
                      ) : (
                        <LightModeOutlined />
                      )}
                    </IconButton>

                    <ConnectButton
                      showBalance={{ smallScreen: false, largeScreen: true }}
                      chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
                    />
                  </Stack>
                </Toolbar>
              </AppBar>
            </HideOnScroll>

            <Box
              sx={{
                my: 5,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Container>
                <Outlet />
              </Container>
            </Box>
          </Box>
        </Box>
      </UserContext.Provider>
    </CustomThemeProvider>
  );
}
