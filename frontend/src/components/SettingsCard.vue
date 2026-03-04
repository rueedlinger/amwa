<template>
  <div class="backdrop-blur-lg bg-white/80 rounded-2xl shadow-xl p-6 text-center space-y-6">
    <h2 class="text-2xl font-semibold text-center text-black mb-4">Settings</h2>

    <table class="table-auto w-full text-sm border-separate border-spacing-0 bg-white/30">
      <thead>
        <tr class="bg-gradient-to-r from-purple-500 to-blue-400 text-white">
          <th class="px-2 py-1 text-left border-b border-dashed border-black/30">Setting</th>
          <th class="px-2 py-1 text-left border-b border-dashed border-black/30">Value</th>
        </tr>
      </thead>
      <tbody>
        <!-- Speed Wheel -->
        <tr class="hover:bg-gray-50 transition">
          <td class="px-2 py-1 border-b border-dashed border-black/30 text-left">
            Speed Wheel Circumference (m)
          </td>
          <td class="px-2 py-1 border-b border-dashed border-black/30">
            <input
              v-model.number="localSettings.speed_wheel_circumference_m"
              type="number"
              step="0.001"
              min="0"
              :disabled="isRunning || loading"
              class="border border-black/100 rounded px-2 py-1 w-full bg-white/50 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="0.000"
            />
          </td>
        </tr>

        <!-- Distance Wheel -->
        <tr class="hover:bg-gray-50 transition">
          <td class="px-2 py-1 border-b border-dashed border-black/30 text-left">
            Distance Wheel Circumference (m)
          </td>
          <td class="px-2 py-1 border-b border-dashed border-black/30">
            <input
              v-model.number="localSettings.distance_wheel_circumference_m"
              type="number"
              step="0.001"
              min="0"
              :disabled="isRunning || loading"
              class="border border-black/100 rounded px-2 py-1 w-full bg-white/50 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="0.000"
            />
          </td>
        </tr>

        <!-- Age -->
        <tr class="hover:bg-gray-50 transition">
          <td class="px-2 py-1 border-b border-dashed border-black/30 text-left">Age</td>
          <td class="px-2 py-1 border-b border-dashed border-black/30">
            <input
              v-model.number="localSettings.age"
              type="number"
              min="1"
              :disabled="isRunning || loading"
              class="border border-black/100 rounded px-2 py-1 w-full bg-white/50 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="18"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Submit Button -->
    <div class="flex justify-center gap-4 flex-wrap mt-4">
      <button
        :disabled="loading || isRunning"
        class="px-6 py-2 rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        @click="submitSettings"
      >
        <div
          v-if="loading"
          class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></div>
        <span>
          {{ loading ? 'Updating...' : 'Update Settings' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, computed } from 'vue';
import axios from 'axios';
import { API } from '../config.js';
import { ToastType } from '../constants/toastType.js';
import { useMetricsStream } from '../composables/useStreams.js';

const emit = defineEmits(['show-toast']);
const loading = ref(false);
const { metrics } = useMetricsStream();
const isRunning = computed(() => !!metrics.is_running);

const localSettings = reactive({
  speed_wheel_circumference_m: null,
  distance_wheel_circumference_m: null,
  age: null,
});

async function loadSettings() {
  try {
    const { data } = await axios.get(API.baseUrl + API.endpoints.getSettings);
    Object.assign(localSettings, data);
  } catch (err) {
    emit('show-toast', {
      message: err.response?.data?.message || err.message || 'Failed to load settings',
      title: 'Error',
      type: ToastType.ERROR,
    });
  }
}

watch(isRunning, (running) => {
  if (!running) loadSettings();
});

async function submitSettings() {
  if (loading.value) return;
  loading.value = true;
  try {
    const payload = { ...localSettings };
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '' || payload[key] === undefined) payload[key] = null;
    });
    const res = await axios.post(API.baseUrl + API.endpoints.updateSettings, payload);
    Object.assign(localSettings, res.data ?? payload);
    emit('show-toast', {
      message: 'Settings updated successfully!',
      title: 'Settings',
      type: ToastType.SUCCESS,
    });
  } catch (err) {
    emit('show-toast', {
      message:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update settings',
      title: 'Error',
      type: ToastType.ERROR,
    });
  } finally {
    loading.value = false;
  }
}

onMounted(loadSettings);
</script>
