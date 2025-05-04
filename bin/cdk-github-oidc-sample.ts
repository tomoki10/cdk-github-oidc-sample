#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { getAppParameters } from './parameter';
import { GithubOidcSampleStack } from '../lib/github-oidc-sample-stack';
import { LambdaStack } from '../lib/lambda-stack';

const app = new cdk.App();

const argContext = 'environment';
const envKey = app.node.tryGetContext(argContext);
const appParameter = getAppParameters(envKey);

new GithubOidcSampleStack(app, 'CdkGithubOidcSampleStack', {
  // HAK: 本来以下の記述が正しいですが、パブリックリポジトリでアカウントIDを公開しないために
  //      GitHub EnvironmentのSecretをCLIのオプションから差し込みます。
  // env: appParameter.env
  env: {
    region: appParameter.env.region,
    account: app.node.tryGetContext('accountId'),
  },
});

new LambdaStack(app, 'LambdaStack', {
  env: {
    region: appParameter.env.region,
    account: app.node.tryGetContext('accountId'),
  },
});