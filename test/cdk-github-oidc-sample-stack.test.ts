import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkGithubOidcSampleStack } from '../lib/cdk-github-oidc-sample-stack';

test('Snapshot Test for CdkGithubOidcSampleStack', () => {
  const app = new cdk.App();
  const stack = new CdkGithubOidcSampleStack(app, 'TestStack');

  const template = Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});