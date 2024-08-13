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
                <v-btn @click="$emit('log-wca')"
                    ><button>Login through WCA</button></v-btn
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
                    color="background"
                    @click="
                        newUsername = newUsername.replaceAll(/\s/g, '');
                        newUsername.length > 0 &&
                        !newUsername.startsWith('wca-') &&
                        !(newUsername.length > 28)
                            ? $emit('username-changed', newUsername)
                            : null;
                    "
                    ><button>Submit</button></v-btn
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
        const jscookie = require("js-cookie");

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
