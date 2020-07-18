<template>
    <div>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <feed :withEditor="false"></feed>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import feed from "../feed/Feed";

    export default {
        name: "monthlyReport",
        components: {
            feed
        }
    }
</script>

<style scoped>

</style>
