<template>
    <div></div>
</template>
<script>
import { getFriendList } from '@/api';
import { mapState } from 'vuex';
const { photoUrl } = window.__gconf;
export default {
    data() {
        return {
            list:[]
        }
    },
    mounted() {
        this.getFriendList();
    },
    methods: {
        getFriendList() {
            getFriendList().then((res) => {
                const data = res.data.data;
                let result = [];
                Object.keys(data).forEach((key) => {
                    result = result.concat(data[key].data);
                });
                this.list = result.map((item) => {
                    return {
                        ...item,
                        isSelect: false
                    };
                });
            });
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>