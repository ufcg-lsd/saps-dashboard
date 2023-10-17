import { teal } from "@mui/material/colors";
import Link from "next/link";
import styled from "styled-components";

export default styled(Link)`
  font-size: 0.8rem;
  text-decoration: none;
  text-align: center;
  color: ${teal[500]};

  &:hover {
    text-decoration: underline;
  }
`;
