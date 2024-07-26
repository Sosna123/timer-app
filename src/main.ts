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

const vuetify = createVuetify({
    components,
    directives,
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
            purple: {
                colors: {
                    primary: colors.deepPurple.darken3,
                    secondary: colors.deepPurple.darken2,
                    tertiary: colors.deepPurple.darken1,
                },
            },
            amber: {
                colors: {
                    primary: colors.amber.darken3,
                    secondary: colors.amber.darken2,
                    tertiary: colors.amber.darken1,
                },
            },
        },
    },
});

createApp(App).use(router).use(vuetify).mount("#app");

// import "bootstrap/dist/js/bootstrap.js";
