import request from '@/utils/request'

export interface CalculatorCliRequest {
  commandLine: string
}

export interface CalculatorCliResponse {
  status: 'success' | 'error'
  output: string
}

export const executeCalculatorCliCommand = (
  data: CalculatorCliRequest,
): Promise<CalculatorCliResponse> => {
  return request({
    url: '/api/app-ideas/calculator-cli/exec',
    method: 'post',
    data: data,
  })
}
