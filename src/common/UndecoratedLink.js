import styled from "styled-components";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";


const UndecoratedLink = styled(Link)`
    text-decoration: none;

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
        color: #333;
    }
`;

export default UndecoratedLink;
