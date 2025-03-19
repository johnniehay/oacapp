/** Custom theme */
import {
  DEFAULT_THEME,
  createTheme
} from "@mantine/core";

const theme = createTheme({
  breakpoints: {
    xs: "36em",
    sm: "44em",
    md: "54em",
    lg: "64em",
    xl: "80em",
  },
  colors: DEFAULT_THEME.colors,
})

export default theme;
