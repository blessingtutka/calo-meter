import { createTamagui } from 'tamagui';

const config = createTamagui({
    fonts: {
        body: {
            family: 'Poppins',
            size: {},
        },
    },
    themes: {
        light: {
            background: '#fff',
            color: '#000',
        },
        dark: {
            background: '#000',
            color: '#fff',
        },
        active: {
            backgroundColor: '$blue5',
            borderColor: '$blue7',
            color: '$white',
        },
    },
});

export default config;
