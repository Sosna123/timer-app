<template>
    <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
    setup() {
        const jscookie = require("js-cookie");
        const route = useRoute();

        if (route.query.code) {
            let bearerToken = route.query.code;
            jscookie.set("bearer_token", bearerToken, { expires: 365 * 10 });
        }
    },
});
</script>

<style></style>
