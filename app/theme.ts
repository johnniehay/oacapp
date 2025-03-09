/** Custom theme */
import {
  DEFAULT_THEME,
  createTheme
} from "@mantine/core";

const theme = createTheme({
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },
  colors: DEFAULT_THEME.colors,
})

export default theme;
