<template>
  <div
    class="relative pr-1"
    ref="containerRef"
    :style="{
      height: containerHeight + 'px' // 因为当前为 relative 布局，所以需要主动指定高度
    }"
  >
    <template v-if="data.length && colWidth">
      <div
        class="absolute duration-300"
        v-for="(item, index) of data"
        :style="{
          width: colWidth + 'px' // 列宽,根据容器宽度和指定的列数进行计算
        }"
        :key="nodeKey ? item[nodeKey] : index"
      >
        <slot
          :item="item"
          :width="colWidth"
          :index="index"
        />
      </div>
    </template>
    <template v-else>
      <div class="h-screen w-screen fixed top-0 left-0 flex items-center justify-center">
        <MsvgIcon
          name="loading"
          class="w-8 h-8 animate-spin mr-1"
        ></MsvgIcon>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';

interface Props {
  data: any[];
  nodeKey?: string;
  col?: number;
  colSpace?: number;
  rowSpace?: number;
  picturePreReading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  col: 2,
  colSpace: 20,
  rowSpace: 20,
  picturePreReading: true
});
// 容器高度
const containerRef = ref<Element>();
const containerHeight = ref(0);
const colHeightMap = ref<{ [key: number]: number }>([]); // 列高度的映射,方便求出瀑布流元素高度,每列初始化为0

// 计算每列的宽度,根据容器宽度 / 指定列数
const colWidth = ref(0);
const containerPL = ref(0); // 记录容器的左内边距,后面用于计算每一列距离容器左边框的位置
const spaceTotal = computed(() => {
  // 列间距总和
  return (props.col - 1) * props.colSpace;
});

let isResizeing = false;
function initColHeightMap() {
  colHeightMap.value = Object.fromEntries(new Array(props.col).fill(0).map((item, index) => [index + 1, item]));
}
function initColWidth() {
  const { width } = containerRef.value!.getBoundingClientRect();
  const { paddingLeft, paddingRight } = getComputedStyle(containerRef.value!, null);
  containerPL.value = parseFloat(paddingLeft);
  const containerWidth = width - parseFloat(paddingLeft) - parseFloat(paddingRight) - spaceTotal.value;
  colWidth.value = containerWidth / props.col;
}
onMounted(() => {
  initColHeightMap();
  initColWidth();
  window.addEventListener(
    'resize',
    debounce(() => {
      cleanAllDoneTag();
      isResizeing = true;
      initColHeightMap();
      initColWidth();
      nextTick(async () => {
        await beginLoad();
        isResizeing = false;
      });
    }, 300)
  );
});

// 预加载: 未指定图片高度时,需要预加载才能获取图片的offsetHeight
async function beginLoad() {
  const itemEls = [...containerRef.value!.children] as HTMLDivElement[];
  const needPreLoad = props.picturePreReading && !isResizeing;
  if (needPreLoad) {
    await waitAllImageLoad(itemEls);
  }
  setItemsPos(itemEls);
}
function setItemsPos(itmesEl: HTMLDivElement[]) {
  itmesEl.forEach(item => {
    computeItemsPos(item);
  });
  setContainerHeight();
}
function computeItemsPos(item: HTMLDivElement) {
  if (isHasDonetag(item)) {
    return;
  }
  addDoneTag(item);
  const { targetCol, targetHeight } = getMinOrMaxCol(colHeightMap.value, 'min');
  item.style.top = `${targetHeight}px`;
  item.style.left = `${getItemLeft(targetCol)}px`;

  restItemsHeightMap(targetCol, item.offsetHeight);
}

function addDoneTag(item: HTMLDivElement) {
  item.dataset.done = 'true';
}
function isHasDonetag(item: HTMLDivElement) {
  return !!item.dataset.done;
}
function cleanAllDoneTag() {
  const itemEls = [...containerRef.value!.children] as HTMLDivElement[];
  itemEls.forEach(item => {
    item.dataset.done = '';
  });
}
function setContainerHeight() {
  containerHeight.value = getMinOrMaxCol(colHeightMap.value, 'max').targetHeight;
}

/**
 * @message: 通过 new Image确保加载的img加载完毕,以便获取高度
 */
function waitAllImageLoad(itemEls: HTMLDivElement[]) {
  const imgLoadPromises = itemEls.map(item => {
    return new Promise(resolve => {
      if (isHasDonetag(item)) {
        // 加载过的元素就不需要再加载了,直接使用缓存
        resolve(0);
        return;
      }
      const imgEl = item.querySelector('img')!;
      const imageObj = new Image();
      imageObj.src = imgEl.src;
      imageObj.onload = () => {
        resolve(0);
      };
      imageObj.onerror = () => {
        resolve(0);
      };
    });
  });
  return Promise.all(imgLoadPromises);
}

function getItemLeft(key: number) {
  return containerPL.value + (key - 1) * (props.colSpace + colWidth.value);
}
/**
 * @message: 每选取一次最短列,就累加该列高,
 */
function restItemsHeightMap(key: number, val: number) {
  colHeightMap.value[key] += val + props.rowSpace;
}
/**
 * @message: 获取记录列高的对象中,最大或最小值
 */
function getMinOrMaxCol(colHeightMap: { [key: string]: number }, type: 'min' | 'max') {
  const mapArr = Object.entries(colHeightMap);
  if (type === 'max') {
    mapArr.sort((a, b) => b[1] - a[1]);
  } else {
    mapArr.sort((a, b) => a[1] - b[1]);
  }
  return { targetCol: Number(mapArr[0][0]), targetHeight: mapArr[0][1] };
}

watch(
  () => props.data,
  () => {
    nextTick(() => {
      initColWidth();
      beginLoad();
    });
  },
  {
    deep: true
  }
);
</script>
