import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { GithubOidcSampleStack } from '../lib/github-oidc-sample-stack';
import { LambdaStack } from '../lib/lambda-stack';

test('Snapshot Test for GithubOidcSample', () => {
  const app = new cdk.App();
  const githubOidcSampleStack = new GithubOidcSampleStack(app, 'TestStack');
  const lambdaStack = new LambdaStack(app, 'LambdaStack', {})

  const template = Template.fromStack(githubOidcSampleStack);
  const lambdaTemplate = Template.fromStack(lambdaStack);

  expect(template.toJSON()).toMatchSnapshot();
  expect(lambdaTemplate.toJSON()).toMatchSnapshot();
});