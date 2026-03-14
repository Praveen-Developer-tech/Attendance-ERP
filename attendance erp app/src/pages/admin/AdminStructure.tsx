import { useState } from "react";
import { Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addBatch, addDepartment } from "../../features/admin/adminSlice";
import { nanoid } from "@reduxjs/toolkit";

const AdminStructure = () => {
  const dispatch = useAppDispatch();
  const { departments, batches } = useAppSelector((state) => state.admin);
  const [deptForm, setDeptForm] = useState({ name: "", code: "" });
  const [batchForm, setBatchForm] = useState({ name: "", year: new Date().getFullYear(), departmentId: departments[0]?.id ?? "" });

  const handleAddDepartment = () => {
    if (!deptForm.name || !deptForm.code) return;
    dispatch(addDepartment({ id: nanoid(), ...deptForm }));
    setDeptForm({ name: "", code: "" });
  };

  const handleAddBatch = () => {
    if (!batchForm.name || !batchForm.departmentId) return;
    dispatch(
      addBatch({
        id: nanoid(),
        name: batchForm.name,
        departmentId: batchForm.departmentId,
        year: Number(batchForm.year),
      }),
    );
    setBatchForm((prev) => ({ ...prev, name: "" }));
  };

  return (
    <Box>
      <PageHeader title="Departments & Batches" subtitle="Maintain NHU academic structure" />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h3" fontSize={20} mb={2}>
                Departments
              </Typography>
              <Stack spacing={2} mb={3}>
                <TextField label="Name" value={deptForm.name} onChange={(event) => setDeptForm((prev) => ({ ...prev, name: event.target.value }))} />
                <TextField label="Code" value={deptForm.code} onChange={(event) => setDeptForm((prev) => ({ ...prev, code: event.target.value }))} />
                <Button variant="contained" onClick={handleAddDepartment}>
                  Add Department
                </Button>
              </Stack>
              <Stack spacing={1}>
                {departments.map((dept) => (
                  <Box key={dept.id} p={2} borderRadius={2} bgcolor="background.default">
                    <Typography fontWeight={600}>{dept.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dept.code}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h3" fontSize={20} mb={2}>
                Batches
              </Typography>
              <Stack spacing={2} mb={3}>
                <TextField label="Name" value={batchForm.name} onChange={(event) => setBatchForm((prev) => ({ ...prev, name: event.target.value }))} />
                <TextField label="Year" type="number" value={batchForm.year} onChange={(event) => setBatchForm((prev) => ({ ...prev, year: Number(event.target.value) }))} />
                <TextField select label="Department" value={batchForm.departmentId} onChange={(event) => setBatchForm((prev) => ({ ...prev, departmentId: event.target.value }))}>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant="contained" onClick={handleAddBatch}>
                  Add Batch
                </Button>
              </Stack>
              <Stack spacing={1}>
                {batches.map((batch) => (
                  <Box key={batch.id} p={2} borderRadius={2} bgcolor="background.default">
                    <Typography fontWeight={600}>{batch.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {batch.year} · {departments.find((dept) => dept.id === batch.departmentId)?.name}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStructure;
