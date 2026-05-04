import React, { useState, useEffect } from "react";
import { Box, Button, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function ProductFilters({
  initial,
  onFilter,
}: {
  initial?: { q: string };
  onFilter: (vals: { q?: string }) => void;
}) {
  const [q, setQ] = useState("");

  // 🔁 sync initial value
  useEffect(() => {
    if (initial?.q !== undefined) {
      setQ(initial.q);
    }
  }, [initial]);

  // 🔥 AUTO SEARCH (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilter({ q });
    }, 300);

    return () => clearTimeout(timer);
  }, [q, onFilter]);

  return (
    <Box sx={{ mt: 2 }}>
      {/* 🔍 SEARCH BAR */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          background: "#f1f1f1",
          borderRadius: "50px",
          px: 2,
          py: 1,
        }}
      >
        <SearchIcon sx={{ color: "#444" }} />

        <InputBase
          placeholder="Search for Gold, Silver jewellery..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
        />

        {q && (
          <Button size="small" onClick={() => setQ("")}>
            RESET
          </Button>
        )}
      </Box>
    </Box>
  );
}