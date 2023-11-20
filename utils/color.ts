import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'

const fullConfig = resolveConfig(tailwindConfig);
const Color = fullConfig.theme?.colors! as any;

export default Color;