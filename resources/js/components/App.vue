<template>
    <div>
        <h1>Проект Gbmoney - деньги любят счёт :)</h1>

        <p>
            <router-link :to="{ name: 'home' }">На главную</router-link> |
            <router-link :to="{ name: 'user' }">Пользователь</router-link>
        </p>

        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    export default {}
</script>
