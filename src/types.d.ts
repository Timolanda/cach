declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-dotenv' {
  export const NEXT_PUBLIC_API_URL: string;
  export const NEXT_PUBLIC_BLOCKCHAIN_NETWORK: string;
  export const NEXT_PUBLIC_INFURA_ID: string;
  export const NEXT_PUBLIC_OPENAI_API_KEY: string;
} 