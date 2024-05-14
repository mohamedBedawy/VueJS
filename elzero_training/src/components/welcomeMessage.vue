<template>
    <div class="welcome-message">
        <h2> Welcome to the world</h2>
        <p>{{ mo7a }}</p>
    </div>
</template>

<script>
export default {
    name: 'WelcomeMessage',
    mo7a: String,
    props: {
        msg: String
    },
    data() {
        // this.mo7a= this.msg // it's Working 
        return {
            mo7a: this.msg
        }
    }
}
</script>
<style>
.welcome-message {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>