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
            <v-text-field
                hide-details="auto"
                label="Type in your username"
                style="width: 400px"
                v-model="newUsername">
            </v-text-field>
            <v-btn
                style="width: 400px"
                color="primary"
                @click="$emit('username-changed', newUsername)"
                >Submit</v-btn
            >
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
            newUsername.value = username;
        });

        return {
            newUsername,
        };
    },
});
</script>

<style></style>
