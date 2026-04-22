import React, { useState } from "react";
import { Box, TextField, Select, MenuItem, Button } from "@mui/material";

export default function ProductFilters({
  initial,
  onFilter,
}: {
  initial?: { q: string; category: string };
  onFilter: (vals: { q?: string; category?: string }) => void;
}) {
  const [q, setQ] = useState(initial?.q ?? "");
  const [category, setCategory] = useState(initial?.category ?? "all");

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
      <TextField
        placeholder="Search products..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        size="small"
      />
      <Select value={category} onChange={(e) => setCategory(e.target.value)} size="small">
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="Gold">Gold</MenuItem>
        <MenuItem value="Silver">Silver</MenuItem>
        <MenuItem value="Diamond">1Gram Gold Polished Jewellery</MenuItem>
      </Select>

      <Button variant="contained" onClick={() => onFilter({ q, category })}>Apply</Button>
      <Button onClick={() => { setQ(""); setCategory("all"); onFilter({ q: "", category: "all" }); }}>Reset</Button>
    </Box>
  );
}
