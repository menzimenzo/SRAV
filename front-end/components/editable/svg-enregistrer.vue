<template>
    <svg x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;">
        <g>
            <svg y="14">
                <rect x="14.7" y="63.1" fill="none" width="70.6" height="11.9"/>
                <path :fill="color" d="M57.6,16.8L68,27.1v24c0,0.9-0.7,1.6-1.6,1.6H33.6c-0.9,0-1.6-0.7-1.6-1.6V18.4c0-0.9,0.7-1.6,1.6-1.6H57.6
                    M58.6,14.3h-25c-2.2,0-4,1.8-4,4v32.7c0,2.2,1.8,4,4,4h32.7c2.2,0,4-1.8,4-4v-25C65.8,21.5,63.2,18.9,58.6,14.3L58.6,14.3z"/>
                <path :fill="color" d="M53,15.5v6.9c0,0.5-0.4,0.8-0.8,0.8H37.6c-0.5,0-0.8-0.4-0.8-0.8v-6.9H53 M54.2,14.3H35.6v8.2
                    c0,1.1,0.9,2,2,2h14.6c1.1,0,2-0.9,2-2V14.3L54.2,14.3z"/>
                <path :fill="color" d="M63.2,36v12H36.8V36H63.2 M64.4,34.7H35.6v14.4h28.9V34.7L64.4,34.7z"/>
                <rect x="50" y="17" :fill="color" width="1.7" height="5.1"/>
            </svg>
        </g>
    </svg>
</template>

<script>
export default {
  props:{
      color: String
  }
}
</script>

<style lang="scss" scoped>
svg{
    width: 32px;
    height: 32px;
}
</style>
