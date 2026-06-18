<template>
  <div class="dropdownCustom">
    <el-dropdown popper-class="category-dropdown" @visible-change="handleVisibleChange">
      <span style="font-size: 20px;font-weight: 500;color: #000000">{{ props.title }}</span>
      <template #dropdown>
        <el-dropdown-menu style="max-height: 200px!important;overflow-y: auto" @scroll.passive="handleScroll">
          <el-dropdown-item v-for="(item,index) in listItem" :key="index" style="width: 200px!important;">
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">

  const props = defineProps<{
    title?: string,
    listItem?: {
      name: string;
    }[],
  }>();

  const emit = defineEmits(['loadMore', 'open']);

  let hasLoaded = false;

  // Chỉ emit 'open' lần đầu tiên dropdown được mở (hover/click)
  const handleVisibleChange = (visible: boolean) => {
    if (visible && !hasLoaded) {
      hasLoaded = true;
      emit('open');
    }
  }

  const handleScroll = (e: Event) => {
    const ev = e.target as HTMLElement;
    if (ev.scrollTop + ev.clientHeight >= ev.scrollHeight - 20) {
      emit('loadMore');
    }
  }

</script>