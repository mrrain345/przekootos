<template>
  <div>
    <div :id="`messagebox-${id}`" class="messagebox" :class="{ 'active': display }">
      <input type="text" class="form-control" v-model="message" placeholder="Description"/>
      <div class="buttons">
        <button id="cancel" class="btn btn-light">Cancel</button>
        <button id="ok" class="btn btn-success">{{modify ? 'Save' : 'Vote'}}</button>
      </div>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LikeMessage',
  props: ['id', 'display'],
  data: () => ({
    modify: false,
    message: '',
  }),
};
</script>

<style scoped>
.messagebox {
  float: right;
  width: 0;
  opacity: 0;
  transition: all 0.3s;
  transition-timing-function: ease-out;
  overflow: hidden;
}

.messagebox.active {
  width: 100%;
  opacity: 1;
}

.buttons {
  height: 38px;
  float: right;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 8px;
  margin-top: 20px;
}

@media (min-width: 768px) {
  input {
    margin-top: -5px;
  }
}

#cancel {
  margin-right: 8px;
}
</style>
