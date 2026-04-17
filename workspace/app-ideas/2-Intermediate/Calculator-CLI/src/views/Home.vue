<script setup lang="ts">
import { SuccessFunc, FailedFunc } from 'vue-web-terminal'
import { executeCalculatorCliCommand } from '@/api/calculatorcli'

/**
 * 注意这里必须加上 async，因为 executeCalculatorCliCommand 返回的是 Promise
 */
const onExecCmd = async (
  key: string,
  command: string,
  success: SuccessFunc,
  failed: FailedFunc,
) => {
  // 1. 基础校验：空指令不转发
  if (!command.trim()) {
    failed('')
    return
  }

  try {
    // 2. 发送请求：将终端的 command 映射给 DTO 的 commandLine
    // 这里使用了 await，程序会在这里“等”后端返回
    const res = await executeCalculatorCliCommand({ commandLine: command })

    // 3. 处理业务逻辑
    // 这里的 res 结构取决于你在 axios 拦截器里是否已经剥离了 .data
    if (res.status === 'success') {
      success(res.output)
    } else {
      failed(res.output)
    }
  } catch (error) {
    // 4. 处理网络级错误（如 500、断网等）
    console.error('API Error:', error)
    failed('Fatal Error: 无法连接到计算服务器，请检查后端状态。')
  }
}
</script>

<template>
  <div class="h-screen w-full overflow-hidden bg-[#1e1e1e]">
    <terminal
      name="calc-terminal"
      theme="dark"
      title="Calculator CLI - Powered by Spring Boot"
      :init-log="['Welcome to Calculator CLI! Type \'help\' or \'--help\' to get started.']"
      :enable-default-command="false"
      @exec-cmd="onExecCmd"
    />
  </div>
</template>
