import type { Environment } from 'aws-cdk-lib';

export interface AppParameter {
  envName: string;
  projectName: string;
  env: Environment;
}

export const prdParameter: AppParameter = {
  envName: 'prd',
  projectName: 'prd-chapter10',
  env: {
    account: '333333333333',
    region: 'ap-northeast-1',
  }
}

// 環境名をキーにしてパラメータを設定
const appParameters: Record<string, AppParameter> = {
  prd: prdParameter
};

export const getAppParameters = (envKey: string): AppParameter => {
  // 環境名が存在するか確認
  if(!appParameters[envKey]){
    throw new Error(`Not found environment key: ${envKey}`);
  }
  const params = appParameters[envKey];

  return params;
};