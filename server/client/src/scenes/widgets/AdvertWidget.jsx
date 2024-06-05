import { Typography, useTheme, Link } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Link
          href="https://mail.google.com/mail/u/0/?fs=1&to=lattana.rb@gmail.com&tf=cm"
          color={medium}
          underline="hover"
        >
          <Typography>Create Ad</Typography>
        </Link>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3005/assets/info4.jpeg"
        style={{ borderRadius: "0.75rem", margin: "0.5rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Sponser Name</Typography>
        <Typography color={medium}>SponserWebsite.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Something about sponser
      </Typography>
    </WidgetWrapper>
  );
};
export default AdvertWidget;
