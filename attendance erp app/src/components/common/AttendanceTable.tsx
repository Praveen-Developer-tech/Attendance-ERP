import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

export interface AttendanceRow {
  id: string;
  date: string;
  time: string;
  course: string;
  teacher: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

const statusColor: Record<AttendanceRow["status"], "success" | "error" | "warning"> = {
  present: "success",
  absent: "error",
  late: "warning",
};

interface AttendanceTableProps {
  rows: AttendanceRow[];
}

const AttendanceTable = ({ rows }: AttendanceTableProps) => (
  <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Course</TableCell>
          <TableCell>Teacher</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Remarks</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} hover>
            <TableCell>
              <Typography fontWeight={600}>{row.date}</Typography>
            </TableCell>
            <TableCell>{row.time}</TableCell>
            <TableCell>{row.course}</TableCell>
            <TableCell>{row.teacher}</TableCell>
            <TableCell>
              <Chip size="small" label={row.status.toUpperCase()} color={statusColor[row.status]} />
            </TableCell>
            <TableCell>{row.remarks ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default AttendanceTable;
