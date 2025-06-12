<template>
  <div class="calculation-step-layout flex justify-center align-middle flex-col min-h-screen p-4">
    <div class="calculation-step-layout__step-info flex justify-center align-middle">
      <slot name="step-info" />
    </div>

    <div class="calculation-step-layout__component flex flex-1 flex-wrap justify-center">
      <div class="calculation-step-layout__component__wrapper">
        <slot name="step-view" />
      </div>
    </div>

    <div class="calculation-step-layout__navigation">
      <slot name="navigation" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.calculation-step-layout {
  &__component {
    &__wrapper {
      display: flex;
      align-items: flex-start;
      width: 100%;
      margin-bottom: 48px;
    }
  }

  &__navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 999;
    padding: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px 0, rgba(0, 0, 0, 0.1) 0 0 1px 0;
  }
}

.self-align-center {
  align-self: center;
}

.hs-screen {
  height: 100vh;
  height: 100dvh;
}
</style>
