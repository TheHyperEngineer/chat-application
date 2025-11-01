import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useChatStore } from "../store/chatStore";

const Loader: React.FC = () => {
  const loading = useChatStore((state) => state.loading);
  if (!loading) return null;
  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2}>
      <CircularProgress color="primary" />
    </Box>
  );
};

export default Loader;
