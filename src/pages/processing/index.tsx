import Head from "next/head";
import Image from "next/image";
import { alpha } from "@mui/material/styles";
import logo from "../../../public/logo-abertura.svg";
import { Roboto } from "next/font/google";
import NavigationModal from "@components/compound/NavigationModal";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Container,
  Fade,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import useHandler from "./useHandler";
import { AddCircleOutline } from "@mui/icons-material";
import NewProcessingModal from "@components/compound/NewProcessingModal";
import { useAuth } from '../../services/auth/authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin-ext"],
});

function TableToolbar(props: any, ref: any) {
  const { setOpenPopover, setShowNewProcessingModal } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...{
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Jobs
      </Typography>
      <Tooltip title="New Processing">
        <IconButton onClick={() => setShowNewProcessingModal(true)}>
          <AddCircleOutline />
          <div
            ref={ref}
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
            }}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Filter list">
        <IconButton onClick={() => setOpenPopover(true)}>
          <FilterListIcon />
          <div
            ref={ref}
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
            }}
          />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

const EnhancedTableToolbar = forwardRef(TableToolbar);

export default function Processing() {
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');  
    }
  }, [isAuthenticated, router]);
  


  const {
    dataInfo,
    columnTitles,
    page,
    rowsPerPage,
    selectedFilter,
    filterValue,
    handleChangePage,
    handleChangeRowsPerPage,
    handleFilterChange,
    handleFilterValueChange,
  } = useHandler();
  const [openPopover, setOpenPopover] = useState(false);
  const [showNewProcessingModal, setShowNewProcessingModal] = useState(false);

  const filterButtonRef = useRef(null);

  const rowsPerPageFixed = useRef(rowsPerPage);

  const headCells = useMemo(() => {
    const result = [];

    const props = {
      fontWeight: "700",
    };

    if (columnTitles.length > 0)
      result.push(
        <TableCell {...props} key={columnTitles[0]}>
          {columnTitles[0]}
        </TableCell>
      );

    for (let i = 1; i < columnTitles.length; i++) {
      result.push(
        <TableCell {...props} key={columnTitles[i]} align="right">
          {columnTitles[i]}
        </TableCell>
      );
    }

    return result;
  }, [columnTitles]);

  const bodyCell = useCallback((row: (string | number)[]) => {
    const result = [];

    if (row.length > 0)
      result.push(
        <TableCell key={String(0)} component="th" scope="row">
          {row[0]}
        </TableCell>
      );

    for (let i = 1; i < row.length; i++) {
      result.push(
        <TableCell key={String(i)} align="right">
          {row[i]}
        </TableCell>
      );
    }

    return result;
  }, []);

  return (
    <>
      <Head>
        <title>SAPS | Processing</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationModal />
      <main className={roboto.className}>
        <Fade in={true} unmountOnExit>
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                minHeight: "64px",
                width: "100%",
                maxHeight: "64px",
                padding: "4px 0",
                backgroundColor: "primary.main",
                display: "flex",
                justifyContent: "center",
              }}
              color="primary"
            >
              <Image
                src={logo}
                alt="Logo"
                style={{
                  objectFit: "contain",
                  height: "100%",
                  marginBottom: "24px",
                }}
              />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                width: "100%",
              }}
            >
              <Container
                sx={{
                  padding: "2vh 0",
                }}
              >
                <EnhancedTableToolbar
                  setOpenPopover={setOpenPopover}
                  setShowNewProcessingModal={setShowNewProcessingModal}
                  ref={filterButtonRef}
                />
                <NewProcessingModal
                  open={showNewProcessingModal}
                  onClose={() => {
                    setShowNewProcessingModal(false);
                  }}
                />
                <Popover
                  open={openPopover}
                  onClose={() => setOpenPopover(false)}
                  anchorEl={filterButtonRef.current}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Box
                    sx={{
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <ToggleButtonGroup
                      color="primary"
                      value={selectedFilter}
                      exclusive
                      onChange={handleFilterChange}
                      aria-label="Platform"
                      orientation="vertical"
                      size="small"
                      sx={{
                        width: "100%",
                        marginBottom: "12px",
                      }}
                    >
                      <ToggleButton value="label">Label</ToggleButton>
                      <ToggleButton value="id">{"  Id  "}</ToggleButton>
                    </ToggleButtonGroup>
                    <TextField
                      id="standard-basic"
                      label="Filter"
                      variant="outlined"
                      size="small"
                      value={filterValue}
                      disabled={!selectedFilter}
                      onChange={handleFilterValueChange}
                    />
                  </Box>
                </Popover>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>{headCells}</TableRow>
                    </TableHead>
                    <TableBody>
                      {dataInfo.data.map((d, i) => {
                        return (
                          <TableRow key={String(i)}>{bodyCell(d)}</TableRow>
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[1, 2, 3].map(
                            (multiplier) =>
                              multiplier * rowsPerPageFixed.current
                          )}
                          colSpan={columnTitles.length}
                          count={dataInfo.size}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              "aria-label": "rows per page",
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Container>
            </Box>
          </Box>
        </Fade>
      </main>
    </>
  );
}
