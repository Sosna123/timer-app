// import "bootstrap/dist/css/bootstrap.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

//* vuetify imports
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/util/colors";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: "dark",
        themes: {
            dark: {
                colors: {
                    primary: colors.grey.darken3,
                    secondary: colors.grey.darken2,
                    tertiary: colors.grey.darken1,
                },
            },
            red: {
                dark: true,
                colors: {
                    primary: colors.red.darken3,
                    secondary: colors.red.darken2,
                    tertiary: colors.red.darken1,
                    background: colors.red.darken4,
                },
            },
            pink: {
                dark: true,
                colors: {
                    primary: colors.pink.darken3,
                    secondary: colors.pink.darken2,
                    tertiary: colors.pink.darken1,
                    background: colors.pink.darken4,
                },
            },
            purple: {
                dark: true,
                colors: {
                    primary: colors.purple.darken3,
                    secondary: colors.purple.darken2,
                    tertiary: colors.purple.darken1,
                    background: colors.purple.darken4,
                },
            },
            "deep-purple": {
                dark: true,
                colors: {
                    primary: colors.deepPurple.darken3,
                    secondary: colors.deepPurple.darken2,
                    tertiary: colors.deepPurple.darken1,
                    background: colors.deepPurple.darken4,
                },
            },
            indigo: {
                dark: true,
                colors: {
                    primary: colors.indigo.darken3,
                    secondary: colors.indigo.darken2,
                    tertiary: colors.indigo.darken1,
                    background: colors.indigo.darken4,
                },
            },
            blue: {
                dark: true,
                colors: {
                    primary: colors.blue.darken3,
                    secondary: colors.blue.darken2,
                    tertiary: colors.blue.darken1,
                    background: colors.blue.darken4,
                },
            },
            "light-blue": {
                dark: true,
                colors: {
                    primary: colors.lightBlue.darken3,
                    secondary: colors.lightBlue.darken2,
                    tertiary: colors.lightBlue.darken1,
                    background: colors.lightBlue.darken4,
                },
            },
            cyan: {
                dark: true,
                colors: {
                    primary: colors.cyan.darken3,
                    secondary: colors.cyan.darken2,
                    tertiary: colors.cyan.darken1,
                    background: colors.cyan.darken4,
                },
            },
            teal: {
                dark: true,
                colors: {
                    primary: colors.teal.darken3,
                    secondary: colors.teal.darken2,
                    tertiary: colors.teal.darken1,
                    background: colors.teal.darken4,
                },
            },
            green: {
                dark: true,
                colors: {
                    primary: colors.green.darken3,
                    secondary: colors.green.darken2,
                    tertiary: colors.green.darken1,
                    background: colors.green.darken4,
                },
            },
            "light-green": {
                dark: true,
                colors: {
                    primary: colors.lightGreen.darken3,
                    secondary: colors.lightGreen.darken2,
                    tertiary: colors.lightGreen.darken1,
                    background: colors.lightGreen.darken4,
                },
            },
            lime: {
                dark: true,
                colors: {
                    primary: colors.lime.darken3,
                    secondary: colors.lime.darken2,
                    tertiary: colors.lime.darken1,
                    background: colors.lime.darken4,
                },
            },
            yellow: {
                dark: true,
                colors: {
                    primary: colors.yellow.darken3,
                    secondary: colors.yellow.darken2,
                    tertiary: colors.yellow.darken1,
                    background: colors.yellow.darken4,
                },
            },
            amber: {
                dark: true,
                colors: {
                    primary: colors.amber.darken3,
                    secondary: colors.amber.darken2,
                    tertiary: colors.amber.darken1,
                    background: colors.amber.darken4,
                },
            },
            orange: {
                dark: true,
                colors: {
                    primary: colors.orange.darken3,
                    secondary: colors.orange.darken2,
                    tertiary: colors.orange.darken1,
                    background: colors.orange.darken4,
                },
            },
            "deep-orange": {
                dark: true,
                colors: {
                    primary: colors.deepOrange.darken3,
                    secondary: colors.deepOrange.darken2,
                    tertiary: colors.deepOrange.darken1,
                    background: colors.deepOrange.darken4,
                },
            },
            brown: {
                dark: true,
                colors: {
                    primary: colors.brown.darken3,
                    secondary: colors.brown.darken2,
                    tertiary: colors.brown.darken1,
                    background: colors.brown.darken4,
                },
            },
            "blue-grey": {
                dark: true,
                colors: {
                    primary: colors.blueGrey.darken3,
                    secondary: colors.blueGrey.darken2,
                    tertiary: colors.blueGrey.darken1,
                    background: colors.blueGrey.darken4,
                },
            },
        },
    },
});

createApp(App).use(router).use(vuetify).mount("#app");

// import "bootstrap/dist/js/bootstrap.js";
