import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
    // palette: {
    //     primary: {
    //         main: '#252547',
    //         light: '#323259'
    //     }
    // },
    typography: {
        fontFamily: [
            'Oswald'
        ].join(',')
    }
});

theme = responsiveFontSizes(theme);

export default theme;