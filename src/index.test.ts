import env from '.'

describe('rollup-plugin-process-env', () => {
  it('should have name', () => {
    expect(env('').name).toBe('rollup-plugin-process-env')
  })
})
