<template>
    <div
        class="position-absolute d-flex"
        style="
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2;
        ">
        <div>
            <div>
                <a
                    class="v-btn v-btn--elevated v-theme--dark bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated"
                    href="https://www.worldcubeassociation.org/oauth/authorize?client_id=veUGFyAGSPOnGaI2jpEzn6hZX6FPxnRGyGyf0NEY6N0&client_secret=1aGASn8lsLAVHWz8tUlremODceIazL6CPwUTUH9iu-Y&redirect_uri=https%3A%2F%2Fspeedcubing-timer.netlify.app%2F&response_type=code&scope="
                    >Login using wca</a
                >
            </div>
            <v-divider class="border-opacity-100 my-4"></v-divider>
            <div>
                <v-text-field
                    hide-details="auto"
                    label="Type in your username"
                    style="width: 400px"
                    v-model="newUsername"
                    prepend-inner-icon="mdi-account-circle">
                </v-text-field>
                <v-btn
                    style="width: 400px"
                    color="primary"
                    @click="
                        newUsername = newUsername.replaceAll(/\s/g, '');
                        newUsername.length > 0 &&
                        !newUsername.startsWith('wca-') &&
                        !(newUsername.length > 28)
                            ? $emit('username-changed', newUsername)
                            : null;
                    "
                    >Submit</v-btn
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
    props: ["username"],
    setup(props) {
        let newUsername = ref<string>(props.username);

        watch(props.username, (username: string) => {
            newUsername.value = username.toLowerCase();
        });

        return {
            newUsername,
        };
    },
});
</script>

<style></style>
