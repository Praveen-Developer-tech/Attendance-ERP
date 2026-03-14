import { Box, Card, CardContent, FormControlLabel, Switch, Typography } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import { useState } from "react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    autoSync: true,
    showBeta: false,
  });

  return (
    <Box>
      <PageHeader title="ERP Settings" subtitle="Toggle global preferences" />
      <Card>
        <CardContent>
          <FormControlLabel
            control={<Switch checked={settings.emailAlerts} onChange={(event) => setSettings((prev) => ({ ...prev, emailAlerts: event.target.checked }))} />}
            label="Email alerts for attendance drops"
          />
          <FormControlLabel
            control={<Switch checked={settings.autoSync} onChange={(event) => setSettings((prev) => ({ ...prev, autoSync: event.target.checked }))} />}
            label="Auto-sync local changes"
          />
          <FormControlLabel
            control={<Switch checked={settings.showBeta} onChange={(event) => setSettings((prev) => ({ ...prev, showBeta: event.target.checked }))} />}
            label="Show beta features"
          />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Settings persist locally for demo purposes.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminSettings;
