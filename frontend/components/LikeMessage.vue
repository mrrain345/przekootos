<template>
  <div>
    <div class="messagebox" :class="{ 'active': display }">
      <input type="text" class="form-control" placeholder="Description"
         :value="value" @input="inputModel" maxlength="40"
      />
      <div class="message" :class="{ 'active': !display }">
        {{message}}
      </div>
      <div style="clear: both;"></div>
      <div class="buttons">
        <button class="cancel btn btn-light" @click="buttonClick('cancel')">Cancel</button>
        <button class="ok btn btn-success" @click="buttonClick('ok')">
          {{modify ? 'Save' : 'Vote'}}
        </button>
      </div>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LikeMessage',
  props: ['id', 'display', 'value', 'message'],
  data: () => ({
    modify: false,
  }),
  methods: {
    inputModel(e) {
      this.$emit('input', e.target.value);
    },
    buttonClick(btn) {
      if (btn === 'ok') this.$emit('ok');
      if (btn === 'cancel') this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.message {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #E3F2FD;
  text-align: left;
  float: right;
  opacity: 0;
  width: 0;
  transition: all 0.3s;
  transition-timing-function: ease-out;
  overflow: hidden;
  max-height: 72px;
}

.message.active {
  opacity: 1;
  width: 100%;
}

.messagebox {
  float: right;
  width: 100%;
}

input {
  float: right;
  width: 0;
  opacity: 0;
  transition: width 0.3s, opacity 0.3s;
  transition-timing-function: ease-out;
  overflow: hidden;
  pointer-events: none;
  padding: 0;
  border-width: 0;
  display: block;
  margin-top: 0;
  margin-bottom: 8px;
}

.active input {
  width: 100%;
  opacity: 1;
  pointer-events: inherit;
  padding: 6px 12px;
  border-width: 1px;
  margin-top: 20px;
}

@media (min-width: 768px) {
  .message {
    text-align: right;
  }

  input {
    margin-top: -5px;
  }

  .active input {
    margin-top: -5px;
  }
}

.buttons {
  height: 0;
  float: right;
  opacity: 0;
  transition: all 0.15s;
  transition-timing-function: ease-out;
  pointer-events: none;
}

.active .buttons {
  height: 38px;
  opacity: 1;
  pointer-events: inherit;
}

.cancel {
  margin-right: 8px;
}
</style>
