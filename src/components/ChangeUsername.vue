<template>
    <div
        class="position-absolute d-flex"
        style="
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.6);
        ">
        <div>
            <div>
                <a
                    class="v-btn v-btn--elevated v-theme--dark bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated"
                    href="https://www.worldcubeassociation.org/oauth/authorize?client_id=veUGFyAGSPOnGaI2jpEzn6hZX6FPxnRGyGyf0NEY6N0&redirect_uri=https%3A%2F%2Flocalhost%3A8080&response_type=code&scope="
                    >Login using wca</a
                >
            </div>
            <div>
                <v-text-field
                    hide-details="auto"
                    label="Type in your username"
                    style="width: 400px"
                    v-model="newUsername">
                </v-text-field>
                <v-btn
                    style="width: 400px"
                    color="primary"
                    @click="
                        newUsername.length > 0 && !username.startsWith('wca-')
                            ? $emit('username-changed', newUsername)
                            : null
                    "
                    >Submit</v-btn
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
    props: ["username"],
    setup(props) {
        let newUsername = ref<string>(props.username);
        const route = useRoute();

        watch(props.username, (username: string) => {
            newUsername.value = username;
        });

        return {
            newUsername,
        };
    },
});
</script>

<style></style>
