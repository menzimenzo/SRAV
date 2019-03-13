<template>
    <svg x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;">
    <g>
        <path class="st1" d="M72,31.5H28c-0.7,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5h44c0.8,0,1.5,0.7,1.5,1.5S72.8,31.5,72,31.5z"/>
        <path class="st1" d="M50,31.3c-0.8,0-1.5-0.7-1.5-1.5v-6c0-0.7,0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5v6C51.5,30.5,50.8,31.3,50,31.3z"/>
        <path class="st1" d="M50,67.3c-0.5,0-1-0.5-1-1V43.8c0-0.5,0.5-1,1-1s1,0.5,1,1v22.5C51,66.8,50.8,67.3,50,67.3z"/>
        <path class="st1" d="M57.3,67.3c-0.5,0-1-0.5-1-1V43.8c0-0.5,0.5-1,1-1s1,0.5,1,1v22.5C58.3,66.8,57.7,67.3,57.3,67.3z"/>
        <path class="st2" d="M64.5,47.5"/>
        <path class="st1" d="M43,67.3c-0.5,0-1-0.5-1-1V43.8c0-0.5,0.5-1,1-1c0.5,0,1,0.5,1,1v22.5C43.8,66.8,43.5,67.3,43,67.3z"/>
        <path class="st1" d="M63,77.8H37c-3,0-5.5-2.8-5.5-6.3L29,38.3c0-0.8,0.5-1.5,1.3-1.5s1.5,0.5,1.5,1.3l2.5,33.3l0,0
            c0,1.8,1.3,3.3,2.7,3.3h25.7c1.5,0,2.8-1.5,2.8-3.3l0,0L68,38c0-0.7,0.8-1.5,1.5-1.3c0.8,0,1.5,0.8,1.3,1.5l-2.5,33.3
            C68.5,75,66,77.8,63,77.8z"/>
    </g>
    <g class="st3">
        <g class="st4">
            <rect y="25" class="st5" width="100" height="50"/>
            <rect x="25" class="st5" width="50" height="100"/>
            <polyline class="st5" points="100,0 0,100 50,100 50,0 0,0 100,100 100,50 0,50"/>
            <circle class="st5" cx="50" cy="50" r="50"/>
            <rect x="14.6" y="14.6" class="st5" width="70.7" height="70.7"/>
            <circle class="st5" cx="50" cy="50" r="35.4"/>
            <circle class="st5" cx="50" cy="50" r="25"/>
            <circle class="st5" cx="50" cy="50" r="12.5"/>
        </g>
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
.st0{fill:#EA5051;}
.st1{fill:#FFFFFF;}
.st2{fill:none;stroke:#FFFFFF;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
.st3{display:none;}
.st4{display:inline;}
.st5{fill:none;stroke:#000000;stroke-width:0.1;stroke-miterlimit:10;}
</style>
