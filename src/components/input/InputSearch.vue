<template>
  <div class="inputSearch">
    <div class="inputSearch__icon">
      <el-icon>
        <Search />
      </el-icon>
    </div>
    <input placeholder="Type to search..." v-model="keyword" @keyup.enter="handleSearch"/>
  </div>
</template>

<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ref } from 'vue'

  const router = useRouter()
  const route = useRoute()
  const keyword = ref('');

  const handleSearch = ()=>{
    router.push({
      query:{
        ...route.query,
        keyword:keyword.value
      }
    })
    keyword.value = "";
  }

</script>

<style lang="scss" scoped>
   .inputSearch{
     padding: 5px 10px;
     border: 1px solid #333333;
     position: relative;
     border-radius: 5px;
     width: 350px !important;


     &__icon{
       width: 20px;
       height: 20px;
       position: absolute;
       right: 18px;
       top: 8px;
     }
     input{
       width: 100%;
       height: 100%;
       border: none;
       outline: none;
       padding-right:30px;
     }
   }
</style>