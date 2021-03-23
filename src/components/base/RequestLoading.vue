<template>
    <div class="request_loading_wrap">
        <div class="request_loading_bg">
            <div class="scroll_white"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'request-loading',
};
</script>

<style scoped>
    .request_loading_wrap{
        padding-top: 140px;
        width: 100%;
        padding-bottom: 400px;
    }
    .request_loading_bg{
        width: 150px;
        height: 48px;
        background: #e4e4e4;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    }
    .scroll_white{
        width: 25px;
        height: 25px;
        position: absolute;
        background: white;
        opacity: 0.6;
        border-radius: 25px;
        left: -25px;
        top: 15px;
        filter: blur(10px);
        animation: move 2.5s infinite;
    }
    @keyframes move {
        from {  left: -25px;  }
        to {  left: 175px;  }
    }
    @-moz-keyframes move {
        from {
            left: -25px;
        }
        to {
            right: -25px;
        }
    }
    @-webkit-keyframes move {
        from {
            left: -25px;
        }
        to {
            right: -25px;
        }
    }
    @-o-keyframes move {
        from {
            left: -25px;
        }
        to {
            right: -25px;
        }
    }
</style>
